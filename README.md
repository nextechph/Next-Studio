<div align="center">
  <img src="assets/logo.png" alt="Next Technology Logo" width="100" />
  <h1>NEXT TECHNOLOGY</h1>
  <p><b>Executive Project Costing & Quotation Engine</b></p>

  <p>
    <img src="https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-v4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  </p>
</div>

---

## ⚡ Executive Summary

**Next Studio Quotation Engine** is a high-performance, studio-grade quotation generator built for modern software studios, agencies, and independent consultancies. It streamlines project estimation, client classification, service itemization, and vector PDF rendering into a fluid, dark-mode user experience.

Whether billing a commercial enterprise software suite or a student capstone project, **Next Studio** calculates accurate estimations in Philippine Peso (PHP) and formats them into branded, printable PDF quotes with legally aligned settlement conditions.

---

## ✨ Core Key Features

### 🎯 Dynamic Client Classification & Tiering
- **Client Categories**: Distinct logic paths for **Student / Academic** vs **Business / Commercial** projects.
- **Professional Tiers**: Tier-based pricing rules:
  - **Starter**: Base rate ₱10,000
  - **Growth**: Base rate ₱30,000
  - **Enterprise**: Base rate ₱60,000
- **Timeline Estimation**: Support for Rush (2–4 wks), Standard (1–2 mos), and Relaxed (3+ mos) schedule locks.

### 📦 Activity & Deliverable Ledger
- **Service Bundles**: Pre-configured activity presets (Consultation, Revision, UI/UX, Full-Stack Architecture, Payment Integration, Deployment).
- **Line Item Controls**: Custom task titles, descriptions, categories, unit prices, and quantities with real-time calculation.
- **Financial Controls**: Optional add-on Tax (%) and Studio Discount (%) controls.

### 🎨 Theme Vector Engine & PDF Generator
Choose from 5 distinct vector-grade design themes:
- `NEXT_TECH` — Flagship Cyber Obsidian & Emerald Code Grid
- `NEXT_LIGHT` — Clean SaaS Platform Light Layout
- `NEXT_BLUEPRINT` — Architectural Mono CAD Grid
- `NEXT_ENTERPRISE` — Midnight Slate & Electric Gold
- `NEXT_QUANTUM` — Quantum Polar Sky & Navy

### 📄 Dual-Mode PDF Workflow
- **Preview PDF Mode** (Read-Only): Generates a live, non-exportable modal preview to review spacing and alignment.
- **Generate PDF Mode** (Export Mode): Unlocks direct PDF downloading (`jsPDF` + `html2canvas`) and instant client sharing.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- `npm` or `yarn`

### Installation & Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/nextechph/Next-Studio.git
   cd Next-Studio
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser to launch the studio editor.

4. **Verify TypeScript compilation:**
   ```bash
   npm run lint
   ```

---

## 🛠️ Technology Stack

| Technology | Purpose |
| :--- | :--- |
| **React 19** | Component-driven UI framework |
| **TypeScript** | Strict static type-safety & interfaces |
| **Vite 6** | Instant HMR & lightning-fast production build |
| **Tailwind CSS v4** | Modern theme styling & dynamic UI variables |
| **Framer Motion** | Micro-interactions & animated transitions |
| **Lucide React** | Clean, minimalist vector iconography |
| **html2canvas + jsPDF** | High-fidelity vector-to-canvas PDF export |

---

## 📂 Project Architecture

```
Next-Quotation-main/
├── assets/                 # Brand logos and static graphic assets
├── src/
│   ├── components/
│   │   ├── ClientDetailsForm.tsx   # Client info & tier classification form
│   │   ├── LineItemsSection.tsx    # Deliverables & service ledger editor
│   │   ├── PDFDesignPanel.tsx      # Vector theme selector & studio config
│   │   ├── PDFPreview.tsx          # Dual-mode PDF canvas renderer
│   │   ├── QuotationHistory.tsx    # Saved quotation records & history
│   │   ├── QuoteNavbar.tsx         # Header metrics navigation bar
│   │   └── NextLogo.tsx            # Brand logo vector wrapper
│   ├── types.ts                    # TypeScript data models & theme tokens
│   ├── App.tsx                     # Main layout & state orchestrator
│   ├── index.css                   # Global CSS & Tailwind theme definitions
│   └── main.tsx                    # Application entry point
├── index.html                      # HTML entry with favicon & fonts
├── vite.config.ts                  # Vite server & port configuration
└── package.json                    # Dependencies & scripts
```

---

<div align="center">
  <p>© 2026 <b>Next Technology</b> — Built for Engineering Excellence</p>
</div>
