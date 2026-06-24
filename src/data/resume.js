

export const profile = {
  name: 'Ansh Gangwar',
  title: 'Full Stack Developer',
  subtitle: 'MERN Stack · AI Integrations',
  location: 'Noida, India',
  email: 'anshgangwar998@gmail.com',
  phone: '+91 8979812787',
 
  github: 'https://github.com/ansh-998',
  linkedin: 'https://www.linkedin.com/in/ansh-gangwar/',
  summary:
    'Full Stack Developer skilled in building scalable MERN applications with hands-on experience in AI-powered platforms, RESTful APIs, authentication systems, and responsive frontend development.',
}

export const skills = {
  frontend: ['Next.js 16', 'TypeScript', 'JavaScript (ES6+)', 'ReactJS', 'React Router', 'Redux', 'Redux Toolkit', 'Tailwind CSS v4', 'Material UI'],
  backend: ['Node.js', 'Express.js', 'RESTful APIs', 'JWT Authentication'],
  database: ['MongoDB', 'Mongoose', 'Supabase', 'SQL Server'],
  tools: ['Gemini 2.5 Flash', 'Zod', 'Vercel', 'Git', 'GitHub', 'Postman', 'Axios', 'Puppeteer', 'pdf-parse', 'Netlify', 'Render', 'VS Code'],
  concepts: ['MVC Architecture', 'State Management (Redux Toolkit)', 'Role-Based Access Control'],
}

export const experience = [
  {
    role: 'Full Stack Developer Intern',
    company: 'Decentralclasses',
    period: 'Jul 2025 – Sep 2025',
    type: 'Remote',
    points: [
      'Developed and maintained responsive course websites ensuring consistent user experience across devices.',
      'Optimized frontend components for better responsiveness, performance, and faster loading speeds.',
      'Assisted in content updates, project coordination, and timely delivery of feature enhancements.',
    ],
  },
]

export const projects = [
  {
    id: 'genai',
    name: 'GenAI',
    tagline: 'AI Interview Preparation & Resume Tailoring System',
    description:
      'A full-stack AI interview prep platform using MERN stack and Google Gemini API. Features resume–JD matching, targeted interview questions, skill gap analysis, and ATS-friendly PDF generation with Puppeteer and Zod schema validation.',
    tech: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Gemini API', 'Puppeteer', 'JWT', 'Zod', 'Tailwind CSS'],
    live: 'https://gen-ai-prod.vercel.app/',    
    github: 'https://github.com/ansh-998/genAI-Prod', 
    highlight: true,
  },
  {
    id: 'tripdesk',
    name: 'Trip-Desk',
    tagline: 'Travel CRM & Booking Portalr',
    description:
      'Trip Desk is a full-stack platform built for slow-travel companies that need more than a spreadsheet to run their business. The public side lets travellers discover trips, explore photo galleries, and submit enquiries that land straight into the CRM. The admin side gives the sales team a live lead pipeline, per-lead call logs, and AI-generated WhatsApp outreach drafts — all powered by Gemini. Role-based auth separates the team dashboard from traveller accounts. Built with Next.js 16, Supabase, TypeScript, and Tailwind CSS v4, with row-level security enforced at the database layer and schema-first Zod validation shared across client and server.',
    tech: ['Next.js 16', 'Redux Toolkit', 'Tailwind CSS', 'RapidAPI', 'JavaScript'],
    live: 'https://ai-summarizer-master.vercel.app/',
    github: 'https://github.com/ansh-998/ai-summarizer-master',
    highlight: false,
  },
  {
    id: 'wanderlust',
    name: 'Wanderlust',
    tagline: 'Hotel Booking Platform',
    description:
      'A full-stack hotel booking platform enabling users to explore listings and manage bookings. Built with JWT auth, role-based access control, and RESTful APIs following MVC architecture with modular backend design.',
    tech: ['Node.js', 'Express.js', 'MongoDB', 'Mongoose', 'JWT', 'EJS', 'REST APIs', 'MVC'],
    live: 'https://wanderlust-hub.vercel.app/listings',
    github: 'https://github.com/ansh-998',
    highlight: false,
  },
  {
    id: 'summarizeai',
    name: 'SummarizeAI',
    tagline: 'AI Article Summarizer',
    description:
      'An AI-powered article summarizer using React, Redux Toolkit, and RapidAPI for real-time web content processing. Features URL-based input, responsive UI, and optimized API handling with loading and error states.',
    tech: ['React', 'Redux Toolkit', 'Tailwind CSS', 'RapidAPI', 'JavaScript'],
    live: 'https://ai-summarizer-master.vercel.app/',
    github: 'https://github.com/ansh-998/ai-summarizer-master',
    highlight: false,
  },
]

export const education = [
  {
    degree: 'B.Tech in Information Technology',
    institution: 'JSS Academy of Technical Education',
    location: 'Noida, Uttar Pradesh',
    period: 'Aug 2021 – May 2025',
    grade: 'CGPA: 7.0',
  },
  {
    degree: 'Intermediate (Class XII)',
    institution: 'BBL Public School',
    location: 'Bareilly, Uttar Pradesh',
    period: '2019 – 2020',
    grade: '89.6%',
  },
]
