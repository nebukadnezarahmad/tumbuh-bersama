export type StageId =
  | "prakonsepsi"
  | "hamil"
  | "nifas"
  | "bayi"
  | "mpasi"
  | "balita";

export type TaskStatus = "rencana" | "selesai" | "tertunda" | "bantuan";

export type Owner = "Saya" | "Pengasuh";

export interface Profile {
  motherName: string;
  childName: string;
  stage: StageId;
  childBirthDate: string;
  dueDate: string;
  startedAt: string;
}

export interface Task {
  id: string;
  title: string;
  reason: string;
  ruleId: string;
  ruleVersion: string;
  source: string;
  owner: Owner;
  due: string;
  status: TaskStatus;
  createdAt: string;
}

export interface Measurement {
  id: string;
  date: string;
  weightKg: number;
  heightCm: number;
  position: "telentang" | "berdiri";
  source: string;
  confirmed: boolean;
  createdAt: string;
}

export interface Consents {
  shareMaternal: boolean;
  shareChild: boolean;
  shareTasks: boolean;
  analytics: boolean;
}

export interface Notifications {
  weekly: boolean;
  visits: boolean;
  growth: boolean;
  lockScreenDetail: boolean;
}

export interface Caregiver {
  id: string;
  name: string;
  email: string;
  invitedAt: string;
  expiresAt: string;
  status: "menunggu" | "aktif";
}

export interface MenuState {
  recipeId: string | null;
  substitutions: Record<string, string>;
  pantry: string[];
  minutes: number;
  budget: number;
  allergies: string[];
}

export interface AppState {
  version: 1;
  profile: Profile | null;
  tasks: Task[];
  measurements: Measurement[];
  consents: Consents;
  notifications: Notifications;
  caregivers: Caregiver[];
  menu: MenuState;
  shoppingDone: string[];
  demo: boolean;
}

export type Screen =
  | "hari-ini"
  | "rencana"
  | "catatan"
  | "panduan"
  | "keluarga";

export interface Ingredient {
  name: string;
  amount: string;
  cost: number;
  allergens?: string[];
  alt?: {
    name: string;
    amount: string;
    cost: number;
    allergens?: string[];
  };
}

export interface Recipe {
  id: string;
  name: string;
  stage: string;
  ageMin: number;
  ageMax: number;
  texture: string;
  minutes: number;
  servings: number;
  ingredients: Ingredient[];
  steps: string[];
  note: string;
}

export interface GuideItem {
  id: string;
  stages: StageId[];
  category: "Gizi" | "Pertumbuhan" | "Layanan" | "Pengasuhan" | "Privasi";
  title: string;
  summary: string;
  takeaway: string;
  source: string;
}

export interface SourceItem {
  id: string;
  org: string;
  title: string;
  note: string;
  href?: string;
}
