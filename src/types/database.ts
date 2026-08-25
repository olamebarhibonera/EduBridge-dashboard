export type ProfileRow = {
  id: string;
  full_name: string | null;
  email: string | null;
  university: string | null;
  course: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: string | null;
  status: string | null;
  preferred_language: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type TranslationRow = {
  id: string;
  source_language: string;
  target_language: string;
  source_text: string;
  translated_text: string;
  category: string | null;
  is_verified: boolean | null;
  created_by: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type ServiceRow = {
  id: string;
  name: string;
  category: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  latitude: number | null;
  longitude: number | null;
  is_active: boolean | null;
  created_by: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type TransactionRow = {
  id: string;
  user_id: string;
  amount: string | number;
  type: "income" | "expense" | string;
  category: string;
  description: string | null;
  date: string | null;
  created_at: string | null;
};

export type AnnouncementRow = {
  id: string;
  title: string;
  content: string;
  priority: string | null;
  target_audience: string | null;
  is_active: boolean | null;
  created_by: string | null;
  created_at: string | null;
  expires_at: string | null;
};

export type AppSettingRow = {
  key: string;
  value: unknown;
  description: string | null;
  updated_by: string | null;
  updated_at: string | null;
};

export type ActivityLogRow = {
  id: string;
  user_id: string | null;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string | null;
};
