import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { announcements, services, translations } from "./schema";

config({ path: resolve(process.cwd(), ".env") });

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL is missing. Copy .env.example to .env.");
}

const poolerUrl = url.includes("?") ? `${url}&pgbouncer=true` : `${url}?pgbouncer=true`;
const client = postgres(poolerUrl, { prepare: false, max: 1 });
const db = drizzle(client);

const SERVICE_ROWS = [
  {
    name: "University of Nairobi",
    category: "University",
    address: "University Way, Nairobi",
    phone: "+254 20 491 8000",
    description: "Kenya's largest and oldest university. Hours: 8:00 AM - 5:00 PM",
  },
  {
    name: "Kenyatta University",
    category: "University",
    address: "Thika Road, Kahawa",
    phone: "+254 20 870 0901",
    description: "Major public university in Nairobi. Hours: 8:00 AM - 5:00 PM",
  },
  {
    name: "Strathmore University",
    category: "University",
    address: "Madaraka Estate, Ole Sangale Rd",
    phone: "+254 703 034 000",
    description: "Private chartered university. Hours: 8:00 AM - 5:00 PM",
  },
  {
    name: "USIU-Africa",
    category: "University",
    address: "Thika Road, Kasarani",
    phone: "+254 730 116 000",
    description: "United States International University. Hours: 8:00 AM - 5:00 PM",
  },
  {
    name: "Nairobi Hospital",
    category: "Hospital",
    address: "Argwings Kodhek Road",
    phone: "+254 20 284 5000",
    description: "Full service hospital with emergency care. Hours: 24/7",
  },
  {
    name: "Kenyatta National Hospital",
    category: "Hospital",
    address: "Hospital Road, Upper Hill",
    phone: "+254 20 272 6300",
    description: "Kenya's largest public referral hospital. Hours: 24/7",
  },
  {
    name: "Aga Khan University Hospital",
    category: "Hospital",
    address: "3rd Parklands Avenue",
    phone: "+254 20 366 2000",
    description: "Private hospital with specialist care. Hours: 24/7",
  },
  {
    name: "US Embassy",
    category: "Embassy",
    address: "United Nations Avenue, Gigiri",
    phone: "+254 20 363 6000",
    description: "Embassy of the United States. Hours: 8:00 AM - 4:30 PM",
  },
  {
    name: "French Embassy",
    category: "Embassy",
    address: "Peponi Road, Westlands",
    phone: "+254 20 277 8000",
    description: "Embassy of France in Kenya. Hours: 8:30 AM - 12:30 PM",
  },
  {
    name: "Chinese Embassy",
    category: "Embassy",
    address: "Woodlands Road, Kilimani",
    phone: "+254 20 272 6851",
    description: "Embassy of the People's Republic of China. Hours: 8:30 AM - 12:00 PM",
  },
  {
    name: "Equity Bank",
    category: "Bank",
    address: "Multiple locations, Nairobi",
    phone: "+254 763 000 000",
    description: "Major Kenyan bank with student accounts. Hours: 9:00 AM - 4:00 PM",
  },
  {
    name: "KCB Bank",
    category: "Bank",
    address: "Multiple locations, Nairobi",
    phone: "+254 711 087 000",
    description: "Kenya Commercial Bank. Hours: 9:00 AM - 4:00 PM",
  },
  {
    name: "JKIA Airport",
    category: "Transport",
    address: "Jomo Kenyatta International Airport",
    phone: "+254 20 661 1000",
    description: "Nairobi's main international airport. Hours: 24/7",
  },
  {
    name: "Immigration Department",
    category: "Government",
    address: "Nyayo House, Kenyatta Ave",
    phone: "+254 20 222 2022",
    description: "Visa extensions, permits, passes. Hours: 8:00 AM - 5:00 PM",
  },
  {
    name: "Safaricom Shop",
    category: "Telecom",
    address: "Westlands, Nairobi",
    phone: "+254 722 000 000",
    description: "SIM cards, M-Pesa, data bundles. Hours: 8:00 AM - 6:00 PM",
  },
];

const PHRASE_ROWS = [
  { sourceText: "Hello", translatedText: "Habari", category: "greeting" },
  { sourceText: "How are you?", translatedText: "Habari yako?", category: "greeting" },
  { sourceText: "Thank you", translatedText: "Asante", category: "greeting" },
  { sourceText: "Please", translatedText: "Tafadhali", category: "greeting" },
  { sourceText: "How much does this cost?", translatedText: "Hii inagharimu kiasi gani?", category: "food" },
  { sourceText: "Where is the hospital?", translatedText: "Hospitali iko wapi?", category: "health" },
  { sourceText: "I need help", translatedText: "Nahitaji msaada", category: "emergency" },
  { sourceText: "Call the police", translatedText: "Piga simu polisi", category: "emergency" },
  { sourceText: "Where is the matatu stage?", translatedText: "Kituo cha matatu kiko wapi?", category: "transport" },
  { sourceText: "I am a student", translatedText: "Mimi ni mwanafunzi", category: "academic" },
  { sourceText: "Where can I rent a room?", translatedText: "Naweza kukodisha chumba wapi?", category: "housing" },
  { sourceText: "Do you speak English?", translatedText: "Unazungumza Kiingereza?", category: "general" },
];

const ANNOUNCEMENT_ROWS = [
  {
    title: "Karibu to EduBridge",
    content:
      "Welcome to Kenya. Use Translate for Swahili phrases, Budget to track KES, and Services for hospitals, banks, and immigration.",
    priority: "high",
    targetAudience: "all",
  },
  {
    title: "Emergency numbers",
    content: "Police, ambulance, and fire: 999. Save this number and keep a copy of your passport.",
    priority: "urgent",
    targetAudience: "all",
  },
];

async function applyTrigger() {
  const here = dirname(fileURLToPath(import.meta.url));
  const sqlPath = resolve(here, "../../supabase/migrations/002_profile_signup_metadata.sql");
  const sql = readFileSync(sqlPath, "utf8");
  await client.unsafe(sql);
}

async function seed() {
  await applyTrigger();

  const existingServices = await db.select({ name: services.name }).from(services);
  const knownServices = new Set(existingServices.map((row) => row.name.toLowerCase()));
  const newServices = SERVICE_ROWS.filter((row) => !knownServices.has(row.name.toLowerCase()));
  if (newServices.length > 0) {
    await db.insert(services).values(newServices.map((row) => ({ ...row, isActive: true })));
  }

  const existingPhrases = await db
    .select({ sourceText: translations.sourceText })
    .from(translations);
  const knownPhrases = new Set(existingPhrases.map((row) => row.sourceText.toLowerCase()));
  const newPhrases = PHRASE_ROWS.filter((row) => !knownPhrases.has(row.sourceText.toLowerCase()));
  if (newPhrases.length > 0) {
    await db.insert(translations).values(
      newPhrases.map((row) => ({
        ...row,
        sourceLanguage: "en",
        targetLanguage: "sw",
        isVerified: true,
      }))
    );
  }

  const existingAnnouncements = await db
    .select({ title: announcements.title })
    .from(announcements);
  const knownTitles = new Set(existingAnnouncements.map((row) => row.title.toLowerCase()));
  const newAnnouncements = ANNOUNCEMENT_ROWS.filter(
    (row) => !knownTitles.has(row.title.toLowerCase())
  );
  if (newAnnouncements.length > 0) {
    await db.insert(announcements).values(
      newAnnouncements.map((row) => ({ ...row, isActive: true }))
    );
  }

  console.log(
    `Seed complete. Services +${newServices.length}, phrases +${newPhrases.length}, announcements +${newAnnouncements.length}.`
  );
}

seed()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await client.end();
  });
