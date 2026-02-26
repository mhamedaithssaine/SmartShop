# SmartShop – Frontend React

Application React (JavaScript) pour la gestion B2B SmartShop : clients, produits, commandes et paiements.

## Structure

- **`src/api/`** – Appels API centralisés (Axios) : `authApi`, `productApi`, `customerApi`, `orderApi`, `paymentApi`, `promoApi`
- **`src/pages/`** – Pages : Produits, Clients, Commandes (listes, détail, création, édition)
- **`src/components/`** – Composants réutilisables : `layout/`, `ui/` (Table, Pagination, Button, Input, Card, Badge, Modal)
- **`src/utils/`** – Calculs et validations : `format.js` (montants 2 décimales), `promo.js` (PROMO-XXXX), `orderCalculations.js` (HT, TVA, TTC, restant dû)
- **`src/state/`** – Contexte global : `AuthContext.jsx` (Context API)

## Prérequis

- Node.js 18+
- Backend SmartShop démarré sur `http://localhost:8080`

## Installation

```bash
npm install
```

## Scripts

| Script        | Description                    |
|---------------|--------------------------------|
| `npm run dev` | Serveur de dev (port 3000)     |
| `npm run build` | Build production              |
| `npm run preview` | Prévisualisation du build   |
| `npm run test` | Tests unitaires (Vitest)        |

## Proxy API

En dev, les requêtes vers `/api` sont proxyfiées vers `http://localhost:8080` (voir `vite.config.js`).

## Authentification

- Connexion : `POST /api/auth/login` (session cookie).
- Les appels API utilisent `withCredentials: true` pour envoyer les cookies.

## Tests

- **Unitaires** : `spec/utils/` – format, promo, orderCalculations (syntaxe compatible Jasmine, exécutés avec Vitest).
- **E2E** : à mettre en place avec Cypress ou Playwright selon le cahier des charges.

## Montants

Tous les montants sont affichés avec 2 décimales (DH). Règles métier : TVA 20 %, espèces ≤ 20 000 DH, code promo format PROMO-XXXX.
