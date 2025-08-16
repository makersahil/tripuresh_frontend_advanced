export type EnvelopeOk<T> = { success: true; data: T; meta?: any }
export type EnvelopeErr   = { success: false; code?: string; message: string; details?: any }
export type Envelope<T>   = EnvelopeOk<T> | EnvelopeErr

export type PageMeta = { page: number; pageSize: number; total: number; pages: number }

export type Profile = { id:string; name:string; title?:string; bio?:string; links?:Record<string,string>; createdAt:string }
export type Article = { id:string; slug:string; title:string; journal?:string; year:number; abstract?:string; tags?:string[]; authorsList?: {firstName:string; lastName:string}[]; authors?:string; createdAt:string }
export type Publication = { id:string; slug:string; title:string; description?:string; publisher?:string; type:string; year:number; link?:string; createdAt:string }
export type Grant = { id:string; slug:string; title:string; summary?:string; year:number; amount?:number; link?:string; createdAt:string }
export type Patent = { id:string; slug:string; title:string; country:string; patentNo:string; year:number; link?:string; inventorsList?: {firstName:string; lastName:string}[]; createdAt:string }
export type Certification = { id:string; slug:string; title:string; issuer:string; year:number; link?:string; createdAt:string }

export type SearchKind = 'article'|'publication'|'grant'|'patent'|'certification'
