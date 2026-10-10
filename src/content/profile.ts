/**
 * Single source of truth for all portfolio copy.
 * Components render this data; to update the site, edit this file only.
 * Every claim here is traceable to the resume or LinkedIn profile.
 */
import type {
  Credential,
  Education,
  Experience,
  Exploration,
  FeaturedProject,
  PipelineStep,
  Profile,
  Project,
  SkillGroup,
  Stat,
} from "./types";

export const profile: Profile = {
  name: "Harshad Fozdar",
  firstName: "Harshad",
  lastName: "Fozdar",
  role: "Full Stack & AI Engineer",
  headline: "Full Stack Developer Intern @ Frautect",
  location: "Jaipur, Rajasthan",
  email: "harshad622004fozdar@gmail.com",
  linkedin: "https://www.linkedin.com/in/harshad-fozdar-85966a24a/",
  pronouns: "He/Him",
  roles: [
    "AI investigation engines",
    "LangGraph agents",
    "OSINT pipelines",
    "RAG systems",
    "async worker queues",
    "full-stack products",
  ],
  summary:
    "Full Stack Developer Intern at Frautect, building cybersecurity, OSINT and AI investigation systems: BullMQ/Redis worker pipelines, Playwright discovery scrapers, embedding-based semantic search, and a LangGraph + Gemini agent that gathers evidence and returns structured risk verdicts.",
  about: [
    "I’m a Full Stack Developer working where security, data and AI meet. At Frautect I build products that monitor GitHub repositories, catch brand impersonation and credential exposure, track threat intelligence and monitor social media.",
    "I care about the whole problem, not only the code: designing the system, integrating LLMs, debugging, deploying, and changing things based on how real users behave. Much of my work is in the parts people don’t see: scheduled jobs, risk-prioritised queues, enrichment workers, and an AI investigation agent that reasons over evidence and returns a verdict an analyst can act on.",
  ],
  quote: "I believe developers are hired for what they’ve built, not where they studied.",
  openTo: [
    "Full-Stack Engineering",
    "Backend Development",
    "AI / Product",
    "Early-stage Startups",
    "Founding Teams",
  ],
  workModes: "On-site · Hybrid · Remote",
  year: 2026,
  // Published portrait + résumé live in /public/private/. Env vars can override the paths;
  // set them to an empty string to hide the photo (monogram fallback) or the résumé links.
  photo: process.env.NEXT_PUBLIC_PROFILE_PHOTO ?? "/private/portrait.jpg",
  photoMono: process.env.NEXT_PUBLIC_PROFILE_PHOTO_MONO ?? "/private/portrait-mono.jpg",
  resume: process.env.NEXT_PUBLIC_RESUME_URL ?? "/private/Harshad_Fozdar_Resume.pdf",
};

export const stats: Stat[] = [
  { value: 3, label: "Internships: Frautect, Metacrafters, Bharat Intern" },
  { value: 8, label: "Projects built across AI, security, vision & web" },
  { value: 5, label: "Security product areas at Frautect, from GitHub monitoring to threat intel" },
  { value: 3, label: "LLM systems built: investigation agent, RAG chatbot, Ace-Prep" },
];

export const experience: Experience[] = [
  {
    company: "Frautect Technologies Pvt. Ltd.",
    role: "Full Stack Developer Intern",
    location: "Jaipur, Rajasthan · On-site",
    start: "Aug 2026",
    end: "Present",
    current: true,
    summary:
      "Cybersecurity and OSINT products: backend services, monitoring pipelines and an AI investigation engine.",
    productAreas: [
      "GitHub Repository Monitoring",
      "Brand Impersonation",
      "Credential Exposure",
      "Threat Intelligence",
      "Social-Media Monitoring",
    ],
    pillars: [
      {
        code: "AI-01",
        title: "AI Investigation Engine",
        body: "Built a LangGraph + Gemini agent with tool-based evidence gathering, contextual reasoning, risk analysis and structured AI verdicts.",
        emphasis: ["LangGraph + Gemini", "structured AI verdicts"],
      },
      {
        code: "PIPE-02",
        title: "Async Monitoring Pipelines",
        body: "Scheduled jobs find new targets, BullMQ/Redis queues them, and workers enrich them with repository and identity signals. Risk-based priority and retry handling are built in.",
        emphasis: ["BullMQ/Redis"],
      },
      {
        code: "OSINT-03",
        title: "OSINT Discovery & Scraping",
        body: "Social-media discovery through search engines, Playwright browser automation, account extraction, deduplication and enrichment.",
        emphasis: ["Playwright"],
      },
      {
        code: "SEM-04",
        title: "Semantic Correlation",
        body: "Embedding-based search that links repositories, contributors, commits, deployments, accounts and identity signals during an investigation.",
        emphasis: ["Embedding-based search"],
      },
      {
        code: "API-05",
        title: "Backend Services",
        body: "NestJS, MongoDB and REST APIs for repository discovery, scanning, account processing, enrichment and asynchronous workflows.",
        emphasis: ["NestJS, MongoDB and REST APIs"],
      },
      {
        code: "UI-06",
        title: "Analyst Tooling & QA",
        body: "Internal React / Next.js analyst tools for monitoring, findings, evidence review, investigations and AI-assisted analysis. I also run API, functional, integration and regression testing.",
        emphasis: ["React / Next.js"],
      },
    ],
    skills: [
      "TypeScript",
      "NestJS",
      "Next.js",
      "LangGraph",
      "Gemini",
      "BullMQ",
      "Redis",
      "MongoDB",
      "Playwright",
    ],
  },
  {
    company: "Metacrafters",
    role: "Intern",
    location: "Remote",
    start: "Jun 2024",
    end: "Aug 2024",
    summary:
      "Hands-on blockchain programme building on Ethereum with JavaScript tooling. Completed with a certificate.",
    skills: ["JavaScript", "Ethereum", "Web3"],
    note: "Certified",
  },
  {
    company: "Bharat Intern",
    role: "Full Stack Developer Intern",
    location: "Remote",
    start: "Jul 2023",
    end: "Aug 2023",
    summary: "My first internship: building web applications with JavaScript, HTML and CSS.",
    skills: ["JavaScript", "HTML", "CSS"],
  },
];

export const pipeline: PipelineStep[] = [
  { title: "Scheduled Jobs", detail: "Detect newly added targets" },
  { title: "BullMQ · Redis", detail: "Risk-prioritised queues & retries" },
  { title: "Workers", detail: "Scrape · discover · dedupe" },
  { title: "Enrichment", detail: "Repo & identity signals → MongoDB" },
  { title: "LangGraph Agent", detail: "Tools · semantic search · Gemini", accent: true },
  { title: "AI Verdict", detail: "Structured risk for analysts", accent: true },
];

export const featuredProjects: FeaturedProject[] = [
  {
    exhibit: "A",
    title: "RAG-Based AI Chatbot: Document Q&A",
    category: "AI · Retrieval",
    period: "Nov – Dec 2025",
    summary:
      "A full Retrieval-Augmented Generation pipeline with hybrid search: document ingestion, chunking, embeddings, Pinecone vector storage, semantic retrieval, context construction and Gemini generation. Prompts are built from retrieved context, so answers stay grounded in your documents with fewer hallucinations.",
    points: [
      "Pinecone similarity search builds prompts on the fly",
      "FastAPI backend with request validation, structured error handling and logging; endpoints tested in Postman",
      "React UI for upload, retrieval and Q&A",
    ],
    stack: ["Python", "FastAPI", "React", "Pinecone", "Gemini"],
    visual: "rag",
  },
  {
    exhibit: "B",
    title: "Ace-Prep: AI Answer Evaluation for Communication Skills",
    category: "AI · EdTech",
    period: "Jul – Oct 2025",
    summary:
      "An AI-powered platform for improving communication skills. Users submit answers, Gemini evaluates them, and the model’s output is converted into structured assessment and scoring data that drives performance and progress tracking.",
    points: [
      "Gemini output converted into structured assessment data",
      "MongoDB schemas for users, submissions, scores & history",
      "REST API workflows for auth, submission and evaluation, with request validation and iterative testing",
    ],
    stack: ["React", "Node.js", "Express", "MongoDB", "Gemini"],
    visual: "evaluation",
  },
  {
    exhibit: "C",
    title: "OSINT & Social-Media Monitoring",
    category: "Work · Frautect",
    period: "2026",
    summary:
      "Social-media discovery workflows that find accounts through search engines and Playwright automation, then extract, deduplicate and enrich them and queue them by risk for downstream AI investigation.",
    points: [
      "Search-engine discovery + Playwright automation",
      "Account extraction, deduplication & enrichment",
      "Worker queues with retries and risk-based prioritisation",
    ],
    stack: ["NestJS", "Playwright", "BullMQ", "Redis", "MongoDB"],
    visual: "radar",
  },
];

export const projects: Project[] = [
  {
    title: "Website Security Analysis System",
    category: "Security",
    period: "Full stack",
    summary:
      "A full-stack system designed to detect phishing and spoofed websites, applying my security work beyond the job.",
    stack: ["React", "Node.js"],
  },
  {
    title: "Garud: Vision Object Detection",
    category: "Computer Vision",
    period: "Jun 2024",
    summary:
      "Object detection on road-traffic footage using the YOLOv5 deep-learning model and OpenCV, drawing bounding boxes around detected vehicles.",
    stack: ["YOLOv5", "OpenCV", "Python"],
  },
  {
    title: "Avalanche Prediction",
    category: "Team project",
    period: "Feb – Mar 2024",
    summary: "An avalanche-prediction project in Python with a web interface, built with a team of three.",
    stack: ["Python", "Web Development"],
  },
  {
    title: "Face Recognition Attendance",
    category: "Computer Vision",
    period: "Oct 2022 – Jan 2023",
    summary:
      "A Chandigarh University project built with a teammate: attendance software that recognises faces with OpenCV and marks attendance automatically.",
    stack: ["OpenCV", "Pandas", "Python"],
  },
  {
    title: "Mithai Magic: Sweet Shop Manager",
    category: "MERN",
    period: "Full stack",
    summary: "A MERN-stack web application for managing a sweet shop, built on REST APIs.",
    stack: ["MongoDB", "Express", "React", "Node.js"],
  },
  {
    title: "Task Management System",
    category: "Shipped",
    period: "Full stack",
    summary:
      "One of the three production-grade systems I’ve shipped: a full-stack task management application.",
    stack: ["Full Stack"],
  },
];

export const skills: SkillGroup[] = [
  {
    title: "AI / LLM",
    wide: true,
    items: [
      "LangGraph",
      "LangChain",
      "RAG",
      "Hybrid Search",
      "Semantic Search",
      "Embeddings",
      "AI Agents",
      "Agent Loop Engineering",
      "Prompt Engineering",
      "Context Engineering",
      "Tool Calling",
      "Structured Outputs",
    ],
  },
  {
    title: "LLM APIs & Runtimes",
    items: ["Gemini API", "OpenAI API", "Claude", "OpenRouter", "Groq", "Ollama (local LLMs)"],
  },
  { title: "Languages", items: ["TypeScript", "JavaScript", "Python", "C++", "SQL"] },
  { title: "Backend", items: ["NestJS", "Node.js", "Express", "FastAPI", "REST", "Microservices", "JWT"] },
  { title: "Frontend", items: ["React", "Next.js", "Tailwind CSS", "Responsive UI", "HTML5", "CSS3"] },
  {
    title: "Data",
    items: ["PostgreSQL", "MongoDB", "Mongoose", "Supabase", "MySQL", "Redis", "Pinecone", "Vector DBs"],
  },
  {
    title: "Automation & OSINT",
    wide: true,
    items: [
      "Playwright",
      "Web Scraping",
      "Search Discovery",
      "Data Extraction",
      "Data Enrichment",
      "GitHub API",
      "Deduplication",
    ],
  },
  {
    title: "Engineering & Testing",
    wide: true,
    items: [
      "BullMQ",
      "Docker",
      "Git",
      "GitHub Actions",
      "Linux",
      "Postman",
      "Jest",
      "System Design",
      "OOP",
      "Data Structures",
      "API Testing",
      "Integration Testing",
      "Functional Testing",
      "Regression Testing",
      "Debugging",
    ],
  },
  { title: "AI-Assisted Development", items: ["Claude Code", "Cursor", "GitHub Copilot"] },
  {
    title: "Vision, ML & Web3",
    wide: true,
    items: ["OpenCV", "YOLOv5", "Pandas", "Data Science", "Ethereum", "Blockchain"],
  },
];

export const explorations: Exploration[] = [
  {
    title: "Decision-centric AI",
    quote: "What if AI didn’t need to write anything, and just needed to decide?",
    body: "Experimenting with Jev and Laya to see how lightweight decision models for classification, scoring and routing work alongside LLM agent systems. I wrote a LinkedIn carousel on where Jev fits next to LLMs: “Jev + LLM, not Jev vs LLM.”",
  },
  {
    title: "Context Engineering",
    body: "Better context construction and selection, retrieval quality, tool instructions and structured outputs, with less noise reaching the model.",
  },
  {
    title: "Agent Architectures",
    body: "LangGraph state management, tool selection, multi-step reasoning, model routing, tool-call validation and controlled execution.",
  },
];

export const education: Education = {
  school: "Chandigarh University",
  degree: "Bachelor of Engineering, Computer Science",
  location: "Mohali, Punjab",
  period: "2022 – 2026",
  grade: "7.70 CGPA",
};

export const credentials: Credential[] = [
  {
    title: "React Native",
    issuer: "Coursera · Meta",
    detail: "Cross-platform mobile development with React",
  },
  {
    title: "Databases & SQL for Data Science with Python",
    issuer: "Coursera",
    date: "Mar 2024",
    detail: "MySQL, data science, querying & analysis",
  },
  {
    title: "Introduction to Databases",
    issuer: "Coursera · Meta",
    date: "Feb 2024",
    detail: "DBMS fundamentals, MySQL & schema design",
  },
  {
    title: "Internship Certificate",
    issuer: "Metacrafters",
    date: "2024",
    detail: "Ethereum & JavaScript · Jun – Aug 2024",
  },
];

export const navItems = [
  { id: "profile", label: "Profile" },
  { id: "record", label: "Record" },
  { id: "method", label: "Method" },
  { id: "exhibits", label: "Exhibits" },
  { id: "inventory", label: "Inventory" },
  { id: "credentials", label: "Credentials" },
  { id: "contact", label: "Contact" },
] as const;

/** Supporting copy for section intros, captions and the footer. */
export const sectionCopy = {
  methodIntro:
    "The monitoring-to-investigation pipeline I engineered at Frautect: scheduled, asynchronous, and ending in a structured AI verdict.",
  methodTraits: ["Scheduled", "Async", "Retries", "Risk-prioritised", "AI-explained"],
  contactLead:
    "I’m looking for roles where I can build production systems, ship features that matter, and work with teams who care about shipping.",
  footerTagline: "Hired for what I’ve built.",
  colophon: "Built with Next.js · TypeScript",
} as const;
