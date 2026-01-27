# ImpactLink

**ImpactLink** je webová platforma navržená k propojení studentů informatiky a designu s českými neziskovými organizacemi. Cílem je umožnit studentům získat praxi na reálných projektech (Tech for Good) a zároveň pomoci neziskovému sektoru s digitalizací.

## 🚀 Klíčové vlastnosti

1.  **Prohlížení a filtrace projektů**:
    *   Uživatelé mohou procházet projekty od organizací jako ADRA, Člověk v tísni atd.
    *   Filtrace podle stavu (Otevřené, V řešení), organizace nebo požadovaných dovedností (React, Design, atd.).
    *   Vyhledávání v reálném čase.

2.  **AI Doporučování (Gemini API)**:
    *   Stránka "AI Shoda" využívá umělou inteligenci Google Gemini.
    *   Analyzuje profil studenta (zadaný text) a seznam dostupných projektů.
    *   Vrací personalizovaná doporučení s vysvětlením, proč je projekt vhodný (matching).

3.  **Simulovaný Chat**:
    *   Integrovaný chatovací systém pro komunikaci mezi studentem a organizací.
    *   Využívá `ChatService` (Observer pattern) pro simulaci reálného času bez nutnosti backendu.

4.  **Gamifikace a Profil**:
    *   Systém odznaků (Badge) za dokončené projekty.
    *   Sledování XP (zkušeností) a úrovní (Level).
    *   Portfolio uživatele.

5.  **Lokalizace**:
    *   Celá aplikace je plně lokalizována do českého jazyka.

## 🛠 Použité technologie

*   **Frontend**: React 19
*   **Jazyk**: TypeScript
*   **Styling**: Tailwind CSS
*   **AI Integrace**: Google GenAI SDK (@google/genai)
*   **Stav a Data**: React Hooks (`useState`, `useEffect`, `useCallback`) + LocalStorage pro perzistenci dat (např. uložené projekty, nastavení notifikací).

## 📂 Struktura projektu

Projekt je organizován následovně:

*   **`App.tsx`**: Hlavní vstupní bod aplikace, router (jednoduchý switch) a globální modály.
*   **`pages/`**: Hlavní stránky aplikace.
    *   `HomePage.tsx`: Výpis projektů a filtry.
    *   `ProjectDetailPage.tsx`: Detail konkrétního projektu.
    *   `AIMatchPage.tsx`: Formulář pro AI doporučování.
    *   `ChatPage.tsx` / `ChatListPage.tsx`: Rozhraní pro zprávy.
    *   `ProfilePage.tsx`: Profil studenta a gamifikace.
*   **`components/`**: Znovupoužitelné UI komponenty.
    *   `ProjectCard.tsx`: Karta projektu.
    *   `LoginModal.tsx`: Modální okno pro přihlášení/registraci.
    *   `NotificationSettingsModal.tsx`: Nastavení preferencí.
    *   `Toast.tsx`: Notifikační bubliny.
*   **`services/`**: Logika komunikace s daty a API.
    *   `geminiService.ts`: Komunikace s Google Gemini API pro AI matching.
    *   `chatService.ts`: Simulace backendu pro chat (odesílání/příjem zpráv).
*   **`types.ts`**: Definice TypeScript rozhraní (User, Project, Organization, ChatMessage).
*   **`constants.tsx`**: Mock data (falešná databáze projektů a uživatelů) a SVG ikony.

## ⚙️ Konfigurace a Backend

Tato aplikace je momentálně **Frontend-Only prototyp**.

*   **Backend**: Neexistuje skutečný serverový backend. Veškerá data jsou simulována v souboru `constants.tsx` a interakce (jako uložení projektu) jsou řešeny přes `localStorage` v prohlížeči.
*   **API Klíč**: Pro funkčnost AI matchingu je nutné mít nastavený `API_KEY` v prostředí (process.env). Pokud není klíč dostupný, služba vrací simulovaná ("mock") data, aby aplikace nespadla.

## 📦 Instalace a Spuštění

V prostředí jako WebContainer nebo lokálně:

1.  Nainstalujte závislosti:
    ```bash
    npm install
    ```

2.  Spusťte vývojový server:
    ```bash
    npm start
    ```

## 🔐 Přihlašovací údaje (Demo)

Pro testování přihlášení můžete použít libovolné údaje v registračním formuláři, nebo pro rychlé přihlášení (předvyplněno v kódu):

*   **Email**: `user@impactlink.cz`
*   **Heslo**: `password123`

---
*Vytvořeno pro KodProDobrouvec / ImpactLink CZ*
