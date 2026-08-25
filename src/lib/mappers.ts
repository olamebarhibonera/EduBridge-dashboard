import type {
  Profile,
  Translation,
  Service,
  Announcement,
} from "@/db/schema";

/** Supabase PostgREST returns snake_case column names; Drizzle types use camelCase. */

export function mapProfile(row: Record<string, unknown> | null): Profile | null {
  if (!row) return null;
  return {
    id: row.id as string,
    fullName: (row.full_name ?? row.fullName ?? null) as string | null,
    email: (row.email ?? null) as string | null,
    university: (row.university ?? null) as string | null,
    course: (row.course ?? null) as string | null,
    phone: (row.phone ?? null) as string | null,
    avatarUrl: (row.avatar_url ?? row.avatarUrl ?? null) as string | null,
    role: (row.role ?? "student") as string | null,
    status: (row.status ?? "active") as string | null,
    preferredLanguage: (row.preferred_language ??
      row.preferredLanguage ??
      "en") as string | null,
    createdAt: (row.created_at ?? row.createdAt ?? null) as Date | null,
    updatedAt: (row.updated_at ?? row.updatedAt ?? null) as Date | null,
  };
}

export function mapProfiles(
  rows: Record<string, unknown>[] | null
): Profile[] {
  return (rows ?? []).map((r) => mapProfile(r)!);
}

export function mapTranslation(
  row: Record<string, unknown>
): Translation {
  return {
    id: row.id as string,
    sourceLanguage: (row.source_language ??
      row.sourceLanguage ??
      "en") as string,
    targetLanguage: (row.target_language ??
      row.targetLanguage ??
      "sw") as string,
    sourceText: (row.source_text ?? row.sourceText ?? "") as string,
    translatedText: (row.translated_text ??
      row.translatedText ??
      "") as string,
    category: (row.category ?? "general") as string | null,
    isVerified: Boolean(row.is_verified ?? row.isVerified ?? false),
    createdBy: (row.created_by ?? row.createdBy ?? null) as string | null,
    createdAt: (row.created_at ?? row.createdAt ?? null) as Date | null,
    updatedAt: (row.updated_at ?? row.updatedAt ?? null) as Date | null,
  };
}

export function mapTranslations(
  rows: Record<string, unknown>[] | null
): Translation[] {
  return (rows ?? []).map(mapTranslation);
}

export function mapService(row: Record<string, unknown>): Service {
  return {
    id: row.id as string,
    name: (row.name ?? "") as string,
    category: (row.category ?? "") as string,
    description: (row.description ?? null) as string | null,
    address: (row.address ?? null) as string | null,
    phone: (row.phone ?? null) as string | null,
    email: (row.email ?? null) as string | null,
    website: (row.website ?? null) as string | null,
    latitude: (row.latitude ?? null) as number | null,
    longitude: (row.longitude ?? null) as number | null,
    isActive: Boolean(row.is_active ?? row.isActive ?? true),
    createdBy: (row.created_by ?? row.createdBy ?? null) as string | null,
    createdAt: (row.created_at ?? row.createdAt ?? null) as Date | null,
    updatedAt: (row.updated_at ?? row.updatedAt ?? null) as Date | null,
  };
}

export function mapServices(
  rows: Record<string, unknown>[] | null
): Service[] {
  return (rows ?? []).map(mapService);
}

export function mapAnnouncement(
  row: Record<string, unknown>
): Announcement {
  return {
    id: row.id as string,
    title: (row.title ?? "") as string,
    content: (row.content ?? "") as string,
    priority: (row.priority ?? "normal") as string | null,
    targetAudience: (row.target_audience ??
      row.targetAudience ??
      "all") as string | null,
    isActive: Boolean(row.is_active ?? row.isActive ?? true),
    createdBy: (row.created_by ?? row.createdBy ?? null) as string | null,
    createdAt: (row.created_at ?? row.createdAt ?? null) as Date | null,
    expiresAt: (row.expires_at ?? row.expiresAt ?? null) as Date | null,
  };
}

export function mapAnnouncements(
  rows: Record<string, unknown>[] | null
): Announcement[] {
  return (rows ?? []).map(mapAnnouncement);
}
