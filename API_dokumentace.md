# API Dokumentace - KodProDobro (ImpactLink CZ)

Tato dokumentace popisuje REST API pro platformu **KodProDobro** (ImpactLink CZ), která propojuje studenty s neziskovými organizacemi.

## 📋 Obsah

- [Přehled](#přehled)
- [Autentizace](#autentizace)
- [Endpointy](#endpointy)
  - [Autentizační API](#autentizační-api)
  - [Projektové API](#projektové-api)
  - [Uživatelské API](#uživatelské-api)
  - [Chat API](#chat-api)
- [Datové Modely](#datové-modely)
- [Chybové Kódy](#chybové-kódy)
- [Příklady Použití](#příklady-použití)
- [Testování API](#testování-api)

---

## Přehled

### Base URL
```
http://localhost:8080
```

### Formát Dat
API přijímá a vrací data ve formátu **JSON**.

### Autentizace
Většina endpointů vyžaduje autentizaci pomocí **JWT (JSON Web Token)**. Token získáte přihlášením přes `/api/auth/login` a následně ho přikládáte v hlavičce:

```
Authorization: Bearer <váš_jwt_token>
```

---

## Autentizace

API používá **JWT tokeny** pro autentizaci a autorizaci. Po úspěšném přihlášení obdržíte token, který musíte přikládat k požadavkům na chráněné endpointy.

### Jak získat token
1. Zaregistrujte se přes `/api/auth/register`
2. Přihlaste se přes `/api/auth/login`
3. Použijte obdržený token v hlavičce `Authorization: Bearer <token>`

### Role Uživatelů
- **STUDENT** - student hledající projekty
- **NONPROFIT** - nezisková organizace (může vytvářet projekty)
- **ADMIN** - administrátor platformy

---

## Endpointy

## Autentizační API

### POST /api/auth/register
Registrace nového uživatele do systému.

**Oprávnění:** Veřejné (není třeba autentizace)

**Request Body:**
```json
{
  "username": "jana.novakova",
  "email": "jana@example.com",
  "password": "heslo123",
  "roles": ["STUDENT"]
}
```

**Parametry:**
- `username` (string, povinné) - uživatelské jméno (3-20 znaků)
- `email` (string, povinné) - emailová adresa (max 50 znaků, validní formát)
- `password` (string, povinné) - heslo (6-40 znaků)
- `roles` (array, volitelné) - pole rolí (`STUDENT`, `NONPROFIT`)

**Úspěšná Odpověď (200 OK):**
```json
{
  "message": "Uživatel byl úspěšně zaregistrován!"
}
```

**Chybová Odpověď (400 Bad Request):**
```json
{
  "message": "Chyba: Uživatelské jméno již existuje!"
}
```

**Příklad - cURL:**
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "jana.novakova",
    "email": "jana@example.com",
    "password": "heslo123",
    "roles": ["STUDENT"]
  }'
```

**Příklad - JavaScript (fetch):**
```javascript
const response = await fetch('http://localhost:8080/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'jana.novakova',
    email: 'jana@example.com',
    password: 'heslo123',
    roles: ['STUDENT']
  })
});
const data = await response.json();
console.log(data);
```

---

### POST /api/auth/login
Přihlášení uživatele a získání JWT tokenu.

**Oprávnění:** Veřejné (není třeba autentizace)

**Request Body:**
```json
{
  "username": "jana.novakova",
  "password": "heslo123"
}
```

**Parametry:**
- `username` (string, povinné) - uživatelské jméno
- `password` (string, povinné) - heslo

**Úspěšná Odpověď (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "jana.novakova",
  "roles": [
    {
      "authority": "ROLE_STUDENT"
    }
  ]
}
```

**Chybová Odpověď (401 Unauthorized):**
```json
{
  "message": "Chyba: Neplatné uživatelské jméno nebo heslo!"
}
```

**Příklad - cURL:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "jana.novakova",
    "password": "heslo123"
  }'
```

**Příklad - JavaScript (fetch):**
```javascript
const response = await fetch('http://localhost:8080/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'jana.novakova',
    password: 'heslo123'
  })
});
const data = await response.json();
// Uložte token pro další použití
localStorage.setItem('token', data.token);
```

---

### POST /api/auth/forgot-password
Žádost o reset hesla - odešle email s odkazem pro obnovení hesla.

**Oprávnění:** Veřejné (není třeba autentizace)

**Request Body:**
```json
{
  "email": "jana@example.com"
}
```

**Parametry:**
- `email` (string, povinné) - emailová adresa registrovaného uživatele

**Úspěšná Odpověď (200 OK):**
```json
{
  "message": "Pokud je tento e-mail registrován, instrukce byly odeslány."
}
```

**Chybová Odpověď (400 Bad Request):**
```json
{
  "error": "Emailová adresa nesmí být prázdná."
}
```

**Příklad - cURL:**
```bash
curl -X POST http://localhost:8080/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "jana@example.com"}'
```

---

### POST /api/auth/reset-password
Reset hesla pomocí tokenu z emailu.

**Oprávnění:** Veřejné (vyžaduje platný reset token)

**Request Body:**
```json
{
  "token": "abc123def456",
  "newPassword": "noveHeslo456"
}
```

**Parametry:**
- `token` (string, povinné) - token z emailu
- `newPassword` (string, povinné) - nové heslo (min. 6 znaků)

**Úspěšná Odpověď (200 OK):**
```json
{
  "message": "Password has been reset successfully."
}
```

**Chybová Odpověď (400 Bad Request):**
```json
{
  "error": "Neplatný nebo vypršený token."
}
```

**Příklad - cURL:**
```bash
curl -X POST http://localhost:8080/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "abc123def456",
    "newPassword": "noveHeslo456"
  }'
```

---

### POST /api/auth/logout
Odhlášení uživatele - token bude přidán do blacklistu.

**Oprávnění:** Vyžaduje autentizaci (JWT token)

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Úspěšná Odpověď (200 OK):**
```json
{
  "message": "Úspěšně odhlášeno"
}
```

**Příklad - cURL:**
```bash
curl -X POST http://localhost:8080/api/auth/logout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Příklad - JavaScript (fetch):**
```javascript
const token = localStorage.getItem('token');
const response = await fetch('http://localhost:8080/api/auth/logout', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
// Odstraňte token z local storage
localStorage.removeItem('token');
```

---

## Projektové API

### GET /api/projects
Získání seznamu všech projektů.

**Oprávnění:** Veřejné (není třeba autentizace)

**Úspěšná Odpověď (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Mobilní aplikace pro dobrovolníky",
    "description": "Vytvoření mobilní aplikace pro koordinaci dobrovolníků během nouzových situací.",
    "owner": {
      "id": 5,
      "username": "adra_org",
      "email": "kontakt@adra.cz",
      "firstName": "ADRA",
      "lastName": "Česká republika",
      "role": "NONPROFIT"
    },
    "createdAt": "2026-01-10T14:30:00"
  },
  {
    "id": 2,
    "name": "Revamp dárcovské platformy",
    "description": "Přepracování webu pro dárce s vylepšeným UX a integrací plateb.",
    "owner": {
      "id": 6,
      "username": "red_cross",
      "email": "info@cervenykriz.eu",
      "firstName": "Český",
      "lastName": "Červený kříž",
      "role": "NONPROFIT"
    },
    "createdAt": "2026-01-08T10:15:00"
  }
]
```

**Příklad - cURL:**
```bash
curl -X GET http://localhost:8080/api/projects
```

**Příklad - JavaScript (fetch):**
```javascript
const response = await fetch('http://localhost:8080/api/projects');
const projects = await response.json();
console.log(projects);
```

---

### POST /api/projects
Vytvoření nového projektu.

**Oprávnění:** Vyžaduje roli **NONPROFIT**

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Nový projekt",
  "description": "Popis projektu a jeho cíle."
}
```

**Parametry:**
- `name` (string, povinné) - název projektu
- `description` (string, volitelné) - popis projektu (max 2000 znaků)

**Úspěšná Odpověď (200 OK):**
```json
{
  "id": 3,
  "name": "Nový projekt",
  "description": "Popis projektu a jeho cíle.",
  "owner": {
    "id": 5,
    "username": "adra_org",
    "email": "kontakt@adra.cz",
    "firstName": "ADRA",
    "lastName": "Česká republika",
    "role": "NONPROFIT"
  },
  "createdAt": "2026-01-13T21:00:00"
}
```

**Chybová Odpověď (403 Forbidden):**
```json
{
  "error": "Access Denied"
}
```

**Příklad - cURL:**
```bash
curl -X POST http://localhost:8080/api/projects \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nový projekt",
    "description": "Popis projektu a jeho cíle."
  }'
```

**Příklad - JavaScript (fetch):**
```javascript
const token = localStorage.getItem('token');
const response = await fetch('http://localhost:8080/api/projects', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Nový projekt',
    description: 'Popis projektu a jeho cíle.'
  })
});
const newProject = await response.json();
```

---

### GET /api/projects/{projectId}
Získání detailu konkrétního projektu.

**Oprávnění:** Veřejné (není třeba autentizace)

**Path Parameters:**
- `projectId` (number, povinné) - ID projektu

**Úspěšná Odpověď (200 OK):**
```json
{
  "id": 1,
  "name": "Mobilní aplikace pro dobrovolníky",
  "description": "Vytvoření mobilní aplikace pro koordinaci dobrovolníků během nouzových situací.",
  "owner": {
    "id": 5,
    "username": "adra_org",
    "email": "kontakt@adra.cz",
    "firstName": "ADRA",
    "lastName": "Česká republika",
    "role": "NONPROFIT"
  },
  "createdAt": "2026-01-10T14:30:00"
}
```

**Chybová Odpověď (404 Not Found):**
```json
{
  "error": "Project not found"
}
```

**Příklad - cURL:**
```bash
curl -X GET http://localhost:8080/api/projects/1
```

**Příklad - JavaScript (fetch):**
```javascript
const projectId = 1;
const response = await fetch(`http://localhost:8080/api/projects/${projectId}`);
const project = await response.json();
```

---

### PUT /api/projects/{projectId}
Aktualizace existujícího projektu.

**Oprávnění:** Vyžaduje roli **NONPROFIT**

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Path Parameters:**
- `projectId` (number, povinné) - ID projektu k aktualizaci

**Request Body:**
```json
{
  "name": "Aktualizovaný název projektu",
  "description": "Nový popis projektu."
}
```

**Úspěšná Odpověď (200 OK):**
```json
{
  "id": 1,
  "name": "Aktualizovaný název projektu",
  "description": "Nový popis projektu.",
  "owner": {
    "id": 5,
    "username": "adra_org",
    "email": "kontakt@adra.cz",
    "firstName": "ADRA",
    "lastName": "Česká republika",
    "role": "NONPROFIT"
  },
  "createdAt": "2026-01-10T14:30:00"
}
```

**Chybová Odpověď (404 Not Found):**
```json
{
  "error": "Project not found"
}
```

**Příklad - cURL:**
```bash
curl -X PUT http://localhost:8080/api/projects/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Aktualizovaný název projektu",
    "description": "Nový popis projektu."
  }'
```

---

## Uživatelské API

### GET /api/users/me
Získání informací o aktuálně přihlášeném uživateli.

**Oprávnění:** Vyžaduje autentizaci (JWT token)

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Úspěšná Odpověď (200 OK):**
```json
"Přihlášený uživatel: User(id=1, username=jana.novakova, email=jana@example.com, firstName=Jana, lastName=Nováková, role=STUDENT)"
```

> **Poznámka:** Tento endpoint aktuálně vrací textovou reprezentaci objektu. Pro produkční použití doporučujeme upravit na standardní JSON odpověď.

**Příklad - cURL:**
```bash
curl -X GET http://localhost:8080/api/users/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Příklad - JavaScript (fetch):**
```javascript
const token = localStorage.getItem('token');
const response = await fetch('http://localhost:8080/api/users/me', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const user = await response.text();
console.log(user);
```

---

### PUT /api/users/me
Aktualizace profilu přihlášeného uživatele.

**Oprávnění:** Vyžaduje autentizaci (JWT token)

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "firstName": "Jana",
  "lastName": "Nováková",
  "email": "jana.novakova@example.com"
}
```

**Parametry:**
- `firstName` (string, volitelné) - křestní jméno
- `lastName` (string, volitelné) - příjmení
- `email` (string, volitelné) - emailová adresa

**Úspěšná Odpověď (200 OK):**
```json
{
  "id": 1,
  "username": "jana.novakova",
  "email": "jana.novakova@example.com",
  "firstName": "Jana",
  "lastName": "Nováková",
  "role": "STUDENT"
}
```

**Příklad - cURL:**
```bash
curl -X PUT http://localhost:8080/api/users/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jana",
    "lastName": "Nováková",
    "email": "jana.novakova@example.com"
  }'
```

**Příklad - JavaScript (fetch):**
```javascript
const token = localStorage.getItem('token');
const response = await fetch('http://localhost:8080/api/users/me', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    firstName: 'Jana',
    lastName: 'Nováková',
    email: 'jana.novakova@example.com'
  })
});
const updatedUser = await response.json();
```

---

## Chat API

### GET /api/chats
Získání seznamu všech chatů uživatele.

**Oprávnění:** Vyžaduje autentizaci (JWT token)

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Úspěšná Odpověď (200 OK):**
```json
[
  {
    "id": 1,
    "participants": [
      {
        "id": 1,
        "username": "jana.novakova",
        "email": "jana@example.com"
      },
      {
        "id": 5,
        "username": "adra_org",
        "email": "kontakt@adra.cz"
      }
    ],
    "createdAt": "2026-01-12T09:00:00"
  }
]
```

> **Poznámka:** Aktuální implementace vrací všechny chaty v systému. Pro produkční použití doporučujeme filtrovat pouze chaty, kde je uživatel účastníkem.

**Příklad - cURL:**
```bash
curl -X GET http://localhost:8080/api/chats \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Příklad - JavaScript (fetch):**
```javascript
const token = localStorage.getItem('token');
const response = await fetch('http://localhost:8080/api/chats', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const chats = await response.json();
```

---

### GET /api/chats/{chatId}/messages
Získání všech zpráv v konkrétním chatu.

**Oprávnění:** Vyžaduje autentizaci (JWT token)

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Path Parameters:**
- `chatId` (number, povinné) - ID chatu

**Úspěšná Odpověď (200 OK):**
```json
[
  {
    "id": 1,
    "content": "Ahoj, mám zájem o váš projekt!",
    "sender": {
      "id": 1,
      "username": "jana.novakova",
      "email": "jana@example.com"
    },
    "chat": {
      "id": 1
    },
    "createdAt": "2026-01-12T10:05:00"
  },
  {
    "id": 2,
    "content": "Skvělé! Rádi si s vámi promluvíme.",
    "sender": {
      "id": 5,
      "username": "adra_org",
      "email": "kontakt@adra.cz"
    },
    "chat": {
      "id": 1
    },
    "createdAt": "2026-01-12T10:30:00"
  }
]
```

**Chybová Odpověď (404 Not Found):**
```json
{
  "error": "Chat not found"
}
```

**Příklad - cURL:**
```bash
curl -X GET http://localhost:8080/api/chats/1/messages \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Příklad - JavaScript (fetch):**
```javascript
const token = localStorage.getItem('token');
const chatId = 1;
const response = await fetch(`http://localhost:8080/api/chats/${chatId}/messages`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const messages = await response.json();
```

---

### POST /api/chats/{chatId}/messages
Odeslání nové zprávy do chatu.

**Oprávnění:** Vyžaduje autentizaci (JWT token)

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Path Parameters:**
- `chatId` (number, povinné) - ID chatu

**Request Body:**
```json
{
  "content": "Text zprávy, kterou chcete odeslat."
}
```

**Parametry:**
- `content` (string, povinné) - obsah zprávy

**Úspěšná Odpověď (200 OK):**
```json
{
  "id": 3,
  "content": "Text zprávy, kterou chcete odeslat.",
  "sender": {
    "id": 1,
    "username": "jana.novakova",
    "email": "jana@example.com"
  },
  "chat": {
    "id": 1
  },
  "createdAt": "2026-01-13T21:15:00"
}
```

**Chybová Odpověď (404 Not Found):**
```json
{
  "error": "Chat not found"
}
```

**Příklad - cURL:**
```bash
curl -X POST http://localhost:8080/api/chats/1/messages \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Text zprávy, kterou chcete odeslat."
  }'
```

**Příklad - JavaScript (fetch):**
```javascript
const token = localStorage.getItem('token');
const chatId = 1;
const response = await fetch(`http://localhost:8080/api/chats/${chatId}/messages`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    content: 'Text zprávy, kterou chcete odeslat.'
  })
});
const newMessage = await response.json();
```

---

## Datové Modely

### User (Uživatel)
```json
{
  "id": 1,
  "username": "jana.novakova",
  "email": "jana@example.com",
  "firstName": "Jana",
  "lastName": "Nováková",
  "role": "STUDENT"
}
```

**Atributy:**
- `id` (number) - unikátní identifikátor uživatele
- `username` (string) - uživatelské jméno (unikátní)
- `email` (string) - emailová adresa (unikátní)
- `firstName` (string, nullable) - křestní jméno
- `lastName` (string, nullable) - příjmení
- `role` (string) - role uživatele (`STUDENT`, `NONPROFIT`, `ADMIN`)

### Project (Projekt)
```json
{
  "id": 1,
  "name": "Název projektu",
  "description": "Popis projektu",
  "owner": { /* User object */ },
  "createdAt": "2026-01-10T14:30:00"
}
```

**Atributy:**
- `id` (number) - unikátní identifikátor projektu
- `name` (string) - název projektu
- `description` (string, nullable) - popis projektu (max 2000 znaků)
- `owner` (User) - vlastník projektu (nezisková organizace)
- `createdAt` (datetime) - datum a čas vytvoření

### Chat (Konverzace)
```json
{
  "id": 1,
  "participants": [/* Array of User objects */],
  "createdAt": "2026-01-12T09:00:00"
}
```

**Atributy:**
- `id` (number) - unikátní identifikátor chatu
- `participants` (array of User) - účastníci konverzace
- `createdAt` (datetime) - datum a čas vytvoření

### ChatMessage (Zpráva)
```json
{
  "id": 1,
  "content": "Text zprávy",
  "sender": { /* User object */ },
  "chat": { /* Chat object */ },
  "createdAt": "2026-01-12T10:05:00"
}
```

**Atributy:**
- `id` (number) - unikátní identifikátor zprávy
- `content` (string) - text zprávy
- `sender` (User) - odesílatel zprávy
- `chat` (Chat) - chat, do kterého zpráva patří
- `createdAt` (datetime) - datum a čas odeslání

---

## Chybové Kódy

API používá standardní HTTP status kódy:

| Kód | Název | Popis |
|-----|-------|-------|
| 200 | OK | Požadavek byl úspěšný |
| 400 | Bad Request | Neplatná data v požadavku (např. chybějící povinný parametr) |
| 401 | Unauthorized | Chybí autentizace nebo je neplatná |
| 403 | Forbidden | Uživatel nemá oprávnění k této akci |
| 404 | Not Found | Požadovaný zdroj nebyl nalezen |
| 500 | Internal Server Error | Chyba serveru |

### Formát Chybových Odpovědí

```json
{
  "message": "Popis chyby"
}
```

nebo

```json
{
  "error": "Popis chyby"
}
```

---

## Příklady Použití

### Kompletní Workflow - Registrace, Přihlášení a Vytvoření Projektu

#### 1. Registrace nového uživatele
```javascript
const registerResponse = await fetch('http://localhost:8080/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'adra_org',
    email: 'kontakt@adra.cz',
    password: 'securePassword123',
    roles: ['NONPROFIT']
  })
});
const registerData = await registerResponse.json();
console.log('Registrace:', registerData);
```

#### 2. Přihlášení uživatele
```javascript
const loginResponse = await fetch('http://localhost:8080/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'adra_org',
    password: 'securePassword123'
  })
});
const loginData = await loginResponse.json();
const token = loginData.token;
localStorage.setItem('token', token);
console.log('Přihlášení úspěšné, token:', token);
```

#### 3. Vytvoření nového projektu
```javascript
const createProjectResponse = await fetch('http://localhost:8080/api/projects', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Mobilní aplikace pro dobrovolníky',
    description: 'Vytvoření aplikace pro koordinaci dobrovolníků.'
  })
});
const newProject = await createProjectResponse.json();
console.log('Nový projekt:', newProject);
```

#### 4. Získání seznamu projektů
```javascript
const projectsResponse = await fetch('http://localhost:8080/api/projects');
const projects = await projectsResponse.json();
console.log('Všechny projekty:', projects);
```

#### 5. Aktualizace profilu
```javascript
const updateProfileResponse = await fetch('http://localhost:8080/api/users/me', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    firstName: 'ADRA',
    lastName: 'Česká republika',
    email: 'kontakt@adra.cz'
  })
});
const updatedUser = await updateProfileResponse.json();
console.log('Aktualizovaný profil:', updatedUser);
```

---

## Testování API

### Prerekvizity
1. **Backend aplikace běží** na `http://localhost:8080`
2. **PostgreSQL databáze** je spuštěna a nakonfigurována
3. **Nástroj pro testování** (cURL, Postman, nebo prohlížeč)

### Spuštění Backend Serveru

```bash
cd backend
mvn spring-boot:run
```

Server by měl být dostupný na `http://localhost:8080`.

### Testování pomocí cURL

#### Test 1: Registrace nového uživatele
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test_user",
    "email": "test@example.com",
    "password": "password123",
    "roles": ["STUDENT"]
  }'
```

**Očekávaný výstup:**
```json
{"message":"Uživatel byl úspěšně zaregistrován!"}
```

#### Test 2: Přihlášení
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test_user",
    "password": "password123"
  }'
```

**Očekávaný výstup:**
```json
{
  "token": "eyJhbGciOiJSUzI1NiJ9...",
  "username": "test_user",
  "roles": [{"authority": "ROLE_STUDENT"}]
}
```

**Uložte token** pro použití v dalších testech:
```bash
TOKEN="váš_token_z_odpovědi"
```

#### Test 3: Získání seznamu projektů
```bash
curl -X GET http://localhost:8080/api/projects
```

#### Test 4: Získání informací o uživateli
```bash
curl -X GET http://localhost:8080/api/users/me \
  -H "Authorization: Bearer $TOKEN"
```

### Testování pomocí Postman

1. **Importujte prostředí:**
   - Base URL: `http://localhost:8080`
   - Token: (po přihlášení vyplňte sem token)

2. **Vytvořte kolekci** s následujícími požadavky:
   - POST Register
   - POST Login
   - GET Projects
   - POST Project (s autorizací)
   - GET User Profile (s autorizací)

3. **Nastavte autorizaci:**
   - Type: Bearer Token
   - Token: `{{token}}` (použijte proměnnou prostředí)

### Časté Problémy a Řešení

| Problém | Možné Řešení |
|---------|--------------|
| **401 Unauthorized** | Zkontrolujte platnost JWT tokenu, případně se znovu přihlaste |
| **403 Forbidden** | Uživatel nemá potřebnou roli (např. NONPROFIT pro vytvoření projektu) |
| **404 Not Found** | Zkontrolujte URL endpoint a existenci zdrojů (např. project ID) |
| **500 Internal Server Error** | Zkontrolujte logy serveru, pravděpodobně problém s databází |
| **Connection Refused** | Backend server pravděpodobně neběží, spusťte `mvn spring-boot:run` |

### Swagger UI (OpenAPI Documentation)

Backend používá Swagger/OpenAPI pro automatickou dokumentaci. Po spuštění serveru je dostupná na:

```
http://localhost:8080/swagger-ui.html
```

Swagger UI umožňuje:
- Procházet všechny dostupné endpointy
- Testovat API přímo z prohlížeče
- Prohlížet schémata request/response objektů

---

## Bezpečnost

### CORS (Cross-Origin Resource Sharing)

Backend má nakonfigurováno CORS pro povolení požadavků z frontendu. Defaultně jsou povoleny požadavky z:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000`

### JWT Token Security

- Tokeny mají **platnost 1 hodinu**
- Po odhlášení je token přidán do **blacklistu**
- Tokeny jsou podepsány pomocí **RSA klíčů**
- V response jsou zahrnuty **role uživatele**

### Best Practices

1. **Nikdy neukládejte hesla v plaintextu** - hesla jsou hashovana pomocí BCrypt
2. **Používejte HTTPS v produkci** - zabezpečte komunikaci šifrováním
3. **Validujte všechny vstupy** - backend používá Jakarta Validation
4. **Implementujte rate limiting** - ochrana proti brute-force útokům
5. **Rotujte JWT secret keys** pravidelně

---

## Dodatečné Zdroje

- **Backend README:** `backend/README.md`
- **Frontend dokumentace:** `frontend/README.md`
- **Projekt README:** `README.md`
- **Swagger API Docs:** `http://localhost:8080/swagger-ui.html`

---

**Verze:** 1.0  
**Poslední aktualizace:** 13. ledna 2026  
**Autor:** KodProDobro Team
