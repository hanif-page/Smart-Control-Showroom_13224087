# Smart Control Showroom (Problem 3.1.c)

### IoT-PLC Team Case Study - ITB de Labo 2026 Recruitment

##### Developed by Muhammad _Ammar Hanif (13224087)_

## Overview

This project implements a device orchestration layer that abstracts multiple IoT communication protocols (Cloud API, Local API, MQTT) behind a single unified command interface, following a **Facade Design Pattern**. It includes a live-syncing Digital Twin dashboard demonstrating bidirectional state consistency between physical devices and their web app representation.

[Quick Demo Video (1:58 minute)](https://drive.google.com/file/d/1ZrYcAsu56xv0xfQ7jteQGShPJWNSEWMO/view?usp=sharing)

## Solution Screenshot (Web App form)
![Screenshot 1](./client/public/web_app_screenshot1.png)
![Screenshot 1](./client/public/web_app_screenshot2.png)

---

## Project Structure

```
project-root/
├── backend/                        # Backend (Node.js + Express)
│   ├── config/
│   │   ├── mongo.js                # MongoDB connection setup
│   │   ├── redis.js                # Redis client setup
│   │   └── socket.js               # Socket.IO server + Redis keyspace listener
│   ├── models/
│   │   ├── deviceCompleteModel.js  # MongoDB schema for device registry & metadata
│   │   └── deviceStateModel.js     # Redis read/write helpers for live device state
│   ├── adapters/
│   │   ├── switchBotAdapter.js     # Cloud API protocol adapter
│   │   ├── natureRemoAdapter.js    # Local API protocol adapter
│   │   └── roombaAdapter.js        # MQTT protocol adapter
│   ├── services/
│   │   ├── commandRouter.js        # Facade for setting up routes commands to correct adapter
│   │   ├── statePoller.js          # Background polling (Cloud API / Local API sync)
│   │   └── mqttSubscriber.js       # Persistent MQTT listener (Roomba live sync)
│   ├── controllers/
│   │   ├── deviceController.js     # HTTP request/response handling
│   │   └── webhookController.js    # Receives vendor push notifications
│   ├── routes/
│   │   ├── deviceRoutes.js
│   │   └── webhookRoutes.js
│   ├── seed.js                     # Populates dummy device registry in MongoDB
│   ├── server.js                   # Main entry point, this file wires all modules together
│   └── package.json
│
└── client/                         # Frontend (React + Vite + Tailwind CSS)
    ├── public/
    │   └── Nakayama_Logo.png
    |   ├── .... (png files)
    ├── src/
    │   ├── components/
    │   │   ├── DeviceCard.jsx      # Renders one device's control card
    │   │   └── StatusDot.jsx       # Red/green status indicator
    │   ├── hooks/
    │   │   └── useDeviceSocket.js  # Fetches devices + subscribes to socket.io
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── tailwind.config.js
    ├── postcss.config.js
    └── package.json
```

---

## System Design

**Pattern used:** Facade Design Pattern

- **Client:** React dashboard, only use one endpoint (`POST /api/devices/command`)
- **Facade:** `commandRouter.js`, a single entry point that inspects a device's registered protocol and delegates to the matching adapter
- **Subsystem classes:** `switchBotAdapter.js`, `natureRemoAdapter.js`, `roombaAdapter.js`. Each of the file is isolated, unaware of the router or each other, and each of it is responsible to only translating generic commands into vendor-specific calls

Adding a new device type requires only a new adapter file, so no changes to the router, controller, or frontend.

**Database split:**

| Database | Purpose | Data (Example) |
|---|---|---|
| MongoDB | Static, rarely-changing metadata | Device registry, credentials, protocol type, GLB digital twin mapping |
| Redis | Live, frequently-changing state | Current power/temp/status per device, with real-time pub/sub |

**Real-time sync layer:** Redis keyspace notifications → Socket.IO server → all connected dashboard clients, so every state change (regardless of source) reaches every open browser session simultaneously.

**One-time Redis Keyspace Notifications** 
```bash
# run this in the terminal
redis-cli config set notify-keyspace-events KEA
```

---

## Data Pipeline

### Flow 1 : Web App (Dashboard) -> Physical Device

1. User clicks a control (e.g. "Turn ON") on the React dashboard
2. Frontend sends `POST /api/devices/command` with `{ deviceID, command, currentState }`
3. `deviceController.js` receives the request, calls `commandRouter.js`
4. `commandRouter.js` looks up the device's protocol in MongoDB
5. Router delegates to the matching adapter (`switchBotAdapter` / `natureRemoAdapter` / `roombaAdapter`)
6. Adapter executes the vendor-specific command against the physical device
7. On success, the new state is written to Redis
8. Redis fires a keyspace notification on that key change
9. `socket.js` listener catches the notification, reads the updated value, and emits `deviceStateChanged` via Socket.IO
10. Every connected browser session (physical device card + digital twin card) receives the event and updates its UI simultaneously

### Flow 2 : Physical Device -> Web App (Dashboard)

This covers the case where a device's real state changes independently of the dashboard (manual button press, natural state drift, etc...), keeping the Digital Twin accurate all the times.

**For MQTT devices (Roomba):**
1. `mqttSubscriber.js` maintains a persistent connection to the device's local MQTT broker
2. Device publishes a state-change message on its own (push-based, no polling)
3. Subscriber receives the message, writes new state to Redis
4. Same Redis -> Socket.IO -> dashboard flow same as Flow 1 from steps 8-10

**For Cloud API / Local API devices (SwitchBot / Nature Remo):**
1. `statePoller.js` runs on a fixed interval:
   - Cloud API devices: every 60s (justification: to protects vendor rate quota)
   - Local API devices: every 15s (justification: because it has no quota limit, same LAN, so we just call it far rapidly that the Cloud API)
2. Poller fetches the device's actual current state from the vendor
3. New state is written to Redis
4. Same Redis -> Socket.IO -> dashboard flow same as Flow 1 from steps 8-10
