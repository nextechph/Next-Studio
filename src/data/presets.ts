import { QuotationItem } from '../types';

export interface ServicePreset {
  id: string;
  category: string;
  title: string;
  shortDescription: string;
  defaultPrice: number;
  items: Omit<QuotationItem, 'id'>[];
}

export const SERVICE_PRESETS: ServicePreset[] = [
  {
    id: 'web-development',
    category: 'Development',
    title: 'Custom Website Suite',
    shortDescription: 'Sleek, responsive marketing platform utilizing modern Vite & React ecosystem.',
    defaultPrice: 0,
    items: [
      {
        title: 'Custom React Web Platform',
        description: 'Single-page responsive design utilizing Vite, React, and modular structural file hierarchies.',
        unitPrice: 0,
        quantity: 1,
        category: 'Development'
      },
      {
        title: 'Tailwind CSS Styling & Micro-interactions',
        description: 'Bespoke design layout, custom typography integration (Space Grotesk & Inter), transitions, and fluid components.',
        unitPrice: 0,
        quantity: 1,
        category: 'Design'
      }
    ]
  },
  {
    id: 'fullstack-app',
    category: 'Development',
    title: 'Full-Stack Application Upgrade',
    shortDescription: 'Production-ready database, Cloud hosting API routes, and secure authorization.',
    defaultPrice: 0,
    items: [
      {
        title: 'Interactive Frontend Client Studio',
        description: 'Complete user dashboard layout, responsive data graphics, interactive control panes, and state managers.',
        unitPrice: 0,
        quantity: 1,
        category: 'Development'
      },
      {
        title: 'Secure Server Integration (Express + Node)',
        description: 'RESTful server endpoints, structured router middleware, secure API proxy guards, and environment parsing.',
        unitPrice: 0,
        quantity: 1,
        category: 'Development'
      },
      {
        title: 'Firebase/Firestore Core Database Setup',
        description: 'Provisioning document schemas, indices rules creation, real-time sync listeners, and email login providers.',
        unitPrice: 0,
        quantity: 1,
        category: 'Security & DB'
      }
    ]
  },
  {
    id: 'ecommerce',
    category: 'E-Commerce',
    title: 'Elite E-commerce Suite',
    shortDescription: 'Full checkout routing, stripe proxy pathways, and interactive order summary layout.',
    defaultPrice: 0,
    items: [
      {
        title: 'Catalog System & Dynamic Filtering',
        description: 'Rich searchable listings, product detailed overlays, animated shopping cart, and persistent clientside checkout caching.',
        unitPrice: 0,
        quantity: 1,
        category: 'E-Commerce'
      },
      {
        title: 'Third-Party Stripe Payment Proxy Integration',
        description: 'Robust server-to-server checkouts, secure webhooks processing, and failure-tolerant API routing (No client secrets exposed).',
        unitPrice: 0,
        quantity: 1,
        category: 'Security & DB'
      },
      {
        title: 'Transaction Receipts & Auto-Email System',
        description: 'Automated receipt generation formatted in sleek PDF layouts, custom mail transport templates, and log dashboards.',
        unitPrice: 0,
        quantity: 1,
        category: 'Development'
      }
    ]
  },
  {
    id: 'branding-ux',
    category: 'UI/UX Design',
    title: 'Brand Strategy & Interface Design',
    shortDescription: 'Figma mockups, design blueprint documentation, and modern typography guides.',
    defaultPrice: 0,
    items: [
      {
        title: 'Brand Visual Identity Workshop',
        description: 'Custom primary marks, hollow outline logos styles, selective visual color boards, and asset packaging.',
        unitPrice: 0,
        quantity: 1,
        category: 'Design'
      },
      {
        title: 'High-Fidelity UI/UX Prototypes',
        description: 'Bespoke grid structure, responsive phone/desktop mockups templates, micro-animations models, and feedback loops.',
        unitPrice: 0,
        quantity: 1,
        category: 'Design'
      }
    ]
  }
];
