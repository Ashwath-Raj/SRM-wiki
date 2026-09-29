export type SourceType = "OFFICIAL" | "DEPARTMENT" | "ORGANIZATION" | "STUDENT" | "COMMUNITY" | "EXTERNAL";

export type VerificationStatus = "DISCOVERED" | "PENDING_REVIEW" | "VERIFIED" | "PUBLISHED" | "REJECTED" | "ARCHIVED";

export interface Portal {
  id: string;
  slug: string;
  name: string;
  description?: string;
  url: string;
  category: string;
  icon?: string;
  is_quick_access: boolean;
  source_id?: string;
  source_type: SourceType;
  verification_status: VerificationStatus;
  last_verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface EventItem {
  id: string;
  slug: string;
  title: string;
  description?: string;
  start_time: string;
  end_time?: string;
  venue?: string;
  organizer?: string;
  category: string;
  registration_url?: string;
  source_id?: string;
  source_type: SourceType;
  source_url?: string;
  verification_status: VerificationStatus;
  status: "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED" | "ARCHIVED";
  created_at: string;
  updated_at: string;
}

export interface NoticeItem {
  id: string;
  slug: string;
  title: string;
  description?: string;
  category: string;
  priority: "NORMAL" | "IMPORTANT" | "URGENT";
  published_at?: string;
  expires_at?: string;
  source_id?: string;
  source_type: SourceType;
  source_url?: string;
  document_id?: string;
  verification_status: VerificationStatus;
  status: "ACTIVE" | "EXPIRED" | "ARCHIVED";
  created_at: string;
  updated_at: string;
}

export interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  description?: string;
  team: string[];
  department: string;
  year: string;
  technologies: string[];
  github_url?: string;
  demo_url?: string;
  documentation_url?: string;
  organization_name?: string;
  source_type: SourceType;
  verification_status: VerificationStatus;
  created_at: string;
  updated_at: string;
}

export interface OrganizationItem {
  id: string;
  slug: string;
  name: string;
  description?: string;
  type: string;
  department?: string;
  website_url?: string;
  social_links?: Record<string, string>;
  contact?: string;
  logo_url?: string;
  source_type: SourceType;
  verification_status: VerificationStatus;
  created_at: string;
  updated_at: string;
}

export interface OpportunityItem {
  id: string;
  slug: string;
  title: string;
  description?: string;
  company?: string;
  type: string;
  deadline?: string;
  eligibility?: string;
  apply_url?: string;
  source_type: SourceType;
  source_url?: string;
  verification_status: VerificationStatus;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface DocumentItem {
  id: string;
  slug: string;
  title: string;
  description?: string;
  document_type: string;
  file_url: string;
  source_url?: string;
  source_type: SourceType;
  published_at?: string;
  page_count: number;
  extracted_text?: string;
  verification_status: VerificationStatus;
  created_at: string;
  updated_at: string;
}

export interface ChangeEventItem {
  id: string;
  event_type: string;
  entity_type: string;
  entity_id: string;
  summary: string;
  details?: Record<string, any>;
  created_at: string;
}

export interface PulseData {
  new_notices: NoticeItem[];
  today_events: EventItem[];
  upcoming_events: EventItem[];
  deadlines: OpportunityItem[];
  recent_projects: ProjectItem[];
  recent_changes: ChangeEventItem[];
  counts: Record<string, number>;
}

export interface SearchResultItem {
  id: string;
  type: string;
  title: string;
  description?: string;
  url: string;
  source_url?: string;
  source_type: SourceType;
  category?: string;
  date?: string;
  match_score: number;
  status?: string;
  badge?: string;
}

export interface SearchResponse {
  query: string;
  total: number;
  results: SearchResultItem[];
  grouped_counts: Record<string, number>;
}

export interface AISourceItem {
  title: string;
  url: string;
  source_type: SourceType;
  snippet?: string;
}

export interface AIChatResponse {
  answer: string;
  intent: string;
  sources: AISourceItem[];
  suggested_followups: string[];
}
