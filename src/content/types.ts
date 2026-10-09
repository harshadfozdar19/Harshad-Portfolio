export interface Link {
  label: string;
  href: string;
}

export interface Profile {
  name: string;
  firstName: string;
  lastName: string;
  role: string;
  headline: string;
  location: string;
  email: string;
  phone: string;
  phoneDisplay: string;
  linkedin: string;
  pronouns: string;
  /** Rotating phrases after "I engineer …" in the hero. */
  roles: string[];
  summary: string;
  about: string[];
  quote: string;
  openTo: string[];
  workModes: string;
  /** Static year for the footer — `new Date()` would break static prerendering. */
  year: number;
  /**
   * Colour portrait for the Profile ID card (4:5, 720×900): a path under /public.
   * Read from NEXT_PUBLIC_PROFILE_PHOTO and never hard-coded, because the file is private and
   * git-ignored. When neither photo is set, the card shows an "HF" monogram instead.
   */
  photo?: string;
  /**
   * Ink/paper duotone of the same portrait (4:5, 720×900), from NEXT_PUBLIC_PROFILE_PHOTO_MONO.
   * Shown by default on the ID card; it crossfades to `photo` on hover when both are set.
   */
  photoMono?: string;
}

export interface Stat {
  value: number;
  decimals?: number;
  suffix?: string;
  label: string;
}

export interface Pillar {
  title: string;
  /** Short mono code shown on the card, e.g. "AI-01". */
  code: string;
  body: string;
  /** Phrases inside `body` to emphasise. */
  emphasis?: string[];
}

export interface Experience {
  company: string;
  role: string;
  location: string;
  start: string;
  end: string;
  current?: boolean;
  summary: string;
  productAreas?: string[];
  pillars?: Pillar[];
  skills: string[];
  note?: string;
}

export interface PipelineStep {
  title: string;
  detail: string;
  accent?: boolean;
}

export type ProjectVisual = "rag" | "evaluation" | "radar";

export interface FeaturedProject {
  exhibit: string;
  title: string;
  category: string;
  period: string;
  summary: string;
  points: string[];
  stack: string[];
  visual: ProjectVisual;
}

export interface Project {
  title: string;
  category: string;
  period: string;
  summary: string;
  stack: string[];
}

export interface SkillGroup {
  title: string;
  items: string[];
  wide?: boolean;
}

export interface Exploration {
  title: string;
  quote?: string;
  body: string;
}

export interface Education {
  school: string;
  degree: string;
  location: string;
  period: string;
  grade: string;
}

export interface Credential {
  title: string;
  issuer: string;
  date?: string;
  detail: string;
}
