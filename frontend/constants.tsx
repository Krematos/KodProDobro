import React from 'react';
import type { Organization, Project, User, ChatMessage, AIBadge, ChatConversation } from './types';

// SVG Icons
export const HomeIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

export const AiSparklesIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m11-1a9 9 0 01-18 0 9 9 0 0118 0zM10 7a1 1 0 100-2 1 1 0 000 2zm0 12a1 1 0 100-2 1 1 0 000 2zm8-5a1 1 0 100-2 1 1 0 000 2z" />
  </svg>
);

export const ChatIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

export const ProfileIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

export const CodeIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
);

export const DesignIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5 text-accent-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
  </svg>
);

export const BackIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

export const BriefcaseIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

export const TrophyIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z" />
  </svg>
);

export const CogIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export const StarIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);


// MOCK DATA
export const ORGANIZATIONS: Record<string, Organization> = {
  adra: {
    id: 'adra',
    name: 'ADRA Česká republika',
    logoUrl: 'https://picsum.photos/seed/adra/100/100',
    description: 'Globální humanitární organizace poskytující pomoc při katastrofách a rozvojovou pomoc.',
    website: 'https://adra.cz',
    isCommunityChampion: true,
    projectsPosted: 2,
  },
  'red-cross': {
    id: 'red-cross',
    name: 'Český červený kříž',
    logoUrl: 'https://picsum.photos/seed/redcross/100/100',
    description: 'Součást Mezinárodního hnutí Červeného kříže a Červeného půlměsíce, poskytující humanitární pomoc.',
    website: 'https://cervenykriz.eu',
    isCommunityChampion: false,
    projectsPosted: 1,
  },
  clovek: {
    id: 'clovek',
    name: 'Člověk v tísni',
    logoUrl: 'https://picsum.photos/seed/clovek/100/100',
    description: 'Nevládní nezisková organizace zaměřená na humanitární pomoc a lidská práva.',
    website: 'https://www.clovekvtisni.cz',
    isCommunityChampion: false,
    projectsPosted: 1,
  },
};

export const PROJECTS: Project[] = [
  {
    id: 'p1',
    title: 'Mobilní aplikace pro správu dobrovolníků',
    organization: ORGANIZATIONS.adra,
    summary: 'Navrhněte a vytvořte multiplatformní mobilní aplikaci pro koordinaci dobrovolníků během nouzových reakcí.',
    description: 'Cílem tohoto projektu je vytvořit intuitivní mobilní aplikaci pro iOS a Android, která pomůže koordinátorům ADRA efektivně řídit a komunikovat s dobrovolníky. Klíčové funkce by měly zahrnovat registraci událostí, upozornění v reálném čase, přidělování úkolů a centrum zdrojů. Studenti získají zkušenosti s mobilním vývojem, UI/UX pro kritické aplikace a integrací backendu.',
    requiredSkills: ['React Native / Flutter', 'Firebase', 'UI/UX Design', 'Node.js (volitelné)'],
    timeline: '3-4 měsíce',
    commitment: '10-15 hodin/týden',
    deliverables: ['UI/UX Wireframes', 'Funkční prototyp', 'Plně funkční mobilní aplikace', 'Dokumentace backend API'],
    status: 'Open',
    tags: ['mobilní', 'sociální dopad', 'nouzová reakce'],
    impactScore: 150,
    highlight: 'Featured',
  },
  {
    id: 'p2',
    title: 'Revamp dárcovské platformy',
    organization: ORGANIZATIONS['red-cross'],
    summary: 'Přepracujte hlavní dárcovský portál Českého červeného kříže pro zlepšení uživatelského zážitku a zvýšení příspěvků.',
    description: 'Hledáme talentované webové vývojáře a designéry pro přepracování našeho stávajícího dárcovského webu. Současný web má nízký konverzní poměr. Nová platforma by měla být moderní, responzivní, bezpečná a poskytovat bezproblémový proces dárcovství. Integrace s platebními bránami a dárcovský dashboard jsou klíčové požadavky. Je to skvělá příležitost pracovat na vysoce navštěvovaném webu s reálným dopadem.',
    requiredSkills: ['React / Vue.js', 'UI/UX Design', 'Stripe/PayPal API', 'Přístupnost (WCAG)'],
    timeline: '2 měsíce',
    commitment: '8-12 hodin/týden',
    deliverables: ['Zpráva z uživatelského výzkumu', 'High-fidelity mockups', 'Responzivní web'],
    status: 'Open',
    tags: ['web', 'ux-design', 'fintech'],
    impactScore: 100,
  },
  {
    id: 'p3',
    title: 'Vzdělávací hra o lidských právech',
    organization: ORGANIZATIONS.clovek,
    summary: 'Vyviňte interaktivní webovou hru pro vzdělávání středoškoláků o problémech lidských práv.',
    description: 'V rámci našeho vzdělávacího programu chceme vytvořit poutavou online hru, která učí studenty o globálních lidských právech. Hra by měla obsahovat příběh, kvízy a scénáře rozhodování. Potřebujeme tým se znalostmi vývoje her, ilustrace a webových technologií, aby tuto vizi oživil. Projekt je podporován grantem Strategie AV21.',
    requiredSkills: ['JavaScript (Phaser, atd.)', 'Ilustrace', 'Vyprávění příběhů', 'HTML5/CSS3'],
    timeline: '4 měsíce',
    commitment: '10 hodin/týden',
    deliverables: ['Dokumentace herního designu', 'Hratelné demo hry', 'Finální webová hra'],
    status: 'In Progress',
    tags: ['vzdělávání', 'gamifikace', 'lidská práva'],
    impactScore: 120,
    highlight: 'First Mover',
  },
];

export const CURRENT_USER: User = {
  id: 'u1',
  name: 'Jana Nováková',
  avatarUrl: 'https://picsum.photos/seed/jana/200/200',
  university: 'České vysoké učení technické v Praze (ČVUT)',
  fieldOfStudy: 'Informatika',
  skills: ['React', 'TypeScript', 'Node.js', 'Python', 'Figma', 'UX Research'],
  bio: 'Vášnivá vývojářka a designérka, která chce uplatnit své dovednosti na projektech, které mají smysl. Zvláště mě zajímají vzdělávací technologie a aplikace pro sociální dobro. Jsem týmový hráč se silnými schopnostmi řešení problémů.',
  interests: ['Frontend vývoj', 'UI/UX design', 'vizualizace dat', 'projekty sociálního dopadu', 'mobilní aplikace'],
  portfolio: [
    { ...PROJECTS[2], status: 'Completed' } // Completed project example
  ],
  xp: 1250,
  level: 5,
  contributionStreak: 1,
  totalImpact: 120,
};

export const MOCK_CHAT_LIST: ChatConversation[] = [
  {
    id: 'chat1',
    organization: ORGANIZATIONS.adra,
    projectTitle: PROJECTS[0].title,
    lastMessage: 'Výborně! To rádi slyšíme. Rádi bychom si domluvi...',
    timestamp: '10:10',
    unreadCount: 1,
  },
  {
    id: 'chat2',
    organization: ORGANIZATIONS['red-cross'],
    projectTitle: PROJECTS[1].title,
    lastMessage: 'Vy: Můžete mi říct více o integraci pla...',
    timestamp: 'Včera',
    unreadCount: 0,
  }
];

export const MOCK_CHAT_MESSAGES: Record<string, ChatMessage[]> = {
  'chat1': [
    { id: 1, sender: 'other', text: 'Ahoj Jano, díky za zájem o projekt Mobilní aplikace pro správu dobrovolníků!', timestamp: '10:01', avatar: ORGANIZATIONS.adra.logoUrl },
    { id: 2, sender: 'other', text: 'Tvůj profil vypadá skvěle. Máš nějaké zkušenosti s Firebase?', timestamp: '10:02', avatar: ORGANIZATIONS.adra.logoUrl },
    { id: 3, sender: 'user', text: 'Ahoj! Děkuji za oslovení. Ano, Firebase jsem použila pro autentizaci a Firestore v několika osobních projektech.', timestamp: '10:05', avatar: CURRENT_USER.avatarUrl },
    { id: 4, sender: 'user', text: 'Mám opravdu zájem o potenciál této aplikace.', timestamp: '10:05', avatar: CURRENT_USER.avatarUrl },
    { id: 5, sender: 'other', text: 'Výborně! To rádi slyšíme. Rádi bychom si domluvili krátký hovor pro prodiskutování projektu. Máš zítra odpoledne čas?', timestamp: '10:10', avatar: ORGANIZATIONS.adra.logoUrl },
  ],
  'chat2': [
    { id: 1, sender: 'other', text: 'Dobrý den Jano, děkujeme za přihlášení do projektu Revamp dárcovské platformy.', timestamp: 'Včera', avatar: ORGANIZATIONS['red-cross'].logoUrl },
    { id: 2, sender: 'user', text: 'Dobrý den! Mám velký zájem. Můžete mi říct více o integraci platební brány?', timestamp: 'Včera', avatar: CURRENT_USER.avatarUrl },
  ]
};


export const GAMIFICATION_BADGES: AIBadge[] = [
  {
    name: 'Budovatel komunity',
    description: 'Uděleno za dokončení prvního projektu s neziskovou organizací.',
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-accent-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
    progress: (user) => ({ current: user.portfolio.length, target: 1 }),
  },
  {
    name: 'Lídr dopadu',
    description: 'Uděleno za vedení projektového týmu k úspěšnému dokončení.',
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" /></svg>,
    progress: (user) => ({ current: 0, target: 1 }), // Assuming no leadership data yet
  },
  {
    name: 'Tech for Good Profík',
    description: 'Uděleno za dokončení tří nebo více projektů.',
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>,
    progress: (user) => ({ current: user.portfolio.length, target: 3 }),
  }
];