# ImpactLink CZ - Frontend

> 🌟 Propojujeme studenty s neziskovými organizacemi pro smysluplnou spolupráci

Frontend aplikace pro platformu **ImpactLink CZ**, která umožňuje studentům najít projekty v neziskových organizacích a neziskovým organizacím najít talentované studenty pro jejich projekty.

---

## 📋 Obsah

- [Technologie](#-technologie)
- [Rychlý Start](#-rychlý-start)
- [Struktura Projektu](#-struktura-projektu)
- [Konfigurace](#-konfigurace)
- [Architektura](#-architektura)
- [Hlavní Funkce](#-hlavní-funkce)
- [Routing](#-routing)
- [State Management](#-state-management)
- [Styling](#-styling)
- [Skripty](#-skripty)

---

## 🛠 Technologie

### Core
- **React 19.2** - UI knihovna
- **TypeScript 5.8** - Type-safe JavaScript
- **Vite 6.2** - Build tool a dev server
- **React Router 6.22** - Client-side routing

### State Management & Data Fetching
- **TanStack Query 5.20** - Server state management, caching, synchronizace
- **React Context API** - Client state (AuthContext)

### Forms & Validation
- **React Hook Form 7.71** - Správa formulářů
- **Zod 4.3** - Schema validation
- **@hookform/resolvers 5.2** - Integrace RHF + Zod

### Styling
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **PostCSS 8.5** - CSS transformace
- **Autoprefixer 10.4** - Vendor prefixes

### Icons & UI
- **Lucide React 0.562** - Icon library
- Custom UI komponenty (Button, Input, Card, atd.)

### AI Integration
- **Google Gemini API** - AI-powered matching studentů a projektů

---

## 🚀 Rychlý Start

### Prerekvizity
- **Node.js** 18+ (doporučeno 20+)
- **npm** nebo **yarn**
- Běžící backend na `http://localhost:8080`

### Instalace a Spuštění

```bash
# 1. Instalace závislostí
npm install

# 2. Konfigurace environment variables
# Vytvořte .env.local soubor (viz sekce Konfigurace)

# 3. Spuštění dev serveru
npm run dev

# Aplikace běží na http://localhost:3000
```

### Build pro Production

```bash
# Build
npm run build

# Preview production buildu
npm run preview
```

---

## 📁 Struktura Projektu

```
frontend/
├── components/          # Komponenty
│   ├── wizard/         # Multi-step formuláře (Create Project Wizard)
│   ├── CreateProjectWizard.tsx
│   ├── LoadingSpinner.tsx
│   └── TagInput.tsx
│
├── config/             # Konfigurační soubory
│   └── apiConfig.ts    # API endpoints, timeouts, headers
│
├── constants.tsx       # Konstanty (icons, config hodnoty)
│
├── contexts/           # React Context Providers
│   └── AuthContext.tsx # Autentizace, user state
│
├── hooks/              # Custom React hooks
│   ├── mutations/      # TanStack Query mutations
│   └── queries/        # TanStack Query queries
│       ├── useProject.ts
│       └── useUser.ts
│
├── layouts/            # Layout komponenty
│   └── AppLayout.tsx   # Hlavní layout s bottom navigation
│
├── lib/                # Utility knihovny
│   └── queryClient.ts  # TanStack Query konfigurace
│
├── pages/              # Route komponenty (stránky)
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── ProjectDetailPage.tsx
│   ├── CreateProjectPage.tsx
│   ├── AIMatchPage.tsx
│   ├── ChatPage.tsx
│   ├── ChatListPage.tsx
│   └── ProfilePage.tsx
│
├── routes/             # Routing konfigurace
│   ├── index.tsx       # Centrální routing (AppRoutes)
│   └── ProtectedRoute.tsx  # Auth guard pro protected routes
│
├── services/           # API služby
│   ├── authService.ts
│   ├── projectService.ts
│   ├── chatService.ts
│   ├── userService.ts
│   └── geminiService.ts
│
├── src/                # Source files
│   ├── components/ui/  # Reusable UI komponenty
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── index.ts
│   └── styles/         # Globální styly
│       ├── index.css   # Tailwind directives, custom styles
│       └── fonts.css
│
├── utils/              # Utility funkce
│   └── apiClient.ts    # Axios instance, interceptory
│
├── types.ts            # TypeScript typy a interfaces
├── App.tsx             # Root komponenta
├── index.tsx           # Entry point
├── vite.config.ts      # Vite konfigurace
├── tailwind.config.js  # Tailwind konfigurace
├── tsconfig.json       # TypeScript konfigurace
└── .env.local          # Environment variables (necommitovat!)
```

---

## ⚙️ Konfigurace

### Environment Variables

Vytvořte soubor `.env.local` v root složce:

```env
# Backend API URL
VITE_API_BASE_URL=http://localhost:8080

# Google Gemini API Key (pro AI matching)
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

> ⚠️ **Důležité**: Soubor `.env.local` je v `.gitignore` - nikdy ho necommitujte!

### API Konfigurace

Konfigurace API je v `config/apiConfig.ts`:
- Base URL
- Timeouts
- Headers
- Endpoint paths

---

## 🏗 Architektura

### Data Flow

```
User Interaction
    ↓
React Component
    ↓
TanStack Query (useQuery/useMutation)
    ↓
Service Layer (projectService.ts, authService.ts, ...)
    ↓
API Client (axios instance with interceptors)
    ↓
Backend API (Spring Boot)
```

### State Management

**Server State** (TanStack Query):
- Project data
- User profiles
- Chat messages
- Query caching, refetching, optimistic updates

**Client State** (React Context):
- Authentication state (`AuthContext`)
- Current user info
- Auth tokens (HttpOnly cookies)

### Authentication Flow

1. User přihlášení přes `LoginPage`
2. `authService.login()` → Backend `/api/auth/login`
3. Backend vrací JWT v **HttpOnly cookie** (bezpečnější než localStorage)
4. `AuthContext` ukládá user stav
5. Protected routes používají `ProtectedRoute` wrapper
6. API requesty automaticky posílají cookie

---

## ✨ Hlavní Funkce

### 1. **Autentizace**
- Registrace nových uživatelů (Student/NGO)
- Přihlášení s username/password
- JWT tokeny v HttpOnly cookies
- Protected routes

### 2. **Projekty**
- Browse projektů na homepage
- Filtrování (skills, časová náročnost, lokace)
- Detail projektu s aplikací
- Vytváření projektů (multi-step wizard)

### 3. **AI Matching**
- Google Gemini API integrace
- Automatické doporučení projektů pro studenty
- Matching based on skills, interests, location

### 4. **Chat & Komunikace**
- Real-time chat mezi studenty a NGO
- Seznam konverzací
- Messaging pro projekty

### 5. **Profil**
- Zobrazení a editace profilu
- Správa skills
- Historie projektů

---

## 🗺 Routing

### Public Routes
| Path | Component | Popis |
|------|-----------|-------|
| `/` | `HomePage` | Homepage s projekty |
| `/projects/:id` | `ProjectDetailPage` | Detail projektu |
| `/login` | `LoginPage` | Přihlášení |
| `/register` | `RegisterPage` | Registrace |

### Protected Routes (vyžadují přihlášení)
| Path | Component | Popis |
|------|-----------|-------|
| `/projects/new` | `CreateProjectPage` | Vytvoření projektu |
| `/ai-match` | `AIMatchPage` | AI doporučení |
| `/chat` | `ChatListPage` | Seznam konverzací |
| `/chat/:id` | `ChatPage` | Chat detail |
| `/profile` | `ProfilePage` | Uživatelský profil |

### Route Guards

```tsx
<ProtectedRoute>
  <YourProtectedPage />
</ProtectedRoute>
```

---

## 🎨 Styling

### Tailwind CSS

Custom design tokens v `tailwind.config.js`:

```js
colors: {
  'brand-blue': '#00529B',
  'brand-red': '#D80027',
  'brand-light': '#F0F4F8',
  'brand-dark': '#2C3E50',
  'accent-teal': '#1ABC9C',
  'accent-yellow': '#F1C40F',
}
```

### CSS Layers

Strukturované pomocí `@layer` v `src/styles/index.css`:
- **base** - Global resets, HTML element defaults
- **components** - Reusable component classes
- **utilities** - Custom utility classes

### Komponenty

Custom UI komponenty v `src/components/ui/`:
- Konzistentní design
- Type-safe props
- Composable a reusable

---

## 📜 Skripty

```bash
# Development server (port 3000)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

---

## 🔐 Bezpečnost

- **HttpOnly Cookies** pro JWT tokeny (ne localStorage)
- **CORS** konfigurace na backendu
- **Input validation** s Zod schemas
- **Protected routes** s authentication guard
- **Environment variables** pro API keys

---

## 🤝 Integrace s Backendem

Backend běží na **Spring Boot** (`http://localhost:8080`).

### API Endpoints

```typescript
// Base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Endpoints
/api/auth/login
/api/auth/register
/api/projects
/api/projects/:id
/api/chat
/api/users/profile
```

### Request Flow

1. Component → TanStack Query hook
2. Hook → Service function
3. Service → apiClient (axios)
4. apiClient → Backend API
5. Response → Query cache → Component re-render

---

## 📦 Důležité Závislosti

```json
{
  "@tanstack/react-query": "^5.20.0",  // Data fetching & caching
  "react-router-dom": "^6.22.0",       // Routing
  "react-hook-form": "^7.71.1",        // Forms
  "zod": "^4.3.5",                     // Validation
  "lucide-react": "^0.562.0",          // Icons
  "tailwindcss": "^3.4.19"             // Styling
}
```

---

## 🐛 Troubleshooting

### Dev server nespousta
```bash
# Vyčistit node_modules a reinstalovat
rm -rf node_modules package-lock.json
npm install
```

### API requesty failují
- Zkontroluj, že backend běží na port 8080
- Zkontroluj `.env.local` - správné `VITE_API_BASE_URL`
- Zkontroluj CORS nastavení na backendu

### Build errory
```bash
# Zkontroluj TypeScript errory
npx tsc --noEmit
```

---

## 📚 Další Zdroje

- [React Documentation](https://react.dev)
- [TanStack Query](https://tanstack.com/query/latest)
- [React Router](https://reactrouter.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite Guide](https://vite.dev/guide/)

---




