import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  decimal,
  doublePrecision,
  jsonb,
  index,
} from "drizzle-orm/pg-core";

export const profiles = pgTable(
  "profiles",
  {
    id: uuid("id").primaryKey(),
    fullName: text("full_name"),
    email: text("email").unique(),
    university: text("university"),
    course: text("course"),
    phone: text("phone"),
    avatarUrl: text("avatar_url"),
    role: text("role").default("student"),
    status: text("status").default("active"),
    preferredLanguage: text("preferred_language").default("en"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (t) => [index("idx_profiles_role").on(t.role), index("idx_profiles_status").on(t.status)]
);

export const translations = pgTable(
  "translations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    sourceLanguage: text("source_language").notNull().default("en"),
    targetLanguage: text("target_language").notNull().default("sw"),
    sourceText: text("source_text").notNull(),
    translatedText: text("translated_text").notNull(),
    category: text("category").default("general"),
    isVerified: boolean("is_verified").default(false),
    createdBy: uuid("created_by").references(() => profiles.id),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (t) => [
    index("idx_translations_languages").on(t.sourceLanguage, t.targetLanguage),
    index("idx_translations_category").on(t.category),
  ]
);

export const services = pgTable(
  "services",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    category: text("category").notNull(),
    description: text("description"),
    address: text("address"),
    phone: text("phone"),
    email: text("email"),
    website: text("website"),
    latitude: doublePrecision("latitude"),
    longitude: doublePrecision("longitude"),
    isActive: boolean("is_active").default(true),
    createdBy: uuid("created_by").references(() => profiles.id),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (t) => [
    index("idx_services_category").on(t.category),
    index("idx_services_active").on(t.isActive),
  ]
);

export const transactions = pgTable(
  "transactions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .references(() => profiles.id, { onDelete: "cascade" })
      .notNull(),
    amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
    type: text("type").notNull(),
    category: text("category").notNull(),
    description: text("description"),
    date: timestamp("date", { withTimezone: true }).defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (t) => [
    index("idx_transactions_user").on(t.userId),
    index("idx_transactions_date").on(t.date),
  ]
);

export const announcements = pgTable(
  "announcements",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    content: text("content").notNull(),
    priority: text("priority").default("normal"),
    targetAudience: text("target_audience").default("all"),
    isActive: boolean("is_active").default(true),
    createdBy: uuid("created_by").references(() => profiles.id),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
  },
  (t) => [index("idx_announcements_active").on(t.isActive, t.expiresAt)]
);

export const appSettings = pgTable("app_settings", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull().default({}),
  description: text("description"),
  updatedBy: uuid("updated_by").references(() => profiles.id),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const activityLog = pgTable(
  "activity_log",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => profiles.id),
    action: text("action").notNull(),
    entityType: text("entity_type"),
    entityId: text("entity_id"),
    metadata: jsonb("metadata").default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (t) => [
    index("idx_activity_log_user").on(t.userId),
    index("idx_activity_log_created").on(t.createdAt),
  ]
);

export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
export type Translation = typeof translations.$inferSelect;
export type NewTranslation = typeof translations.$inferInsert;
export type Service = typeof services.$inferSelect;
export type NewService = typeof services.$inferInsert;
export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;
export type Announcement = typeof announcements.$inferSelect;
export type NewAnnouncement = typeof announcements.$inferInsert;
export type AppSetting = typeof appSettings.$inferSelect;
export type ActivityLogEntry = typeof activityLog.$inferSelect;
