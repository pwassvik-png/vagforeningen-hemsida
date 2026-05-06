// === Roller ===
export enum Role {
  ADMIN = "admin",
  STYRELSE = "styrelse",
  MEDLEM = "medlem",
}

// === Användare / Medlem ===
export interface Member {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: Role;
  property_designation: string; // Fastighetsbeteckning
  address?: string;
  postal_code?: string;
  city?: string;
  share_value: number; // Andelstal
  has_paid_fee: boolean;
  created_at: string;
}

// === Nyheter ===
export interface Post {
  id: string;
  title: string;
  content: string;
  is_urgent: boolean;
  is_public: boolean; // Visa för icke-inloggade
  author_id: string;
  author_name: string;
  created_at: string;
  updated_at?: string;
}

// === Problemrapport ===
export enum IssueCategory {
  ROAD_DAMAGE = "Hål i vägen",
  VEGETATION = "Träd/Vegetation",
  SNOW_PLOWING = "Snöröjning",
  LIGHTING = "Belysning",
  DRAINAGE = "Dikning/Avrinning",
  OTHER = "Övrigt",
}

export enum IssueStatus {
  RECEIVED = "Mottagen",
  IN_PROGRESS = "Pågående",
  RESOLVED = "Åtgärdad",
}

export interface Issue {
  id: string;
  user_id: string;
  user_name: string;
  category: IssueCategory;
  description: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  photo_url?: string;
  status: IssueStatus;
  created_at: string;
  updated_at?: string;
}

// === Dokument ===
export type DocumentType =
  | "protocol"
  | "financial"
  | "bylaws"
  | "budget"
  | "agenda"
  | "minutes"
  | "other";

export interface Document {
  id: string;
  title: string;
  category: DocumentType;
  file_url: string;
  file_size?: number;
  is_public: boolean; // Synlig för alla medlemmar
  uploaded_by: string;
  created_at: string;
}

// === Möten / Årsmöte ===
export type MeetingType = "annual" | "extra" | "board";
export type MeetingStatus = "planning" | "notice_sent" | "completed" | "archived";

export interface Meeting {
  id: string;
  title: string;
  date: string;
  time?: string;
  location: string;
  type: MeetingType;
  status: MeetingStatus;
  agenda?: AgendaItem[];
  fee_per_share?: number;
  notice_sent_at?: string;
  notice_method?: "post" | "email" | "both";
  attendance_personal?: number;
  attendance_proxy?: number;
  created_at: string;
}

export interface AgendaItem {
  id: string;
  number: number;
  title: string;
  description?: string;
  proposal?: string;
  presenter?: string;
  decision?: string;
}

// === Underhåll ===
export type MaintenanceStatus = "planned" | "in_progress" | "completed" | "deferred";

export interface MaintenanceItem {
  id: string;
  title: string;
  description: string;
  year: number;
  estimated_cost: number;
  status: MaintenanceStatus;
  contractor_id?: string;
  created_at: string;
}

// === Entreprenör ===
export interface Contractor {
  id: string;
  company_name: string;
  contact_person: string;
  email: string;
  phone: string;
  specialties: string;
  notes?: string;
}

// === Avgifter ===
export interface FeeSettings {
  year: number;
  unit_cost: number; // Kr per andel
}

// === Karta ===
export interface MapConfig {
  center: [number, number];
  zoom: number;
  road_path?: [number, number][];
  markers?: MapMarker[];
}

export interface MapMarker {
  lat: number;
  lng: number;
  title?: string;
}

// === E-postnotiser ===
export interface NotificationPreference {
  id: string;
  user_id: string;
  news_updates: boolean;
  issue_updates: boolean;
  meeting_notices: boolean;
  maintenance_updates: boolean;
  fee_reminders: boolean;
}