export type EnvelopeOk<T> = { success: true; data: T; meta?: any }
export type EnvelopeErr   = { success: false; code?: string; message: string; details?: any }
export type Envelope<T>   = EnvelopeOk<T> | EnvelopeErr

export type PageMeta = { page: number; pageSize: number; total: number; pages: number }

// export type Profile = { id:string; name:string; title?:string; bio?:string; links?:Record<string,string>; createdAt:string }
// export type Article = { id:string; slug:string; title:string; journal?:string; year:number; abstract?:string; tags?:string[]; authorsList?: {firstName:string; lastName:string}[]; authors?:string; createdAt:string }
export type PublicationType = "Book" | "Conference" | "Chapter";

export type Publication = {
  id: string;
  title: string;
  description: string;
  publisher?: string | null;
  type: PublicationType;
  year: number;
  link?: string | null;
  tags: string[];
  published: boolean;
  slug: string;
  createdAt: string;
  updatedAt: string;
};

export type PublicationInput = {
  title: string;
  description: string;
  type: PublicationType;
  year: number;
  publisher?: string;
  link?: string;
  tags?: string[];
  published?: boolean;
};

export type ListMeta = {
  page: number;
  pageSize: number;
  total: number;
  pages: number;
};

// src/lib/types.ts (append if missing)
export type ResearchGrant = {
  id: string
  slug: string
  title: string
  summary?: string
  year: number
  amount?: number
  link?: string
  published: boolean
  createdAt: string
  updatedAt: string
}

// src/lib/types.ts (append if you don't already have it)
export type Certification = {
  id: string
  slug: string
  title: string
  issuer: string
  year: number
  link?: string
  published: boolean
  createdAt: string
  updatedAt: string
}

// src/lib/types.ts
export type Article = {
  id: string
  slug: string
  title: string
  abstract?: string
  journal: string
  year: number
  doi?: string
  link?: string
  tags?: string[]
  legacyAuthors?: string
  published: boolean
  createdAt: string
  updatedAt: string
  authors?: { firstName: string; lastName: string }[] // if backend includes on read
}


// export type Grant = { id:string; slug:string; title:string; summary?:string; year:number; amount?:number; link?:string; createdAt:string }
// export type Patent = { id:string; slug:string; title:string; country:string; patentNo:string; year:number; link?:string; inventorsList?: {firstName:string; lastName:string}[]; createdAt:string }
// export type Certification = { id:string; slug:string; title:string; issuer:string; year:number; link?:string; createdAt:string }

export type SearchKind = 'article'|'publication'|'grant'|'patent'|'certification'
