# RecySmart OS Backend - Microservices Architecture Review

I have reviewed the backend codebase located in [ms-launcher](file:///C:/Users/JOHAN/Documents/JP/RecySmart/ms-launcher). Below is a comprehensive breakdown of the system architecture, event flows, and domain models.

---

## 1. System Topology Overview

RecySmart OS uses an **Event-Driven Microservices Architecture** built with NestJS, Python, PostgreSQL, Redis, NATS, and MQTT.

```mermaid
graph TD
    %% Clients
    Flutter[Flutter Mobile App]
    AdminWeb[Next.js Admin Web App]
    ESP32[ESP32 Smart Bin Hardware]

    %% Gateways
    ClientGateway[Client Gateway - NestJS]
    IoTGateway[IoT Gateway - NestJS]

    %% Message Brokers
    NATS[NATS Message Bus - Port 4222]
    MQTT[Mosquitto MQTT - Port 1883]

    %% Microservices
    AuthMS[Auth MS - NestJS]
    RecyclingMS[Recycling MS - NestJS]
    GamificationMS[Gamification MS - NestJS]
    YoloMS[YOLO MS - Python / YOLOv8]

    %% Databases
    AuthDB[(Auth PostgreSQL - Port 6432)]
    RecyclingDB[(Recycling PostgreSQL - Port 6433)]
    GamificationDB[(Gamification PostgreSQL - Port 6434)]
    Redis[(Redis Cache - Timeout Store)]

    %% Connections - Clients to Gateways
    Flutter -->|HTTP/REST| ClientGateway
    AdminWeb -->|HTTP/REST| ClientGateway
    ESP32 -->|MQTT Pub/Sub| MQTT
    MQTT <-->|Bridge| IoTGateway

    %% Connections - Gateways to NATS
    ClientGateway <-->|NATS Request/Reply| NATS
    IoTGateway <-->|NATS Publish/Subscribe| NATS

    %% Connections - Services to NATS
    AuthMS <-->|NATS Bus| NATS
    RecyclingMS <-->|NATS Bus| NATS
    GamificationMS <-->|NATS Bus| NATS
    YoloMS <-->|NATS Request/Reply| NATS

    %% Connections - Services to Databases
    AuthMS --> AuthDB
    RecyclingMS --> RecyclingDB
    RecyclingMS --> Redis
    GamificationMS --> GamificationDB
```

---

## 2. End-to-End Recycling Session Lifecycle

The following diagram illustrates how the components coordinate dynamically when a citizen interacts with a Smart Bin:

```mermaid
sequenceDiagram
    autonumber
    actor Recycler as Citizen (Mobile App)
    actor Hardware as Smart Bin (ESP32)
    participant CG as Client Gateway
    participant RMS as Recycling MS
    participant YMS as YOLO MS (Python)
    participant GMS as Gamification MS

    %% 1. Scan QR and Start Session
    Recycler->>CG: POST /iot/bin/start/session (binId, GPS, qrToken)
    CG->>RMS: NATS command: session.start
    Note over RMS: GPS Validation (Haversine Formula)<br/>QR Verification (Token Expiration)
    RMS-->>CG: Session Valid & Created
    CG-->>Recycler: Display: "Session Started. Insert Bottle."
    
    %% 2. Wake Up hardware tray
    RMS->>CG: NATS event: iot.hardware.command (ACTIVATE_TRAY)
    CG->>Hardware: MQTT: command (ACTIVATE_TRAY)

    %% 3. Citizen drops bottle
    Note over Recycler,Hardware: Citizen inserts empty plastic bottle
    Hardware->>CG: MQTT: bottle_drop (weightGrams, photoUrl)
    CG->>RMS: Process drop event

    %% 4. AI Vision and Weight Verification
    RMS->>YMS: NATS Request: ai.vision.analyze (photoUrl)
    Note over YMS: Download image to RAM<br/>Run YOLOv8 inference
    YMS-->>RMS: NATS Response: class (PET_BOTTLE), confidence (0.94)
    Note over RMS: Run Rule Engine:<br/>1. Is YOLO Class == PET_BOTTLE?<br/>2. Is Weight between 10g and 60g?<br/>3. Is AI Confidence >= 20%?

    alt Bottle Accepted
        RMS->>CG: NATS event: iot.hardware.command (UNLOCK_DOOR)
        CG->>Hardware: MQTT: Unlock door (bottle drops to storage)
        RMS->>CG: NATS event: app.ui.event (bottle_accepted)
        CG-->>Recycler: Mobile App UI: "Bottle accepted! +1"
    else Bottle Rejected
        RMS->>CG: NATS event: iot.hardware.command (REJECT_BOTTLE)
        CG->>Hardware: MQTT: Reject tray (beep / keep closed)
        RMS->>CG: NATS event: app.ui.event (bottle_rejected)
        CG-->>Recycler: Mobile App UI: "Item rejected: Invalid material"
    end

    %% 5. Close Session & Award Points
    Recycler->>CG: POST /session/finish
    CG->>RMS: NATS command: session.close
    Note over RMS: Lock session status to COMPLETED<br/>Calculate final metrics
    RMS->>GMS: NATS Event: gamification.session.completed (userId, bottles, totalWeight)
    Note over GMS: Update Citizen Wallet Balance<br/>Award Points & Check Levels
    RMS-->>CG: Close Acknowledged
    CG-->>Recycler: Mobile App UI: "Recycling completed successfully!"
```

---

## 3. Microservice Architecture Breakdown

### 🔑 Authentication Service (`auth-ms`)
* **Framework**: NestJS & Prisma
* **Database**: PostgreSQL (Port `6432`)
* **Domain Model**:
  * `User`: Stores credentials, status, and role-based permissions (`ADMIN`, `RECYCLER`, `ALLY`).
* **Role Definitions**:
  * `ADMIN`: Accesses the web dashboard (`recysmart-admin-web`) to monitor IoT networks, view global KPIs, and configure settings.
  * `RECYCLER`: Citizen user who scans QR codes on bins, tracks ecological statistics, and redeems coupons via the mobile app.
  * `ALLY`: Partner companies (brands) who list rewards/coupons and redeem them at checkout.

### ♻️ Recycling Service (`recycling-ms`)
* **Framework**: NestJS & Prisma
* **Database**: PostgreSQL (Port `6433`) & Redis (Timeout Management)
* **Domain Models**:
  * `SmartBin`: Represents physical IoT bins. Stores GPS coordinates (`latitude`/`longitude`), `status` (`IDLE`, `ACTIVE`, `FULL`, `MAINTENANCE`), `apiKey` (ESP32 authorization), and dynamic `qrToken` (rotating code to prevent photo-based scanning fraud).
  * `Session`: Manages active user sessions at bins. Stores active user references, count of accepted bottles, and elapsed time.
  * `BottleDrop`: Logs each bottle insert attempt. Stores weight, image URL, AI confidence score, and status (`ACCEPTED`, `REJECTED_WEIGHT`, `REJECTED_AI`).

### 🏆 Gamification Service (`gamification-ms`)
* **Framework**: NestJS & Prisma
* **Database**: PostgreSQL (Port `6434`)
* **Domain Models**:
  * `Wallet`: Holds user point balances (`currentBalance`, `lifetimeEarned`) and aggregate statistics (total weight recycled).
  * `Level`: Threshold configurations for levelling up (e.g., "Eco Beginner" to "Recycle Master").
  * `PointTransaction`: Idempotent log of points earned (from recycling sessions) or spent (redeeming coupons).
  * `PartnerCompany`: Profile data of allied brands (supermarkets, retail shops) who fund and publish rewards.
  * `Reward` / `UserCoupon`: Reward details (points cost, stock availability) and coupons generated for users, including security QR codes for store redemptions.

### 🧠 AI Vision Service (`yolo-ms`)
* **Framework**: Python, OpenCV, `ultralytics` (YOLOv8), and `nats-py`
* **Inference Model**: Pre-trained YOLOv8 nano model (`yolov8n.pt`).
* **Optimized Pipeline**:
  * Subscribes to the NATS channel `ai.vision.analyze`.
  * Downloads images directly into RAM buffers using `aiohttp` and OpenCV (`imdecode`) to bypass disk write latencies.
  * Checks if object detection locates a `"bottle"`, outputs a confidence score, and replies instantly back to the NestJS rule engine over NATS.

---

## 4. Key Engineering & Security Highlights

1. **Anti-Spoofing GPS Engine**:
   To prevent users from trying to start a session from home using fake GPS coordinates, `recycling-ms` calculates physical distance using the **Haversine formula** comparing the citizen's mobile GPS data with the bin's static coordinates. The transaction is rejected if they are further than **10 meters** away.
2. **Rotating QR Codes**:
   To prevent citizens from printing or taking a photo of a bin's QR code and scanning it repeatedly from elsewhere, the Smart Bin displays a rotating QR code backed by a dynamic `qrToken` in the database that has short-lived expirations.
3. **Idempotent Transactions**:
   Points are credited to user wallets only when NATS processes the `'gamification.session.completed'` event. Each point transaction tracks a `reference` (the unique `sessionId`) to enforce absolute database idempotency, preventing double-credits.
