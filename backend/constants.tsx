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
    description: 'A global humanitarian organization that provides disaster relief and development assistance.',
    website: 'https://adra.cz',
    isCommunityChampion: true,
    projectsPosted: 2,
  },
  'red-cross': {
    id: 'red-cross',
    name: 'Český červený kříž',
    logoUrl: 'https://picsum.photos/seed/redcross/100/100',
    description: 'Part of the International Red Cross and Red Crescent Movement, providing humanitarian aid.',
    website: 'https://cervenykriz.eu',
    isCommunityChampion: false,
    projectsPosted: 1,
  },
  clovek: {
    id: 'clovek',
    name: 'Člověk v tísni',
    logoUrl: 'https://picsum.photos/seed/clovek/100/100',
    description: 'A non-governmental, non-profit organization focused on humanitarian aid and human rights.',
    website: 'https://www.clovekvtisni.cz',
    isCommunityChampion: false,
    projectsPosted: 1,
  },
};

export const PROJECTS: Project[] = [
  {
    id: 'p1',
    title: 'Volunteer Management Mobile App',
    organization: ORGANIZATIONS.adra,
    summary: 'Design and build a cross-platform mobile app for coordinating volunteers during emergency responses.',
    description: 'The goal of this project is to create an intuitive mobile application for both iOS and Android that helps ADRA coordinators to efficiently manage and communicate with volunteers. Key features should include event registration, real-time notifications, task assignment, and a resource center. Students will gain experience in mobile development, UX/UI for critical applications, and backend integration.',
    requiredSkills: ['React Native / Flutter', 'Firebase', 'UI/UX Design', 'Node.js (optional)'],
    timeline: '3-4 months',
    commitment: '10-15 hours/week',
    deliverables: ['UI/UX Wireframes', 'Functional Prototype', 'Full-featured mobile app', 'Backend API documentation'],
    status: 'Open',
    tags: ['mobile', 'social-impact', 'emergency-response'],
    impactScore: 150,
    highlight: 'Featured',
  },
  {
    id: 'p2',
    title: 'Donation Platform Website Revamp',
    organization: ORGANIZATIONS['red-cross'],
    summary: 'Redesign the main donation portal for the Czech Red Cross to improve user experience and increase contributions.',
    description: 'We are looking for talented web developers and designers to overhaul our existing donation website. The current site has a low conversion rate. The new platform should be modern, responsive, secure, and provide a seamless donation process. Integration with payment gateways and a donor dashboard are key requirements. This is a great opportunity to work on a high-traffic site with a real-world impact.',
    requiredSkills: ['React / Vue.js', 'UI/UX Design', 'Stripe/PayPal API', 'Accessibility (WCAG)'],
    timeline: '2 months',
    commitment: '8-12 hours/week',
    deliverables: ['User research report', 'High-fidelity mockups', 'Responsive website'],
    status: 'Open',
    tags: ['web', 'ux-design', 'fintech'],
    impactScore: 100,
  },
  {
    id: 'p3',
    title: 'Educational Game for Human Rights',
    organization: ORGANIZATIONS.clovek,
    summary: 'Develop an interactive web-based game to educate high school students about human rights issues.',
    description: 'As part of our educational outreach program, we want to create an engaging online game that teaches students about global human rights. The game should feature storytelling, quizzes, and decision-making scenarios. We need a team with skills in game development, illustration, and web technologies to bring this vision to life. The project is supported by the AV21 Strategy grant.',
    requiredSkills: ['JavaScript (Phaser, etc.)', 'Illustration', 'Storytelling', 'HTML5/CSS3'],
    timeline: '4 months',
    commitment: '10 hours/week',
    deliverables: ['Game design document', 'Playable game demo', 'Final web game'],
    status: 'In Progress',
    tags: ['education', 'gamification', 'human-rights'],
    impactScore: 120,
    highlight: 'First Mover',
  },
];

export const CURRENT_USER: User = {
  id: 'u1',
  name: 'Jana Nováková',
  avatarUrl: 'https://picsum.photos/seed/jana/200/200',
  university: 'Czech Technical University in Prague (ČVUT)',
  fieldOfStudy: 'Computer Science & Engineering',
  skills: ['React', 'TypeScript', 'Node.js', 'Python', 'Figma', 'UX Research'],
  bio: 'A passionate developer and designer looking to apply my skills to projects that make a difference. I am particularly interested in educational technology and applications for social good. I am a team player with strong problem-solving abilities.',
  interests: ['Frontend development', 'UI/UX design', 'data visualization', 'social impact projects', 'mobile apps'],
  portfolio: [
      {...PROJECTS[2], status: 'Completed' } // Completed project example
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
        lastMessage: 'Excellent! That\'s great to hear. We\'d love to schedule a brief call...',
        timestamp: '10:10 AM',
        unreadCount: 1,
    },
    { 
        id: 'chat2', 
        organization: ORGANIZATIONS['red-cross'],
        projectTitle: PROJECTS[1].title,
        lastMessage: 'You: Can you tell me more about the payment gateway integration?',
        timestamp: 'Yesterday',
        unreadCount: 0,
    }
];

export const MOCK_CHAT_MESSAGES: Record<string, ChatMessage[]> = {
    'chat1': [
        { id: 1, sender: 'other', text: 'Hi Jana, thanks for your interest in the Volunteer Management App project!', timestamp: '10:01 AM', avatar: ORGANIZATIONS.adra.logoUrl },
        { id: 2, sender: 'other', text: 'Your profile looks like a great fit. Do you have any experience with Firebase?', timestamp: '10:02 AM', avatar: ORGANIZATIONS.adra.logoUrl },
        { id: 3, sender: 'user', text: 'Hi! Thank you for reaching out. Yes, I\'ve used Firebase for authentication and Firestore in a few personal projects.', timestamp: '10:05 AM', avatar: CURRENT_USER.avatarUrl },
        { id: 4, sender: 'user', text: 'I\'m really excited about the potential of this app.', timestamp: '10:05 AM', avatar: CURRENT_USER.avatarUrl },
        { id: 5, sender: 'other', text: 'Excellent! That\'s great to hear. We\'d love to schedule a brief call to discuss the project further. Are you available sometime tomorrow afternoon?', timestamp: '10:10 AM', avatar: ORGANIZATIONS.adra.logoUrl },
    ],
    'chat2': [
        { id: 1, sender: 'other', text: 'Hello Jana, thank you for applying to the Donation Platform Revamp project.', timestamp: 'Yesterday', avatar: ORGANIZATIONS['red-cross'].logoUrl },
        { id: 2, sender: 'user', text: 'Hello! I\'m very interested. Can you tell me more about the payment gateway integration?', timestamp: 'Yesterday', avatar: CURRENT_USER.avatarUrl },
    ]
};


export const GAMIFICATION_BADGES: AIBadge[] = [
    {
        name: 'Community Builder',
        description: 'Awarded for completing your first project with a non-profit.',
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-accent-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
        progress: (user) => ({ current: user.portfolio.length, target: 1 }),
    },
    {
        name: 'Impact Leader',
        description: 'Awarded for leading a project team to successful completion.',
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" /></svg>,
        progress: (user) => ({ current: 0, target: 1 }), // Assuming no leadership data yet
    },
    {
        name: 'Tech for Good Pro',
        description: 'Awarded for completing three or more projects.',
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>,
        progress: (user) => ({ current: user.portfolio.length, target: 3 }),
    }
];