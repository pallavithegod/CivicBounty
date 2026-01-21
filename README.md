# 🛡️ CivicBounty
### Decentralized Autonomous Civic Infrastructure

![Status](https://img.shields.io/badge/Status-Beta-purple) ![Network](https://img.shields.io/badge/Network-Stellar%20Testnet-blue) ![License](https://img.shields.io/badge/License-MIT-green)

> **"The world's first Proof-of-Civic-Work platform."**

CivicBounty is a decentralized application (dApp) built on the **Stellar Network** that gamifies and incentivizes civic maintenance. It allows citizens to report infrastructure issues (like potholes, debris, or broken lights), crowdfund rewards (bounties) using cryptocurrency, and pay workers instantly upon cryptographic verification of repairs.

---

## 🌌 Neo-Future Aesthetic
This project features a custom-built **Cyberpunk / Sci-Fi Design System**:
- **Immersive Preloader**: "System Boot" sequence with matrix-style console logs.
- **Glitch Effects**: Custom CSS keyframe animations for text and UI elements.
- **Glassmorphism**: High-blur backdrops with neon borders (`bg-glass-bg`, `border-glass-border`).
- **Interactive Motion**: Powered by **GSAP ScrollTrigger** and **Framer Motion** for silky smooth reveals.
- **Dynamic Text**: Character-split animations using `SplitType`.

---

## ⚡ Key Features

### 🔌 Wallet Integration
- **Freighter Wallet Support**: Seamless connection using `@stellar/freighter-api`.
- **Real-Time Balance**: Fetches and displays XLM balance directly from the Stellar Testnet.
- **Smart Validation**: Handles account funding states (404/400 errors) gracefully.

### 📝 Bounty Management
- **Create Bounties**: Post new tasks with location data, descriptions, and reward amounts.
- **Fund via Crypto**: Integrated Stellar transaction building to lock funds into smart escrow (simulated/testnet payment).
- **Dashboard**: Track "Created by Me" vs "Find Work" tasks with status filtering (Open, In Progress, Review, Completed).

### 🎨 Next-Gen UI/UX
- **Responsive Navigation**: Glass-morphic navbar with scroll-aware opacity changes.
- **Landing Page**: A high-conversion hero section with stats, workflow explanation, and animated verified coordinators.
- **Status Indicators**: Visual badges for bounty states (e.g., `OPEN`, `IN_PROGRESS`).

---

## 🛠️ Technology Stack

| Category | Technologies |
|----------|--------------|
| **Core** | React 19, Vite |
| **Styling** | Tailwind CSS v4, PostCSS, Custom CSS Variables |
| **Animation** | GSAP 3 (ScrollTrigger), Framer Motion, SplitType |
| **Blockchain** | Stellar SDK, @stellar/freighter-api |
| **Icons** | Lucide React |
| **3D Elements** | Three.js, React Three Fiber (Ready for integration) |

---

## 🚀 Getting Started

### Prerequisites
1.  **Node.js** (v18+ recommended)
2.  **Freighter Wallet Extension** installed in your browser.
    - [Download Freighter](https://www.freighter.app/)
    - Switch network to **TESTNET**.
    - Fund your wallet using the [Stellar Friendbot](https://laboratory.stellar.org/#account-creator?network=test).

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/pallavithegod/CivicBounty.git
    cd civicbounty
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

4.  **Open the App**
    Visit `http://localhost:5173` (or the port shown in your terminal).

---

## 🧪 Testing the Workflow

1.  **Connect Wallet**: Click "INITIALIZE WALLET LINK" on the Navbar. Approve the connection in Freighter.
2.  **Create Bounty**: Go to "Create Bounty", fill in the form, and click "Fund Bounty".
    - *Note: This triggers a real Testnet transaction. Ensure you have Testnet XLM.*
3.  **View Bounties**: Navigate to the Dashboard to see your newly created bounty.

---

## 🔮 Roadmap

- [ ] **Smart Contracts (Soroban)**: Move escrow logic from client-side simulation to on-chain Soroban contracts.
- [ ] **IPFS Storage**: Decentralized storage for "Before" and "After" proof photos.
- [ ] **DAO Governance**: Voting mechanism for verifying completed work.
- [ ] **Mobile App**: React Native port for field reporters.

---

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

---

<div align="center">
  <sub>Built with 💻 and ☕ by the CivicBounty Team.</sub>
</div>
