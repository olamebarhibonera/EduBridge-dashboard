/**
 * Seed Nairobi essential services into Supabase.
 * Run: node scripts/seed-nairobi-services.mjs
 * Requires DATABASE_URL in ../.env
 */
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import postgres from 'postgres';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, '..', '.env');
const env = readFileSync(envPath, 'utf8');
const dbUrl = env.match(/^DATABASE_URL=(.+)$/m)?.[1]?.trim();
if (!dbUrl) throw new Error('DATABASE_URL not found in .env');

/** @type {Array<{name:string,category:string,description:string,address:string,phone:string,email?:string,website?:string,latitude:number,longitude:number}>} */
const services = [
  // ── Study Resources (University + Education) ──
  { name: 'University of Nairobi Main Library', category: 'University', description: 'Central campus library with extensive academic collections, study halls, and digital resources for students.', address: 'Harry Thuku Road, University of Nairobi, Nairobi', phone: '+254 20 318262', website: 'https://uonbi.ac.ke', latitude: -1.2797, longitude: 36.8172 },
  { name: 'Strathmore University Library', category: 'University', description: 'Modern academic library with quiet study zones, group discussion rooms, and online journal access.', address: 'Ole Sangale Road, Madaraka, Nairobi', phone: '+254 703 034 000', website: 'https://strathmore.edu', latitude: -1.3109, longitude: 36.8122 },
  { name: 'USIU-Africa Library', category: 'University', description: 'International university library serving students with 24-hour study access during exam periods.', address: 'USIU Road, off Thika Road, Nairobi', phone: '+254 730 116 000', website: 'https://www.usiu.ac.ke', latitude: -1.2181, longitude: 36.8863 },
  { name: 'Kenyatta University Library', category: 'University', description: 'Large university library with research archives, computer lab, and postgraduate study facilities.', address: 'Kenyatta University, Kahawa Sukari, Nairobi', phone: '+254 20 8710901', website: 'https://www.ku.ac.ke', latitude: -1.1805, longitude: 36.9260 },
  { name: 'Technical University of Kenya Library', category: 'University', description: 'Engineering and technology-focused library with technical manuals and research databases.', address: 'Haile Selassie Avenue, Nairobi CBD', phone: '+254 20 2219929', website: 'https://www.tukenya.ac.ke', latitude: -1.2921, longitude: 36.8219 },
  { name: 'Daystar University Library', category: 'University', description: 'Campus library with theology, communications, and business resource collections.', address: 'Valley Road, Nairobi', phone: '+254 722 204 000', website: 'https://www.daystar.ac.ke', latitude: -1.3014, longitude: 36.8078 },
  { name: 'Catholic University of Eastern Africa Library', category: 'University', description: 'Academic library serving theology, education, and social science students.', address: 'Langata South Road, Karen, Nairobi', phone: '+254 709 691 000', website: 'https://cuea.edu', latitude: -1.3456, longitude: 36.7421 },
  { name: 'Mount Kenya University Nairobi Campus Library', category: 'University', description: 'Branch library with medical, law, and business program resources.', address: 'Thika Road, Nairobi', phone: '+254 20 2678661', website: 'https://www.mku.ac.ke', latitude: -1.2134, longitude: 36.8901 },
  { name: 'Zetech University Library', category: 'University', description: 'Technology and innovation-focused campus library with coding and IT resources.', address: 'Mang\'u Road, Nairobi', phone: '+254 711 049 000', website: 'https://zetech.ac.ke', latitude: -1.1987, longitude: 36.9123 },
  { name: 'Kenya National Library Service – Community Branch', category: 'Education', description: 'Public library offering free membership, study space, and Swahili and English book collections.', address: 'Community Branch, Haile Selassie Avenue, Nairobi', phone: '+254 20 2724702', website: 'https://www.knls.ac.ke', latitude: -1.2867, longitude: 36.8234 },
  { name: 'Text Book Centre – Sarit Centre', category: 'Education', description: 'Leading bookshop for textbooks, stationery, and academic supplies for university students.', address: 'Sarit Centre, Karuna Road, Westlands, Nairobi', phone: '+254 20 3749870', website: 'https://www.textbookcentre.com', latitude: -1.2603, longitude: 36.8018 },
  { name: 'Text Book Centre – The Hub Karen', category: 'Education', description: 'Textbooks, novels, and study materials with student discount programs.', address: 'The Hub Karen, Dagoretti Road, Nairobi', phone: '+254 20 3923000', website: 'https://www.textbookcentre.com', latitude: -1.3198, longitude: 36.7078 },
  { name: 'Prestige Bookshop', category: 'Education', description: 'Long-established Nairobi bookshop with academic, legal, and general interest titles.', address: 'Moi Avenue, Nairobi CBD', phone: '+254 20 2224203', latitude: -1.2834, longitude: 36.8231 },
  { name: 'University Way Bookshop', category: 'Education', description: 'Affordable second-hand and new textbooks near major university campuses.', address: 'University Way, Nairobi CBD', phone: '+254 722 345 678', latitude: -1.2801, longitude: 36.8198 },
  { name: 'Kenya National Archives & Documentation Service', category: 'Education', description: 'Historical archives and research library for academic and genealogical research.', address: 'Moi Avenue, Nairobi CBD', phone: '+254 20 2222414', latitude: -1.2839, longitude: 36.8212 },
  { name: 'iHub Nairobi', category: 'Education', description: 'Innovation hub and co-working space for tech students and startups with mentorship programs.', address: 'Senteu Plaza, Galana Road, Kilimani, Nairobi', phone: '+254 20 5231400', website: 'https://ihub.co.ke', latitude: -1.2923, longitude: 36.7876 },
  { name: 'Nairobi Java House – University Way', category: 'Education', description: 'Popular study café with reliable WiFi, power outlets, and quiet corners for students.', address: 'University Way, Nairobi CBD', phone: '+254 20 2228955', latitude: -1.2798, longitude: 36.8189 },
  { name: 'Alliance Française Library', category: 'Education', description: 'French language library and cultural centre with language learning resources.', address: 'Loita Street, Nairobi CBD', phone: '+254 20 340054', website: 'https://afnairobi.or.ke', latitude: -1.2876, longitude: 36.8201 },
  { name: 'Goethe-Institut Library Nairobi', category: 'Education', description: 'German cultural institute library with language courses and European literature.', address: 'Maendeleo House, Monrovia Street, Nairobi', phone: '+254 20 2224640', website: 'https://www.goethe.de/nairobi', latitude: -1.2856, longitude: 36.8223 },
  { name: 'British Council Library Nairobi', category: 'Education', description: 'English language learning centre and library with IELTS preparation resources.', address: 'Upper Hill Road, Nairobi', phone: '+254 20 2836000', website: 'https://www.britishcouncil.co.ke', latitude: -1.2987, longitude: 36.8123 },

  // ── Restaurants ──
  { name: 'Java House – Kimathi Street', category: 'Restaurant', description: 'Popular café and restaurant chain with breakfast, lunch, WiFi, and student-friendly prices.', address: 'Kimathi Street, Nairobi CBD', phone: '+254 20 2228955', website: 'https://javahouseafrica.com', latitude: -1.2845, longitude: 36.8234 },
  { name: 'Java House – Westlands', category: 'Restaurant', description: 'All-day dining café popular with international students and professionals in Westlands.', address: 'Ring Road, Westlands, Nairobi', phone: '+254 20 4447700', website: 'https://javahouseafrica.com', latitude: -1.2654, longitude: 36.8034 },
  { name: 'Artcaffe – Westlands', category: 'Restaurant', description: 'Upscale café-restaurant with pastries, international cuisine, and outdoor seating.', address: 'Ring Road, Westlands, Nairobi', phone: '+254 20 4447701', website: 'https://www.artcaffe.co.ke', latitude: -1.2645, longitude: 36.8045 },
  { name: 'Artcaffe – Junction Mall', category: 'Restaurant', description: 'Mall location with full menu, coffee bar, and comfortable seating for groups.', address: 'Junction Mall, Ngong Road, Nairobi', phone: '+254 20 3876543', website: 'https://www.artcaffe.co.ke', latitude: -1.3012, longitude: 36.7698 },
  { name: 'Mama Oliech Restaurant', category: 'Restaurant', description: 'Legendary Kenyan restaurant famous for authentic fish and ugali — a Nairobi institution.', address: 'Mandera Road, Hurlingham, Nairobi', phone: '+254 722 345 678', latitude: -1.2934, longitude: 36.7789 },
  { name: 'Carnivore Restaurant', category: 'Restaurant', description: 'World-famous game meat restaurant and tourist attraction in Langata.', address: 'Langata Road, Nairobi', phone: '+254 20 6005999', website: 'https://www.tamarind.co.ke/carnivore', latitude: -1.3345, longitude: 36.7623 },
  { name: 'Talisman Restaurant', category: 'Restaurant', description: 'Fine dining in Karen with garden setting, popular for special occasions.', address: 'Ngong Road, Karen, Nairobi', phone: '+254 722 801 414', website: 'https://www.talismanrestaurant.com', latitude: -1.3234, longitude: 36.7123 },
  { name: 'About Thyme Restaurant', category: 'Restaurant', description: 'Eclectic international cuisine in a charming Karen garden setting.', address: 'Elgeyo Marakwet Close, Karen, Nairobi', phone: '+254 722 523 089', latitude: -1.3198, longitude: 36.7089 },
  { name: 'Ha Habesha Ethiopian Restaurant', category: 'Restaurant', description: 'Authentic Ethiopian cuisine with injera platters, popular with African students.', address: 'Rhapta Road, Westlands, Nairobi', phone: '+254 722 456 789', latitude: -1.2612, longitude: 36.8012 },
  { name: 'Ankole Grill', category: 'Restaurant', description: 'Premium steakhouse and grill with African fusion dishes in Westlands.', address: 'Kijabe Street, Westlands, Nairobi', phone: '+254 709 123 456', latitude: -1.2634, longitude: 36.8056 },
  { name: 'Nyama Mama – Delta Towers', category: 'Restaurant', description: 'Modern African cuisine celebrating Kenyan flavours with rooftop views.', address: 'Delta Towers, Waiyaki Way, Westlands, Nairobi', phone: '+254 709 567 890', latitude: -1.2678, longitude: 36.8078 },
  { name: 'Mama Rocks Burger', category: 'Restaurant', description: 'Gourmet burgers with Kenyan-inspired toppings and craft milkshakes.', address: 'James Gichuru Road, Lavington, Nairobi', phone: '+254 722 789 012', latitude: -1.2789, longitude: 36.7654 },
  { name: 'Tin Roof Café', category: 'Restaurant', description: 'Relaxed café in Karen with brunch, salads, and outdoor garden seating.', address: 'Langata Road, Karen, Nairobi', phone: '+254 722 901 234', latitude: -1.3267, longitude: 36.7234 },
  { name: 'Big Square – Westlands', category: 'Restaurant', description: 'American-style burgers, ribs, and comfort food with generous portions.', address: 'Woodvale Grove, Westlands, Nairobi', phone: '+254 709 234 567', latitude: -1.2623, longitude: 36.8023 },
  { name: 'KFC – Tom Mboya Street', category: 'Restaurant', description: 'International fast food chain — fried chicken, burgers, and budget meals.', address: 'Tom Mboya Street, Nairobi CBD', phone: '+254 709 345 678', website: 'https://kfc.co.ke', latitude: -1.2856, longitude: 36.8245 },
  { name: 'Pizza Inn – Moi Avenue', category: 'Restaurant', description: 'Affordable pizza delivery and dine-in, popular with students on a budget.', address: 'Moi Avenue, Nairobi CBD', phone: '+254 709 456 789', latitude: -1.2834, longitude: 36.8223 },
  { name: 'Chicken Inn – Accra Road', category: 'Restaurant', description: 'Budget-friendly fried chicken and chips chain with multiple Nairobi locations.', address: 'Accra Road, Nairobi CBD', phone: '+254 709 567 890', latitude: -1.2845, longitude: 36.8256 },
  { name: 'Galitos – Lavington', category: 'Restaurant', description: 'Flame-grilled chicken restaurant with peri-peri flavours and student deals.', address: 'James Gichuru Road, Lavington, Nairobi', phone: '+254 709 678 901', latitude: -1.2798, longitude: 36.7678 },
  { name: 'Haandi Restaurant', category: 'Restaurant', description: 'Premier Indian restaurant serving North Indian cuisine since 1985.', address: 'The Mall, Westlands, Nairobi', phone: '+254 20 4447702', latitude: -1.2645, longitude: 36.8034 },
  { name: 'Chowpaty Restaurant', category: 'Restaurant', description: 'Vegetarian Indian restaurant popular with South Asian students.', address: 'Diamond Plaza, Parklands, Nairobi', phone: '+254 722 123 456', latitude: -1.2634, longitude: 36.8234 },
  { name: 'Fogo Gaucho – Village Market', category: 'Restaurant', description: 'Brazilian churrascaria with all-you-can-eat grilled meats.', address: 'Village Market, Gigiri, Nairobi', phone: '+254 709 789 012', latitude: -1.2298, longitude: 36.8045 },
  { name: 'Burger King – Two Rivers Mall', category: 'Restaurant', description: 'International burger chain at Two Rivers Mall with mall food court seating.', address: 'Two Rivers Mall, Limuru Road, Nairobi', phone: '+254 709 890 123', latitude: -1.2123, longitude: 36.8567 },
  { name: 'Subway – Garden City Mall', category: 'Restaurant', description: 'Customizable submarine sandwiches and salads, budget-friendly option.', address: 'Garden City Mall, Thika Road, Nairobi', phone: '+254 709 901 234', latitude: -1.2345, longitude: 36.8789 },
  { name: 'Dominos Pizza – Ngong Road', category: 'Restaurant', description: 'Pizza delivery and takeaway with online ordering and student promotions.', address: 'Ngong Road, Nairobi', phone: '+254 709 012 345', website: 'https://dominos.co.ke', latitude: -1.2987, longitude: 36.7789 },
  { name: 'Mama Njeri\'s Kitchen', category: 'Restaurant', description: 'Affordable local Kenyan food — githeri, chapati, and nyama choma near campus areas.', address: 'Ngong Road, Kilimani, Nairobi', phone: '+254 712 345 678', latitude: -1.2934, longitude: 36.7823 },
  { name: 'Cultiva Farm Kitchen', category: 'Restaurant', description: 'Farm-to-table restaurant with organic produce and healthy student-friendly meals.', address: 'Karen Road, Karen, Nairobi', phone: '+254 722 567 890', latitude: -1.3178, longitude: 36.7156 },

  // ── Transport ──
  { name: 'Nairobi Railway Station', category: 'Transport', description: 'Main railway terminus for commuter trains and SGR connections to Mombasa.', address: 'Haile Selassie Avenue, Nairobi CBD', phone: '+254 709 907 000', latitude: -1.2923, longitude: 36.8289 },
  { name: 'Syokimau SGR Terminus', category: 'Transport', description: 'Standard Gauge Railway station connecting Nairobi to Mombasa with daily departures.', address: 'Syokimau, Mombasa Road, Nairobi', phone: '+254 709 907 000', website: 'https://metrolink.co.ke', latitude: -1.3567, longitude: 36.9234 },
  { name: 'Machakos Country Bus Station', category: 'Transport', description: 'Main long-distance bus terminal for upcountry and cross-border travel.', address: 'Landhies Road, Nairobi CBD', phone: '+254 722 000 000', latitude: -1.2878, longitude: 36.8345 },
  { name: 'River Road Matatu Stage', category: 'Transport', description: 'Major matatu hub serving routes across Nairobi CBD and estates.', address: 'River Road, Nairobi CBD', phone: '+254 700 000 000', latitude: -1.2834, longitude: 36.8267 },
  { name: 'Kencom Bus Stage', category: 'Transport', description: 'Central matatu and bus stage at Kenyatta Avenue — gateway to all Nairobi routes.', address: 'Kenyatta Avenue, Nairobi CBD', phone: '+254 700 000 001', latitude: -1.2867, longitude: 36.8234 },
  { name: 'Ambassador Matatu Stage', category: 'Transport', description: 'Matatu stage serving Westlands, Parklands, and Ngong Road routes.', address: 'Moi Avenue, Nairobi CBD', phone: '+254 700 000 002', latitude: -1.2845, longitude: 36.8245 },
  { name: 'Nyamakima Matatu Stage', category: 'Transport', description: 'Budget matatu routes to Eastlands, Donholm, and Buruburu estates.', address: 'Nyamakima, Nairobi CBD', phone: '+254 700 000 003', latitude: -1.2856, longitude: 36.8312 },
  { name: 'KBS Bus Stop – Kencom', category: 'Transport', description: 'Kenya Bus Service stop for scheduled city routes across Nairobi.', address: 'Kenyatta Avenue, Nairobi CBD', phone: '+254 20 2210000', latitude: -1.2878, longitude: 36.8223 },
  { name: 'City Hoppa Bus Terminal', category: 'Transport', description: 'Modern bus service connecting Nairobi CBD to estates and suburbs.', address: 'Accra Road, Nairobi CBD', phone: '+254 722 345 000', latitude: -1.2845, longitude: 36.8267 },
  { name: 'Uber Greenlight Hub Nairobi', category: 'Transport', description: 'Uber driver support centre — also useful for students setting up ride-hailing accounts.', address: 'Ring Road, Westlands, Nairobi', phone: '+254 800 730 000', website: 'https://www.uber.com', latitude: -1.2654, longitude: 36.8045 },
  { name: 'Bolt Office Nairobi', category: 'Transport', description: 'Bolt ride-hailing support and driver registration centre in Kilimani.', address: 'Kindaruma Road, Kilimani, Nairobi', phone: '+254 800 720 000', website: 'https://bolt.eu', latitude: -1.2934, longitude: 36.7856 },
  { name: 'Little Cab Office', category: 'Transport', description: 'Local ride-hailing service with competitive fares for Nairobi routes.', address: 'Westlands, Nairobi', phone: '+254 709 123 000', website: 'https://little.bz', latitude: -1.2645, longitude: 36.8034 },
  { name: 'JKIA Terminal 1A – Arrivals', category: 'Transport', description: 'Jomo Kenyatta International Airport main arrivals hall for international students.', address: 'Embakasi, Nairobi', phone: '+254 20 822111', website: 'https://www.kaa.go.ke', latitude: -1.3192, longitude: 36.9278 },
  { name: 'JKIA Express Shuttle', category: 'Transport', description: 'Airport shuttle service connecting JKIA to Nairobi CBD and major hotels.', address: 'JKIA, Embakasi, Nairobi', phone: '+254 722 456 000', latitude: -1.3189, longitude: 36.9289 },
  { name: 'Wasafi SGR Shuttle – CBD', category: 'Transport', description: 'Shuttle bus from Nairobi CBD to Syokimau SGR station for Mombasa-bound trains.', address: 'Moi Avenue, Nairobi CBD', phone: '+254 709 907 001', latitude: -1.2834, longitude: 36.8234 },
  { name: 'Ngong Road Matatu Stage', category: 'Transport', description: 'Matatu routes to Karen, Ngong, and Rongai — popular with USIU and Daystar students.', address: 'Ngong Road, Nairobi', phone: '+254 700 000 004', latitude: -1.3012, longitude: 36.7789 },
  { name: 'Thika Road Matatu Stage', category: 'Transport', description: 'Routes along Thika Superhighway to Kasarani, Roysambu, and Juja.', address: 'Accra Road, Nairobi CBD', phone: '+254 700 000 005', latitude: -1.2845, longitude: 36.8278 },
  { name: 'Boda Boda Stage – University Way', category: 'Transport', description: 'Motorcycle taxi stage for quick short-distance trips around CBD and campus areas.', address: 'University Way, Nairobi CBD', phone: '+254 700 000 006', latitude: -1.2801, longitude: 36.8198 },

  // ── SIM Cards (Telecom) ──
  { name: 'Safaricom Shop – Sarit Centre', category: 'Telecom', description: 'Official Safaricom store for SIM cards, M-Pesa registration, and data bundles.', address: 'Sarit Centre, Westlands, Nairobi', phone: '+254 722 000 000', website: 'https://www.safaricom.co.ke', latitude: -1.2603, longitude: 36.8018 },
  { name: 'Safaricom Shop – Two Rivers Mall', category: 'Telecom', description: 'SIM registration, phone sales, and M-Pesa services at Two Rivers.', address: 'Two Rivers Mall, Limuru Road, Nairobi', phone: '+254 722 000 001', website: 'https://www.safaricom.co.ke', latitude: -1.2123, longitude: 36.8567 },
  { name: 'Safaricom Shop – I&M Building CBD', category: 'Telecom', description: 'Central CBD Safaricom shop for new SIM cards and M-Pesa account setup.', address: 'I&M Building, Kenyatta Avenue, Nairobi CBD', phone: '+254 722 000 002', website: 'https://www.safaricom.co.ke', latitude: -1.2867, longitude: 36.8212 },
  { name: 'Safaricom Customer Care – Waiyaki Way', category: 'Telecom', description: 'Main Safaricom customer service centre for account issues and SIM replacement.', address: 'Waiyaki Way, Westlands, Nairobi', phone: '+254 100', website: 'https://www.safaricom.co.ke', latitude: -1.2678, longitude: 36.8089 },
  { name: 'Safaricom Shop – The Hub Karen', category: 'Telecom', description: 'Safaricom retail outlet in Karen for SIM cards and internet packages.', address: 'The Hub Karen, Dagoretti Road, Nairobi', phone: '+254 722 000 003', website: 'https://www.safaricom.co.ke', latitude: -1.3198, longitude: 36.7078 },
  { name: 'Safaricom Shop – Garden City Mall', category: 'Telecom', description: 'SIM registration and data bundle purchases on Thika Road.', address: 'Garden City Mall, Thika Road, Nairobi', phone: '+254 722 000 004', website: 'https://www.safaricom.co.ke', latitude: -1.2345, longitude: 36.8789 },
  { name: 'Airtel Shop – Westlands', category: 'Telecom', description: 'Airtel SIM cards, data bundles, and Airtel Money registration.', address: 'Ring Road, Westlands, Nairobi', phone: '+254 730 100 000', website: 'https://www.airtel.co.ke', latitude: -1.2654, longitude: 36.8034 },
  { name: 'Airtel Shop – Nairobi CBD', category: 'Telecom', description: 'Central Airtel store for new connections and mobile money services.', address: 'Kenyatta Avenue, Nairobi CBD', phone: '+254 730 100 001', website: 'https://www.airtel.co.ke', latitude: -1.2867, longitude: 36.8234 },
  { name: 'Airtel Shop – Thika Road Mall', category: 'Telecom', description: 'Airtel retail at TRM for SIM cards and affordable data plans for students.', address: 'Thika Road Mall, Nairobi', phone: '+254 730 100 002', website: 'https://www.airtel.co.ke', latitude: -1.2178, longitude: 36.8901 },
  { name: 'Telkom Kenya – Haile Selassie Avenue', category: 'Telecom', description: 'Telkom SIM cards and affordable 4G data packages for budget-conscious students.', address: 'Haile Selassie Avenue, Nairobi CBD', phone: '+254 100', website: 'https://www.telkom.co.ke', latitude: -1.2923, longitude: 36.8234 },
  { name: 'Faiba JTL Shop – Moi Avenue', category: 'Telecom', description: 'Faiba 4G home and mobile internet — popular for unlimited data plans.', address: 'Moi Avenue, Nairobi CBD', phone: '+254 711 051 000', website: 'https://www.jtl.co.ke', latitude: -1.2834, longitude: 36.8223 },
  { name: 'Faiba JTL Shop – Westlands', category: 'Telecom', description: 'Faiba mobile and home fibre internet registration and support.', address: 'Westlands, Nairobi', phone: '+254 711 051 001', website: 'https://www.jtl.co.ke', latitude: -1.2645, longitude: 36.8034 },
  { name: 'Phone Place – Westlands', category: 'Telecom', description: 'Mobile phone retailer with SIM-compatible devices and accessories.', address: 'Woodvale Grove, Westlands, Nairobi', phone: '+254 722 567 000', latitude: -1.2623, longitude: 36.8023 },
  { name: 'M-Pesa Agent – Odeon Cinema', category: 'Telecom', description: 'M-Pesa cash deposit and withdrawal agent — essential for mobile payments in Kenya.', address: 'Tom Mboya Street, Nairobi CBD', phone: '+254 722 000 000', latitude: -1.2856, longitude: 36.8256 },
  { name: 'Airtel Money Agent – Kencom', category: 'Telecom', description: 'Airtel Money agent for cash transfers and bill payments.', address: 'Kenyatta Avenue, Nairobi CBD', phone: '+254 730 100 000', latitude: -1.2867, longitude: 36.8234 },

  // ── Immigration (Government + Embassy) ──
  { name: 'Department of Immigration – Nyayo House', category: 'Government', description: 'Main immigration office for visa extensions, work permits, and alien cards.', address: 'Nyayo House, Kenyatta Avenue, Nairobi CBD', phone: '+254 20 222 2022', website: 'https://www.immigration.go.ke', latitude: -1.2867, longitude: 36.8212 },
  { name: 'Nyayo House – Visa Section', category: 'Government', description: 'Student visa extensions and permit renewals — arrive early, bring all documents.', address: 'Nyayo House, 20th Floor, Kenyatta Avenue, Nairobi', phone: '+254 20 222 2022', latitude: -1.2867, longitude: 36.8212 },
  { name: 'Huduma Centre – Makadara', category: 'Government', description: 'One-stop government services — ID, passport, and immigration assistance.', address: 'Makadara, Nairobi', phone: '+254 709 480 000', website: 'https://www.hudumakenya.go.ke', latitude: -1.2934, longitude: 36.8456 },
  { name: 'Huduma Centre – City Square', category: 'Government', description: 'Central Huduma Centre for passport applications and government document services.', address: 'City Square, Nairobi CBD', phone: '+254 709 480 001', website: 'https://www.hudumakenya.go.ke', latitude: -1.2845, longitude: 36.8234 },
  { name: 'Kenya Revenue Authority – Times Tower', category: 'Government', description: 'KRA offices for PIN registration and tax compliance for working students.', address: 'Times Tower, Haile Selassie Avenue, Nairobi CBD', phone: '+254 20 281 0000', website: 'https://www.kra.go.ke', latitude: -1.2923, longitude: 36.8234 },
  { name: 'National Registration Bureau', category: 'Government', description: 'National ID registration and replacement for Kenyan citizens.', address: 'Haile Selassie Avenue, Nairobi CBD', phone: '+254 20 222 0000', latitude: -1.2912, longitude: 36.8245 },
  { name: 'Directorate of Criminal Investigations', category: 'Government', description: 'Police clearance certificates required for some visa and employment applications.', address: 'Kiambu Road, Nairobi', phone: '+254 20 272 4202', latitude: -1.2345, longitude: 36.8456 },
  { name: 'Ministry of Foreign Affairs – Consular Section', category: 'Government', description: 'Document authentication and consular services for international students.', address: 'Old Mutual Building, Upper Hill, Nairobi', phone: '+254 20 272 8200', latitude: -1.2987, longitude: 36.8123 },
  { name: 'Kenya Citizenship & Immigration Services', category: 'Government', description: 'Online and in-person immigration services portal support office.', address: 'Nyayo House, Kenyatta Avenue, Nairobi', phone: '+254 20 222 2022', website: 'https://www.ecitizen.go.ke', latitude: -1.2867, longitude: 36.8212 },
  { name: 'NSSF Building – Social Services', category: 'Government', description: 'National Social Security Fund — relevant for students with work permits.', address: 'NSSF Building, Colonnade Road, Nairobi', phone: '+254 20 272 9911', latitude: -1.3012, longitude: 36.8234 },
  { name: 'US Embassy Nairobi', category: 'Embassy', description: 'United States Embassy — visa services and American citizen assistance.', address: 'UN Avenue, Gigiri, Nairobi', phone: '+254 20 363 6000', website: 'https://ke.usembassy.gov', latitude: -1.2345, longitude: 36.8012 },
  { name: 'British High Commission Nairobi', category: 'Embassy', description: 'UK visa and consular services for British nationals and visa applicants.', address: 'Upper Hill Road, Nairobi', phone: '+254 20 287 3000', website: 'https://www.gov.uk/world/organisations/british-high-commission-nairobi', latitude: -1.2987, longitude: 36.8123 },
  { name: 'German Embassy Nairobi', category: 'Embassy', description: 'German visa and consular services for students planning to visit or study in Germany.', address: '113 Riverside Drive, Nairobi', phone: '+254 20 426 2000', website: 'https://nairobi.diplo.de', latitude: -1.2678, longitude: 36.7856 },
  { name: 'French Embassy Nairobi', category: 'Embassy', description: 'French visa services and cultural programmes for Francophone students.', address: 'Charles de Gaulle Avenue, Nairobi', phone: '+254 20 277 8000', website: 'https://ke.ambafrance.org', latitude: -1.2934, longitude: 36.8012 },
  { name: 'Chinese Embassy Nairobi', category: 'Embassy', description: 'Chinese visa and consular services — high volume, book appointments early.', address: 'Woodvale Grove, Westlands, Nairobi', phone: '+254 20 444 0000', website: 'http://ke.china-embassy.gov.cn', latitude: -1.2623, longitude: 36.8023 },
  { name: 'Indian High Commission Nairobi', category: 'Embassy', description: 'Indian visa and OCI services for Indian nationals and students.', address: 'Harambee Avenue, Nairobi CBD', phone: '+254 20 222 6644', website: 'https://www.hci.gov.in/nairobi', latitude: -1.2845, longitude: 36.8234 },
  { name: 'South African High Commission', category: 'Embassy', description: 'South African visa and consular services in Nairobi.', address: 'Lenana Road, Nairobi', phone: '+254 20 282 7100', latitude: -1.2934, longitude: 36.7856 },
  { name: 'Canadian High Commission Nairobi', category: 'Embassy', description: 'Canadian visa and immigration information centre.', address: 'Limuru Road, Nairobi', phone: '+254 20 366 3000', website: 'https://www.international.gc.ca/country-pays/kenya', latitude: -1.2456, longitude: 36.8234 },
  { name: 'Netherlands Embassy Nairobi', category: 'Embassy', description: 'Dutch consular and visa services for Netherlands-bound travellers.', address: 'Limuru Road, Nairobi', phone: '+254 20 444 0001', latitude: -1.2567, longitude: 36.8123 },
  { name: 'Swedish Embassy Nairobi', category: 'Embassy', description: 'Swedish visa and consular services covering Kenya and the region.', address: 'Limuru Road, Nairobi', phone: '+254 20 423 3000', latitude: -1.2678, longitude: 36.8012 },

  // ── Healthcare (Hospital) ──
  { name: 'The Nairobi Hospital', category: 'Hospital', description: 'Premier private hospital with 24-hour emergency, specialist clinics, and NHIF accepted.', address: 'Argwings Kodhek Road, Hurlingham, Nairobi', phone: '+254 20 284 5000', website: 'https://www.nairobihospital.org', latitude: -1.3012, longitude: 36.7878 },
  { name: 'Aga Khan University Hospital', category: 'Hospital', description: 'Leading teaching hospital with comprehensive medical services and student health plans.', address: 'Third Parklands Avenue, Nairobi', phone: '+254 20 366 2000', website: 'https://hospitals.aku.edu/nairobi', latitude: -1.2634, longitude: 36.8234 },
  { name: 'MP Shah Hospital', category: 'Hospital', description: 'Full-service private hospital with emergency care and specialist departments.', address: 'Shivachi Road, Parklands, Nairobi', phone: '+254 20 429 0000', website: 'https://www.mpshahhosp.org', latitude: -1.2645, longitude: 36.8345 },
  { name: 'Kenyatta National Hospital', category: 'Hospital', description: 'Kenya\'s largest referral hospital — emergency services and NHIF coverage.', address: 'Hospital Road, Upper Hill, Nairobi', phone: '+254 20 272 6300', website: 'https://knh.or.ke', latitude: -1.3012, longitude: 36.8012 },
  { name: 'Nairobi Women\'s Hospital – Hurlingham', category: 'Hospital', description: 'Specialist women\'s and general hospital with 24-hour emergency services.', address: 'Nairobi West, Nairobi', phone: '+254 20 272 2000', website: 'https://www.nairobihospital.org/nwh', latitude: -1.3089, longitude: 36.7789 },
  { name: 'Avenue Hospital – Parklands', category: 'Hospital', description: 'Private hospital with outpatient clinics, pharmacy, and affordable consultations.', address: 'First Avenue, Parklands, Nairobi', phone: '+254 20 374 0000', latitude: -1.2634, longitude: 36.8234 },
  { name: 'Mater Hospital – South B', category: 'Hospital', description: 'Catholic mission hospital with emergency services and maternity care.', address: 'South B, Nairobi', phone: '+254 20 690 3000', website: 'https://www.materkenya.co.ke', latitude: -1.3123, longitude: 36.8345 },
  { name: 'Gertrude\'s Children\'s Hospital – Muthaiga', category: 'Hospital', description: 'Specialist paediatric hospital — essential for students with children.', address: 'Muthaiga Road, Nairobi', phone: '+254 20 720 6000', website: 'https://www.gertudes.org', latitude: -1.2456, longitude: 36.8234 },
  { name: 'Nairobi West Hospital', category: 'Hospital', description: 'Private hospital serving Westlands and Langata areas with emergency care.', address: 'Gandhi Avenue, Nairobi West, Nairobi', phone: '+254 20 600 6000', latitude: -1.3089, longitude: 36.7678 },
  { name: 'Karen Hospital', category: 'Hospital', description: 'Modern private hospital in Karen with specialist clinics and surgery.', address: 'Karen Road, Karen, Nairobi', phone: '+254 20 661 3000', website: 'https://www.karenhospital.org', latitude: -1.3178, longitude: 36.7156 },
  { name: 'Coptic Hospital – Ngong Road', category: 'Hospital', description: 'Affordable private hospital popular with students for outpatient care.', address: 'Ngong Road, Nairobi', phone: '+254 20 272 9100', latitude: -1.2987, longitude: 36.7789 },
  { name: 'Nairobi South Hospital', category: 'Hospital', description: 'Community hospital serving South B, South C, and Industrial Area residents.', address: 'Mombasa Road, Nairobi', phone: '+254 20 600 5000', latitude: -1.3234, longitude: 36.8456 },
  { name: 'Nairobi Hospital Outpatient Centre – Hurlingham', category: 'Hospital', description: 'Outpatient clinic for non-emergency consultations and health screenings.', address: 'Hurlingham, Nairobi', phone: '+254 20 284 5001', latitude: -1.3012, longitude: 36.7789 },
  { name: 'Kenyatta University Teaching & Referral Hospital', category: 'Hospital', description: 'University teaching hospital serving Kahawa and Ruiru areas.', address: 'Kenyatta University, Kahawa, Nairobi', phone: '+254 20 8710902', latitude: -1.1805, longitude: 36.9260 },
  { name: 'Goodlife Pharmacy – Westlands', category: 'Hospital', description: '24-hour pharmacy with prescription and OTC medicines, health products.', address: 'Ring Road, Westlands, Nairobi', phone: '+254 709 123 456', latitude: -1.2654, longitude: 36.8034 },
  { name: 'Goodlife Pharmacy – Sarit Centre', category: 'Hospital', description: 'Pharmacy with prescription services and health consultations.', address: 'Sarit Centre, Westlands, Nairobi', phone: '+254 709 123 457', latitude: -1.2603, longitude: 36.8018 },
  { name: 'HealthPlus Pharmacy – Two Rivers', category: 'Hospital', description: 'Pharmacy chain with affordable generic medicines for students.', address: 'Two Rivers Mall, Nairobi', phone: '+254 709 234 567', latitude: -1.2123, longitude: 36.8567 },
  { name: 'Yaya Chemists', category: 'Hospital', description: 'Well-stocked pharmacy at Yaya Centre with late-night hours.', address: 'Yaya Centre, Argwings Kodhek Road, Nairobi', phone: '+254 709 345 678', latitude: -1.2934, longitude: 36.7789 },
  { name: 'Nairobi ENT Clinic', category: 'Hospital', description: 'Specialist ear, nose, and throat clinic for international students.', address: 'Kenyatta National Hospital Grounds, Nairobi', phone: '+254 722 456 789', latitude: -1.3012, longitude: 36.8012 },
  { name: 'AAR Healthcare – Westlands', category: 'Hospital', description: 'Outpatient healthcare clinic with GP consultations and lab services.', address: 'Westlands, Nairobi', phone: '+254 709 456 789', website: 'https://www.aarhealthcare.com', latitude: -1.2645, longitude: 36.8034 },
  { name: 'International Medical Centre – Gigiri', category: 'Hospital', description: 'Expat-focused clinic with English-speaking doctors and international insurance accepted.', address: 'UN Avenue, Gigiri, Nairobi', phone: '+254 709 567 890', latitude: -1.2345, longitude: 36.8012 },
  { name: 'Nairobi Hospital Cancer Centre', category: 'Hospital', description: 'Specialist oncology centre affiliated with The Nairobi Hospital.', address: 'Argwings Kodhek Road, Nairobi', phone: '+254 20 284 5100', latitude: -1.3012, longitude: 36.7878 },
  { name: 'St. Mary\'s Mission Hospital – Langata', category: 'Hospital', description: 'Affordable mission hospital serving Langata and Karen communities.', address: 'Langata Road, Nairobi', phone: '+254 20 600 7000', latitude: -1.3234, longitude: 36.7623 },
  { name: 'Nairobi City County Health Centre – Eastleigh', category: 'Hospital', description: 'Public health centre with affordable consultations and vaccinations.', address: 'Eastleigh, Nairobi', phone: '+254 20 676 0000', latitude: -1.2789, longitude: 36.8456 },

  // ── Bonus: Banks & Shopping (for richer demo) ──
  { name: 'Equity Bank – Kenyatta Avenue', category: 'Bank', description: 'Student-friendly bank account opening with mobile banking app.', address: 'Kenyatta Avenue, Nairobi CBD', phone: '+254 763 000 000', website: 'https://equitybank.co.ke', latitude: -1.2867, longitude: 36.8234 },
  { name: 'KCB Bank – Moi Avenue', category: 'Bank', description: 'Kenya Commercial Bank — largest bank with campus branch services.', address: 'Moi Avenue, Nairobi CBD', phone: '+254 711 087 000', website: 'https://kcbgroup.com', latitude: -1.2834, longitude: 36.8223 },
  { name: 'Co-operative Bank – Haile Selassie', category: 'Bank', description: 'Popular bank for M-Pesa integration and student savings accounts.', address: 'Haile Selassie Avenue, Nairobi CBD', phone: '+254 20 327 0000', website: 'https://www.co-opbank.co.ke', latitude: -1.2923, longitude: 36.8234 },
  { name: 'Standard Chartered – Westlands', category: 'Bank', description: 'International bank with multi-currency accounts for foreign students.', address: 'Westlands, Nairobi', phone: '+254 20 329 3900', website: 'https://www.sc.com/ke', latitude: -1.2645, longitude: 36.8034 },
  { name: 'Absa Bank Kenya – Upper Hill', category: 'Bank', description: 'Full-service bank with student loan and bursary information.', address: 'Upper Hill, Nairobi', phone: '+254 732 130 000', website: 'https://www.absa.co.ke', latitude: -1.2987, longitude: 36.8123 },
  { name: 'Carrefour – The Hub Karen', category: 'Shopping', description: 'Hypermarket for groceries, household items, and affordable daily essentials.', address: 'The Hub Karen, Nairobi', phone: '+254 709 935 000', latitude: -1.3198, longitude: 36.7078 },
  { name: 'Carrefour – Two Rivers Mall', category: 'Shopping', description: 'Large supermarket with international food products for foreign students.', address: 'Two Rivers Mall, Nairobi', phone: '+254 709 935 001', latitude: -1.2123, longitude: 36.8567 },
  { name: 'Naivas Supermarket – Westlands', category: 'Shopping', description: 'Local supermarket chain with competitive prices on groceries and toiletries.', address: 'Ring Road, Westlands, Nairobi', phone: '+254 709 012 345', latitude: -1.2654, longitude: 36.8034 },
  { name: 'Quickmart – Kilimani', category: 'Shopping', description: 'Neighbourhood supermarket popular with Kilimani and Kileleshwa residents.', address: 'Kilimani, Nairobi', phone: '+254 709 123 456', latitude: -1.2934, longitude: 36.7856 },
  { name: 'Eastleigh Market', category: 'Shopping', description: 'Vibrant market for affordable clothing, fabrics, and household goods.', address: 'Eastleigh, Nairobi', phone: '+254 700 000 000', latitude: -1.2789, longitude: 36.8456 },
  { name: 'City Market – Nairobi CBD', category: 'Shopping', description: 'Historic market for fresh produce, flowers, and local crafts.', address: 'City Market, Nairobi CBD', phone: '+254 722 000 000', latitude: -1.2845, longitude: 36.8234 },
  { name: 'Maasai Market – Yaya Centre', category: 'Shopping', description: 'Open-air craft market — ideal for souvenirs and gifts (Tuesdays).', address: 'Yaya Centre, Nairobi', phone: '+254 722 111 111', latitude: -1.2934, longitude: 36.7789 },
  { name: 'Gikomba Market', category: 'Shopping', description: 'Kenya\'s largest second-hand clothing market — budget shopping for students.', address: 'Gikomba, Nairobi', phone: '+254 700 000 000', latitude: -1.2789, longitude: 36.8345 },
  { name: 'Two Rivers Mall', category: 'Shopping', description: 'Major shopping mall with retail, dining, cinema, and entertainment.', address: 'Limuru Road, Nairobi', phone: '+254 709 567 890', website: 'https://tworivers.co.ke', latitude: -1.2123, longitude: 36.8567 },
  { name: 'The Junction Mall', category: 'Shopping', description: 'Popular mall on Ngong Road with shops, food court, and cinema.', address: 'Ngong Road, Nairobi', phone: '+254 709 678 901', latitude: -1.3012, longitude: 36.7698 },
];

const sql = postgres(dbUrl, { ssl: 'require', max: 1 });

console.log(`Seeding ${services.length} Nairobi services...`);

await sql`DELETE FROM services`;

for (const s of services) {
  await sql`
    INSERT INTO services (name, category, description, address, phone, email, website, latitude, longitude, is_active)
    VALUES (
      ${s.name},
      ${s.category},
      ${s.description},
      ${s.address},
      ${s.phone},
      ${s.email ?? null},
      ${s.website ?? null},
      ${s.latitude},
      ${s.longitude},
      true
    )
  `;
}

const counts = await sql`
  SELECT category, COUNT(*)::int AS count
  FROM services
  GROUP BY category
  ORDER BY count DESC
`;

console.log('\nSeeded successfully!\n');
console.table(counts);
console.log(`\nTotal: ${services.length} services`);

await sql.end();
