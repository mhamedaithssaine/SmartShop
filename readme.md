# SmartShop – Backend REST

SmartShop est une application **backend REST** de gestion commerciale pour MicroTech Maroc (B2B matériel informatique).

Fonctionnalités principales :

- Gestion des **clients**, **produits**, **commandes**, **paiements** et **codes promo**
- **Système de fidélité** (BASIC / SILVER / GOLD / PLATINUM) avec remises automatiques
- **Paiements fractionnés multi-moyens** (espèces, chèque, virement)
- **Authentification par session HTTP**, sans Spring Security ni JWT
- Gestion des **rôles** (ADMIN / CUSTOMER) via un **interceptor**
- Gestion centralisée des **erreurs JSON**

---

## 1. Stack technique

- Java 17
- Spring Boot (Spring MVC, Spring Data JPA)
- PostgreSQL
- JPA / Hibernate
- Lombok
- MapStruct
- Validation : `jakarta.validation`
- Build : Maven
- API : REST JSON

---

## 2. Architecture

Le projet est un **monorepo backend + frontend** :

- Backend Java/Spring Boot (ce dépôt racine)
- Frontend React (Vite) dans le dossier `frontend/`, qui consomme l’API REST exposée par ce backend (auth, produits, commandes, paiements, codes promo).

### 2.1. Backend – organisation par packages principaux :

- `controller.api.*` : contrôleurs REST (Auth, Users, Customers, Products, Commandes, Paiements, PromoCodes)
- `service` : logique métier (CommandeService, PaymentService, CustomerService, ProductService, PromoCodeService, AuthService, UserService)
- `repository` : interfaces Spring Data JPA
- `model` : entités JPA (`User`, `Customer`, `Product`, `Commande`, `CommandeLigne`, `Payment`, `PromoCode`, …)
- `dto.request` / `dto.response` : DTO d’entrée / sortie
- `mapper` : MapStruct (`UserMapper`, `CommandeMapper`, `PaymentMapper`, etc.)
- `exception` : exceptions personnalisées + `GlobalExceptionHandler`
- `util` : `SessionUtil` (aide pour la session HTTP)

### 2.2. Frontend – client React B2B

Le frontend SmartShop est une **application React** (bundler **Vite**) située dans le dossier `frontend/`.  
Il fournit une interface B2B pour les équipes MicroTech (rôle ADMIN) et les clients (rôle CUSTOMER) en s’appuyant exclusivement sur cette API backend.

- **Stack principale** :
  - React + React Router
  - Context API (`AuthContext`) pour la gestion de l’authentification et du rôle courant
  - Axios avec une instance configurée (`axiosInstance`) pointant sur `http://localhost:8080/api`
  - Tailwind CSS (config personnalisée dans `tailwind.config.js`) + quelques classes utilitaires globales (`index.css`)

- **Fonctionnalités UI clés** :
  - Écran de **connexion** (login) avec gestion des erreurs backend
  - Liste et fiche **produits** (avec actions d’ajout / modification réservées à l’ADMIN)
  - Liste et détail des **commandes**, incluant :
    - visualisation des lignes, totaux, remises fidélité et codes promo
    - gestion des **paiements fractionnés** (création, visualisation, changement de statut)
  - Espace **clients** (consultation, création, édition) réservé à l’ADMIN
  - Navigation protégée :
    - routes publiques limitées à la page de login
    - routes protégées par rôle (`AdminRoute`, vérifications du rôle courant avant d’afficher certaines sections ou actions)

- **Lancement du frontend (développement)** :
  - Se placer dans le dossier `frontend/`
  - Installer les dépendances : `npm install`
  - Démarrer le serveur de dev : `npm run dev`
  - L’application est accessible par défaut sur `http://localhost:5173` et communique avec le backend sur `http://localhost:8080`.

---

## 3. Authentification & Rôles

### 3.1. User & rôles

- Entité `User` :
    - `id`, `username`, `password`
    - `role` : `UserRole` (ADMIN / CUSTOMER)
    - `lastLoginAt`, `lastLogoutAt`
- `UserRole` :
    - `ADMIN` : employé MicroTech (accès complet)
    - `CUSTOMER` : client (accès lecture limitée)

### 3.2. Auth par session HTTP

- `AuthController` (`/api/auth`) :
    - `POST /api/auth/login` : login (`username`, `password`)
        - Stocke en session :
            - `USER_ID`
            - `USER_ROLE`
            - `CUSTOMER_ID` (si lié à un client)
    - `POST /api/auth/logout` : invalide la session
    - `GET /api/auth/me` : renvoie l’utilisateur connecté (id, role, customerId)

- `SessionUtil` :
    - Constantes : `SESSION_USER_ID`, `SESSION_USER_ROLE`, `SESSION_CUSTOMER_ID`
    - Helpers :
        - `requireUserId(session)` → lève `UnauthorizedException` si non connecté
        - `getCurrentRole(session)`
        - `getCurrentCustomerId(session)`

### 3.3. Contrôle des permissions (AuthInterceptor)

`AuthInterceptor` (enregistré dans `WebConfig`) intercepte toutes les routes `/api/**` (sauf `/api/auth/login`) et applique les règles :

- Vérifie qu’un user est connecté (session + USER_ID)
- Lit le rôle (`UserRole`) depuis la session
- Restreint les accès par URL :

**ADMIN uniquement**

- `/api/users/**` (CRUD des comptes admin)
- `/api/customers/**`
- `/api/products` (POST, PUT, DELETE)
- `/api/commandes` (POST, confirmer, annuler)
- `/api/commandes/{id}/paiements`, `/api/paiements/**`
- `/api/promo-codes/**`

**ADMIN ou CUSTOMER**

- `GET /api/products/**`
- `GET /api/commandes/**` (lecture)

En cas d’accès interdit :

- Non connecté → `UnauthorizedException` → HTTP 401
- Rôle insuffisant → `ForbiddenException` → HTTP 403  
  Les réponses d’erreur sont formatées en JSON par `GlobalExceptionHandler`.

---

## 4. Gestion métier

### 4.1. Clients (Customers)

- CRUD via `CustomerController` (`/api/customers`)
- Statistiques automatiques mises à jour lors de la **confirmation** d’une commande :
    - `totalOrders`
    - `totalSpent`
    - `firstOrderDate`
    - `lastOrderDate`
- Niveau de fidélité (`CustomerTier`) calculé à partir de :
    - `totalOrders`
    - `totalSpent`

### 4.2. Produits

- CRUD via `ProductController` (`/api/products`)
- Champs principaux :
    - `nom`, `categorie`, `prixUnitaire`, `stockDisponible`
- Soft delete possible si produit déjà dans des commandes

### 4.3. Commandes

- `CommandeController` (`/api/commandes`)
    - `POST /api/commandes` : créer une commande multi-produits (ADMIN)
        - Vérifie client, lignes, quantités > 0, stock suffisant
        - Applique remises fidélité + code promo
        - Calcule `sousTotal`, remises, `tva`, `totalTTC`, `montantRestant`
        - Statut initial : `PENDING` ou `REJECTED` (stock insuffisant)
    - `GET /api/commandes/{id}` : détails commande
    - `GET /api/commandes/client/{customerId}` : historique d’un client
    - `POST /api/commandes/{id}/confirmer` : confirme une commande totalement payée (ADMIN)
        - Vérifie `montantRestant == 0`
        - Décrémente le stock
        - Met à jour stats client + niveau fidélité
        - Statut → `CONFIRMED`
    - `POST /api/commandes/{id}/annuler` : annule une commande PENDING (ADMIN)

### 4.4. Paiements

- `PaymentController` (`/api/commandes/{id}/paiements`, `/api/paiements/**`)
    - `POST /api/commandes/{commandeId}/paiements` : enregistre un paiement
        - Types : `ESPECES`, `CHEQUE`, `VIREMENT`
        - Contrôles :
            - montant > 0
            - montant ≤ `montantRestant` de la commande
            - ESPECES ≤ 20 000 DH
            - champs obligatoires selon type (référence, banque, échéance…)
        - Numérotation auto des paiements (1,2,3,…)
        - Statut initial :
            - ESPECES → `ENCAISSE`
            - CHEQUE / VIREMENT → `EN_ATTENTE`
        - Recalcule `montantRestant` de la commande (tous paiements sauf `REJETE`)
    - `GET /api/commandes/{commandeId}/paiements` : liste des paiements d’une commande
    - `PUT /api/paiements/{paiementId}/statut` : change le statut (EN_ATTENTE / ENCAISSE / REJETE) et recalcule `montantRestant`

### 4.5. Codes promo

- `PromoCodeController` (`/api/promo-codes`)
    - CRUD complet + filtres (actifs, valides)
    - Règles :
        - format `PROMO-XXXX` validé dans les DTO
        - usage unique par client (contrôlé dans `CommandeService`)
        - validation de la disponibilité (actif, non expiré…)
    - La remise promo est appliquée sur le montant après remise fidélité.

### 4.6. Fidélité & remises

- `CustomerTier` calculé dans `CommandeService` :
    - BASIC (par défaut)
    - SILVER : `>= 3` commandes OU `>= 1000` dépensés
    - GOLD : `>= 10` commandes OU `>= 5000` dépensés
    - PLATINUM : `>= 20` commandes OU `>= 15000` dépensés
- Remises appliquées dans `AutoCommandeProcessor` :
    - SILVER : -5 % si `sousTotal >= 500`
    - GOLD : -10 % si `sousTotal >= 800`
    - PLATINUM : -15 % si `sousTotal >= 1200`

---

## 5. Endpoints principaux

### Auth

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Users (ADMIN uniquement)

- `POST /api/users`
- `GET /api/users`
- `GET /api/users/{id}`
- `PUT /api/users/{id}`
- `DELETE /api/users/{id}`

### Customers

- `POST /api/customers/create`
- `GET /api/customers/{id}`
- `PUT /api/customers/{id}`
- `DELETE /api/customers/{id}`

### Products

- `POST /api/products`
- `GET /api/products`
- `GET /api/products/{id}`
- `PUT /api/products/{id}`
- `DELETE /api/products/{id}`
- `GET /api/products/search?nom=...`
- `GET /api/products/categorie/{categorie}`

### Commandes

- `POST /api/commandes`
- `GET /api/commandes/{id}`
- `GET /api/commandes/client/{customerId}`
- `POST /api/commandes/{id}/confirmer`
- `POST /api/commandes/{id}/annuler`

### Paiements

- `POST /api/commandes/{commandeId}/paiements`
- `GET /api/commandes/{commandeId}/paiements`
- `PUT /api/paiements/{paiementId}/statut`

### Promo Codes

- `POST /api/promo-codes`
- `GET /api/promo-codes/{id}`
- `GET /api/promo-codes/code/{code}`
- `GET /api/promo-codes`
- `GET /api/promo-codes/actifs`
- `GET /api/promo-codes/valides`
- `PUT /api/promo-codes/{id}`
- `PATCH /api/promo-codes/{id}/toggle`
- `DELETE /api/promo-codes/{id}`

---

## 6. Gestion des erreurs

`GlobalExceptionHandler` convertit les exceptions en réponses JSON structurées :

- `400` – validation DTO (`MethodArgumentNotValidException`, `ValidationException`)
- `401` – non authentifié (`UnauthorizedException`)
- `403` – accès refusé (`ForbiddenException`)
- `404` – ressource introuvable (`ResourceNotFoundException`)
- `422` – règle métier violée (`BusinessRuleException`)
- `500` – erreur interne (`InternalServerException` ou autre)

Format des erreurs :

```json
{
  "timestamp": "2025-12-05T14:10:00",
  "status": 422,
  "error": "Business Rule Violation",
  "message": "Le montant du paiement dépasse le montant restant à payer",
  "path": "/api/commandes/10/paiements"
}
```
## 7. Configuration & lancement


### 7.1. PostgreSQL

Créer une base de données, par exemple :

```
CREATE DATABASE smartshop;
CREATE USER smartshop WITH ENCRYPTED PASSWORD 'smartshop';
GRANT ALL PRIVILEGES ON DATABASE smartshop TO smartshop;
```

### 7.2. application.properties (exemple)
````
spring.datasource.url=jdbc:postgresql://localhost:5432/smartshop
spring.datasource.username=smartshop
spring.datasource.password=smartshop

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

server.port=8080
````

### 7.3. Build & run

````aiignore
mvn clean install
mvn spring-boot:run
````

## 8. Tests & documentation via Postman

**https://documenter.getpostman.com/view/42979505/2sB3dPTW8P**