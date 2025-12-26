# Nápověda k projektu KodProDobro (ImpactLink CZ)

Tento soubor slouží jako rychlý průvodce pro zprovoznění a orientaci v aktuální verzi projektu, který se skládá z **Java Spring Boot backendu** a **React Vite frontendu**.

## 📂 Struktura projektu

Projekt je rozdělen do dvou hlavních částí:

*   **`backend/`**: Obsahuje zdrojový kód serverové části (Spring Boot, Java 21, Maven).
    *   Zde se nachází logika API, databázové modely a konfigurace.
*   **`frontend/`**: Obsahuje klientskou aplikaci (React, Vite, TypeScript).
    *   Zde je uživatelské rozhraní, komponenty a styly.

> ⚠️ **Poznámka**: V kořenovém adresáři se mohou nacházet některé duplicitní soubory z původní verze (např. `App.tsx`, `package.json`). Pro vývoj doporučujeme pracovat primárně uvnitř složek `backend` a `frontend`.

---

## ☕ Backend (Java Spring Boot)

Backend zajišťuje komunikaci s databází a poskytuje API pro frontend.

### Prerekvizity
*   **Java 21** (JDK)
*   **Maven** (nástroj pro správu závislostí a sestavení)
*   **PostgreSQL** (databáze)

### Konfigurace
Před spuštěním je nutné nakonfigurovat připojení k databázi v souboru:
`backend/src/main/resources/application.properties`

Ujistěte se, že máte nastavené správné údaje (URL, username, password) pro vaši lokální PostgreSQL instanci.

### Spuštění
Otevřete terminál ve složce `backend/` a spusťte příkaz:

```bash
cd backend
mvn spring-boot:run
```

Server by měl naběhnout standardně na portu `8080`.

---

## ⚛️ Frontend (React Vite)

Frontend je moderní webová aplikace postavená na Reactu 19.

### Prerekvizity
*   **Node.js** (verze 20 nebo novější doporučena)
*   **npm** (součást Node.js)

### Instalace závislostí
Před prvním spuštěním je nutné nainstalovat potřebné balíčky. Otevřete terminál ve složce `frontend/`:

```bash
cd frontend
npm install
```

### Spuštění vývojového serveru
Pro spuštění aplikace v lokálním vývojovém režimu použijte:

```bash
npm run dev
```

Aplikace bude dostupná na adrese vypsané v terminálu (obvykle `http://localhost:5173`).

---

## 🔧 Řešení problémů

*   **Chybějící API klíč (Gemini)**: Pokud nefunguje AI doporučování, zkontrolujte, zda máte nastavený API klíč (v `.env` souboru ve frontendu, pokud je vyžadován).
*   **CORS chyby**: Pokud frontend nekomunikuje s backendem, ujistěte se, že backend běží a má povolené požadavky z adresy frontendu (CORS konfigurace v Spring Boot).
*   **Databáze**: Pokud backend padá při startu, ověřte, že běží PostgreSQL služba a údaje v `application.properties` jsou správné.
