import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, useInView, useScroll, useTransform } from "motion/react";
import {
  GraduationCap,
  Languages,
  Wallet,
  MapPin,
  Shield,
  ArrowRight,
  Globe,
  Smartphone,
  Github,
  Mail,
  ChevronDown,
  Sparkles,
  Star,
  Download,
  CheckCircle,
  Heart,
  Zap,
  BookOpen,
  Moon,
  Sun,
  Linkedin,
} from "lucide-react";

function AnimatedSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const features = [
  {
    icon: Languages,
    title: "28+ Languages",
    description:
      "Translate between English, Swahili, French, Arabic, Chinese, Kinyarwanda, and 22+ more languages instantly.",
    gradient: "from-pink-500 to-rose-500",
    lightBg: "bg-pink-50 dark:bg-pink-950/30",
    color: "text-pink-600 dark:text-pink-400",
  },
  {
    icon: Wallet,
    title: "Budget Tracker",
    description:
      "Track your income and expenses in KES. Visual breakdowns, categories, and financial summaries built for student life.",
    gradient: "from-amber-500 to-orange-500",
    lightBg: "bg-amber-50 dark:bg-amber-950/30",
    color: "text-amber-600 dark:text-amber-400",
  },
  {
    icon: MapPin,
    title: "Local Services",
    description:
      "Find hospitals, banks, embassies, transport, restaurants, and essential services around your campus.",
    gradient: "from-emerald-500 to-teal-500",
    lightBg: "bg-emerald-50 dark:bg-emerald-950/30",
    color: "text-emerald-600 dark:text-emerald-400",
  },
  {
    icon: Shield,
    title: "Emergency Help",
    description:
      "One-tap dial for police, ambulance, and fire department. Your safety is always one button away.",
    gradient: "from-red-500 to-rose-600",
    lightBg: "bg-red-50 dark:bg-red-950/30",
    color: "text-red-600 dark:text-red-400",
  },
  {
    icon: Globe,
    title: "Live Announcements",
    description:
      "Stay updated with real-time announcements from your university and the EduBridge admin team.",
    gradient: "from-pink-500 to-fuchsia-500",
    lightBg: "bg-fuchsia-50 dark:bg-fuchsia-950/30",
    color: "text-fuchsia-600 dark:text-fuchsia-400",
  },
  {
    icon: BookOpen,
    title: "Study Resources",
    description:
      "Access curated resources, tips for student life in Kenya, and essential documents checklist.",
    gradient: "from-rose-500 to-pink-600",
    lightBg: "bg-rose-50 dark:bg-rose-950/30",
    color: "text-rose-600 dark:text-rose-400",
  },
];

const testimonials = [
  {
    text: "EduBridge helped me so much when I first arrived. The translation feature saved me daily at the markets!",
    name: "Liu Wei",
    from: "China",
    flag: "\u{1F1E8}\u{1F1F3}",
  },
  {
    text: "The budget tracker is exactly what I needed. I finally know where my money goes every month.",
    name: "Amira Hassan",
    from: "Egypt",
    flag: "\u{1F1EA}\u{1F1EC}",
  },
  {
    text: "Finding a hospital near campus used to be stressful. Now I just open EduBridge and it's right there.",
    name: "Jean-Pierre",
    from: "Burundi",
    flag: "\u{1F1E7}\u{1F1EE}",
  },
];

const steps = [
  { step: "1", title: "Download the App", desc: "Get EduBridge from the App Store or Google Play Store." },
  { step: "2", title: "Create Your Profile", desc: "Sign up with your email, select your university and course." },
  { step: "3", title: "Start Exploring", desc: "Translate, track budgets, find services, and feel at home in Kenya!" },
];

export function WelcomePage() {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -60]);
  const phoneY = useTransform(scrollYProgress, [0, 0.3], [0, -30]);
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("edubridge-theme") === "dark";
    }
    return false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("edubridge-theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0f] text-gray-900 dark:text-gray-100 overflow-x-hidden transition-colors duration-300">
      {/* ─── Navbar ─── */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-[#0a0a0f]/80 border-b border-pink-100/50 dark:border-pink-900/20"
      >
        <div className="mx-auto max-w-7xl px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg shadow-pink-500/25">
              <GraduationCap className="size-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">EduBridge</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500 dark:text-gray-400">
            <a href="#features" className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors">Features</a>
            <a href="#how" className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors">How It Works</a>
            <a href="#reviews" className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors">Reviews</a>
            <a href="#about" className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors">About</a>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDark(!dark)}
              className="size-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-pink-100 dark:hover:bg-pink-900/30 transition-colors"
              aria-label="Toggle theme"
            >
              {dark ? <Sun className="size-4 text-amber-400" /> : <Moon className="size-4 text-gray-600" />}
            </button>
            <button
              onClick={() => navigate("/login")}
              className="text-xs font-medium text-gray-400 dark:text-gray-500 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
            >
              Admin
            </button>
          </div>
        </div>
      </motion.nav>

      {/* ═══════ HERO ═══════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
        <div className="absolute inset-0 -z-10">
          <motion.div
            animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
            className="absolute top-20 left-[10%] w-[500px] h-[500px] bg-pink-200/40 dark:bg-pink-900/20 rounded-full blur-[120px]"
          />
          <motion.div
            animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
            transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
            className="absolute bottom-20 right-[10%] w-[400px] h-[400px] bg-rose-200/30 dark:bg-rose-900/15 rounded-full blur-[120px]"
          />
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-fuchsia-100/20 dark:bg-fuchsia-950/10 rounded-full blur-[140px]"
          />
        </div>

        <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div style={{ y: heroY }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mb-5"
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-100 to-rose-100 dark:from-pink-950/50 dark:to-rose-950/50 text-pink-700 dark:text-pink-300 text-sm font-semibold border border-pink-200/50 dark:border-pink-800/30">
                <Sparkles className="size-4" />
                #1 App for International Students in Kenya
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6"
            >
              Study in Kenya
              <br />
              <span className="bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-500 bg-clip-text text-transparent">
                Like a Local
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="text-lg text-gray-500 dark:text-gray-400 max-w-lg mb-8 leading-relaxed"
            >
              Translate 28+ languages, track your budget in KES, find local services,
              and get emergency help — all in one beautiful app built specifically for
              international students.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.8 }}
              className="flex flex-wrap gap-3 mb-8"
            >
              <a
                href="https://apps.apple.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 h-14 px-6 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl hover:opacity-90 transition-opacity shadow-lg shadow-pink-500/10"
              >
                <svg viewBox="0 0 24 24" className="size-7 fill-current">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <div className="text-left">
                  <div className="text-[10px] leading-none opacity-70">Download on the</div>
                  <div className="text-base font-semibold leading-tight">App Store</div>
                </div>
              </a>
              <a
                href="https://play.google.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 h-14 px-6 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl hover:opacity-90 transition-opacity shadow-lg shadow-pink-500/10"
              >
                <svg viewBox="0 0 24 24" className="size-7 fill-current">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.802 8.99l-2.303 2.303-8.635-8.635z" />
                </svg>
                <div className="text-left">
                  <div className="text-[10px] leading-none opacity-70">Get it on</div>
                  <div className="text-base font-semibold leading-tight">Google Play</div>
                </div>
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 1.0 }}
              className="flex items-center gap-4"
            >
              <div className="flex -space-x-2">
                {["\u{1F1E8}\u{1F1F3}", "\u{1F1E7}\u{1F1EE}", "\u{1F1EA}\u{1F1EC}", "\u{1F1F7}\u{1F1FC}", "\u{1F1E8}\u{1F1E9}"].map((flag, i) => (
                  <div
                    key={i}
                    className="size-9 rounded-full bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900/40 dark:to-rose-900/40 border-2 border-white dark:border-gray-900 flex items-center justify-center text-base"
                  >
                    {flag}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="size-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Loved by students from 15+ countries</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right — Phone Mockup */}
          <motion.div
            style={{ y: phoneY }}
            className="relative flex justify-center lg:justify-end"
          >
            <motion.div
              initial={{ opacity: 0, y: 60, rotateY: -10 }}
              animate={{ opacity: 1, y: 0, rotateY: 0 }}
              transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
              className="relative"
            >
              <div className="relative w-[280px] md:w-[300px] bg-gray-900 rounded-[3rem] p-3 shadow-2xl shadow-pink-500/20">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-gray-900 rounded-b-2xl z-10" />
                <div className="bg-white rounded-[2.2rem] overflow-hidden">
                  <div className="h-12 bg-gradient-to-r from-pink-500 to-rose-500 flex items-end justify-between px-8 pb-1">
                    <span className="text-white text-[10px] font-medium">9:41</span>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-2 bg-white/80 rounded-sm" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-b from-pink-500 via-rose-500 to-rose-600 px-5 pb-6 pt-3">
                    <p className="text-white/70 text-xs">Welcome back</p>
                    <p className="text-white text-lg font-bold mb-4">{"Karibu, Student! \u{1F44B}"}</p>
                    <div className="flex gap-2 mb-4">
                      {["28+ Languages", "Secure", "Premium"].map((chip) => (
                        <span key={chip} className="text-[9px] text-white/90 bg-white/20 px-2 py-1 rounded-full font-medium">
                          {chip}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 -mt-4 rounded-t-2xl pt-5 pb-4 space-y-3">
                    {[
                      { icon: "\u{1F310}", label: "Translate", desc: "28+ languages", color: "bg-pink-500" },
                      { icon: "\u{1F4B0}", label: "Budget", desc: "Track expenses", color: "bg-amber-500" },
                      { icon: "\u{1F4CD}", label: "Services", desc: "Find nearby", color: "bg-emerald-500" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm">
                        <div className={`size-10 ${item.color} rounded-xl flex items-center justify-center text-lg`}>
                          {item.icon}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                          <p className="text-[10px] text-gray-500">{item.desc}</p>
                        </div>
                        <ArrowRight className="size-4 text-gray-300 ml-auto" />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-around py-2 border-t border-gray-100 bg-white">
                    {["\u{1F3E0}", "\u{1F310}", "\u{1F4B0}", "\u{1F4CD}", "\u{1F464}"].map((icon, i) => (
                      <span key={i} className={`text-lg ${i === 0 ? "opacity-100" : "opacity-40"}`}>{icon}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="absolute -left-16 top-24 bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 shadow-lg shadow-pink-200/40 dark:shadow-pink-900/20 border border-pink-100 dark:border-pink-900/30"
              >
                <div className="flex items-center gap-2">
                  <div className="size-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                    <CheckCircle className="size-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">Verified</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">Translations</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }}
                className="absolute -right-12 top-56 bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 shadow-lg shadow-pink-200/40 dark:shadow-pink-900/20 border border-pink-100 dark:border-pink-900/30"
              >
                <div className="flex items-center gap-2">
                  <div className="size-8 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center">
                    <Zap className="size-5 text-pink-600 dark:text-pink-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">Instant</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">Translation</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.5 }}
                className="absolute -left-8 bottom-32 bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 shadow-lg shadow-pink-200/40 dark:shadow-pink-900/20 border border-pink-100 dark:border-pink-900/30"
              >
                <div className="flex items-center gap-2">
                  <div className="size-8 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                    <Wallet className="size-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">KES 12,400</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">Budget left</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
            <ChevronDown className="size-6 text-gray-400" />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════ STATS BANNER ═══════ */}
      <section className="bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-500 py-10">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {[
              { value: "28+", label: "Languages" },
              { value: "50+", label: "Universities" },
              { value: "15+", label: "Countries" },
              { value: "4.9", label: "App Rating" },
            ].map((stat) => (
              <AnimatedSection key={stat.label}>
                <p className="text-3xl md:text-4xl font-extrabold">{stat.value}</p>
                <p className="text-sm text-white/70 mt-1">{stat.label}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ FEATURES ═══════ */}
      <section id="features" className="py-24 dark:bg-[#0a0a0f]">
        <div className="mx-auto max-w-6xl px-6">
          <AnimatedSection className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 text-xs font-semibold mb-4">
              <Smartphone className="size-3.5" /> WHY EDUBRIDGE?
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
              Everything You Need,
              <br />
              <span className="bg-gradient-to-r from-pink-500 to-fuchsia-500 bg-clip-text text-transparent">
                Right in Your Pocket
              </span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-lg">
              From translating conversations at the market to tracking your monthly
              budget — EduBridge has you covered.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <AnimatedSection key={feature.title} delay={i * 0.08}>
                <div className="group relative bg-white dark:bg-gray-900/50 rounded-2xl p-7 border border-gray-100 dark:border-gray-800 hover:border-pink-200 dark:hover:border-pink-800/50 h-full transition-all hover:shadow-lg hover:shadow-pink-100/50 dark:hover:shadow-pink-900/10 hover:-translate-y-1">
                  <div className={`inline-flex p-3 rounded-xl ${feature.lightBg} mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className={`size-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ HOW IT WORKS ═══════ */}
      <section id="how" className="py-24 bg-gray-50/80 dark:bg-[#0e0e14]">
        <div className="mx-auto max-w-6xl px-6">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
              Get Started in
              <span className="bg-gradient-to-r from-pink-500 to-fuchsia-500 bg-clip-text text-transparent"> 3 Steps</span>
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((item, i) => (
              <AnimatedSection key={item.step} delay={i * 0.15}>
                <div className="text-center">
                  <div className="inline-flex size-16 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 items-center justify-center mb-5 shadow-lg shadow-pink-500/25">
                    <span className="text-2xl font-extrabold text-white">{item.step}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ REVIEWS ═══════ */}
      <section id="reviews" className="py-24 dark:bg-[#0a0a0f]">
        <div className="mx-auto max-w-6xl px-6">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
              Students
              <span className="bg-gradient-to-r from-pink-500 to-fuchsia-500 bg-clip-text text-transparent"> Love It</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              Hear from international students who use EduBridge every day.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <AnimatedSection key={t.name} delay={i * 0.1}>
                <div className="bg-white dark:bg-gray-900/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 hover:border-pink-200 dark:hover:border-pink-800/50 h-full flex flex-col transition-all hover:shadow-lg hover:shadow-pink-100/50 dark:hover:shadow-pink-900/10 hover:-translate-y-1">
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="size-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed flex-1 italic">
                    "{t.text}"
                  </p>
                  <div className="flex items-center gap-3 mt-5 pt-5 border-t border-gray-100 dark:border-gray-800">
                    <div className="size-10 rounded-full bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900/40 dark:to-rose-900/40 flex items-center justify-center text-lg">
                      {t.flag}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{t.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">From {t.from}</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ ABOUT CREATOR ═══════ */}
      <section id="about" className="py-28 bg-gray-50/80 dark:bg-[#0e0e14] overflow-hidden">
        <div className="mx-auto max-w-6xl px-6">
          <AnimatedSection className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 text-xs font-semibold mb-4">
              <Heart className="size-3 fill-current" /> MEET THE CREATOR
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
              The Mind Behind
              <br />
              <span className="bg-gradient-to-r from-pink-500 to-fuchsia-500 bg-clip-text text-transparent">
                EduBridge
              </span>
            </h2>
          </AnimatedSection>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left — Large Photo */}
            <AnimatedSection delay={0.1}>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative flex justify-center"
              >
                {/* Decorative blobs behind the photo */}
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="w-[360px] h-[360px] md:w-[420px] md:h-[420px] rounded-full bg-gradient-to-br from-pink-200/60 via-rose-200/40 to-fuchsia-200/60 dark:from-pink-900/20 dark:via-rose-900/15 dark:to-fuchsia-900/20 blur-2xl" />
                </motion.div>

                <div className="relative">
                  {/* Main photo container */}
                  <div className="relative w-[300px] h-[380px] md:w-[360px] md:h-[450px] rounded-3xl p-1.5 bg-gradient-to-br from-pink-400 via-rose-500 to-fuchsia-500 shadow-2xl shadow-pink-500/30">
                    <img
                      src="/images/creator.jpeg"
                      alt="OLAME BARHIBONERA Eben"
                      className="w-full h-full rounded-[1.25rem] object-cover object-top"
                    />
                  </div>

                  {/* Verified badge */}
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                    className="absolute -bottom-4 -right-4 bg-white dark:bg-gray-800 rounded-2xl px-5 py-3 shadow-xl shadow-pink-200/40 dark:shadow-pink-900/20 border border-pink-100 dark:border-pink-900/30"
                  >
                    <div className="flex items-center gap-2">
                      <div className="size-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center">
                        <CheckCircle className="size-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">Verified</p>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">Developer</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Floating tech badge */}
                  <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }}
                    className="absolute -top-3 -left-6 bg-white dark:bg-gray-800 rounded-2xl px-4 py-2.5 shadow-xl shadow-pink-200/40 dark:shadow-pink-900/20 border border-pink-100 dark:border-pink-900/30"
                  >
                    <div className="flex items-center gap-2">
                      <div className="size-8 bg-gradient-to-br from-fuchsia-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <Sparkles className="size-4 text-white" />
                      </div>
                      <p className="text-xs font-bold">Full-Stack</p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatedSection>

            {/* Right — Bio Content */}
            <AnimatedSection delay={0.25}>
              <div>
                <h3 className="text-3xl md:text-4xl font-extrabold mb-2">
                  OLAME BARHIBONERA
                  <br />
                  <span className="bg-gradient-to-r from-pink-500 to-fuchsia-500 bg-clip-text text-transparent">Eben</span>
                </h3>
                <p className="text-pink-600 dark:text-pink-400 font-semibold text-lg mb-6">Software Engineer & Founder</p>

                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4 text-base">
                  EduBridge was created as a final year project to help fellow international
                  students thrive during their studies in Kenya.
                </p>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-8 text-base">
                  The goal is to bridge the gap between arriving in a new country and feeling
                  at home — through technology, empathy, and thoughtful design. Every feature
                  was crafted from real experiences and real struggles.
                </p>

                <div className="flex flex-wrap gap-2 mb-8">
                  {["React Native", "TypeScript", "Supabase", "Expo", "Drizzle ORM", "Tailwind CSS"].map((tag) => (
                    <span
                      key={tag}
                      className="px-3.5 py-1.5 rounded-full bg-pink-50 dark:bg-pink-950/30 text-pink-700 dark:text-pink-300 text-xs font-semibold border border-pink-200 dark:border-pink-900/40"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3">
                  <a
                    href="mailto:olameeben@gmail.com"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-pink-500/25"
                  >
                    <Mail className="size-4" />
                    Get in Touch
                  </a>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
                  >
                    <Github className="size-4" />
                    GitHub
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
                  >
                    <Linkedin className="size-4" />
                    LinkedIn
                  </a>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ═══════ DOWNLOAD CTA ═══════ */}
      <section className="py-24 dark:bg-[#0a0a0f]">
        <div className="mx-auto max-w-6xl px-6">
          <AnimatedSection>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-500 via-rose-500 to-fuchsia-500 p-12 md:p-16 text-center text-white">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3" />
              <div className="relative z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  className="inline-flex size-16 rounded-2xl bg-white/20 items-center justify-center mb-6 backdrop-blur-sm"
                >
                  <Download className="size-8 text-white" />
                </motion.div>
                <h2 className="text-3xl md:text-5xl font-extrabold mb-4">
                  Ready to Thrive in Kenya?
                </h2>
                <p className="text-white/80 max-w-lg mx-auto mb-10 text-lg">
                  Join thousands of international students who already use EduBridge
                  to navigate their life in Kenya with confidence.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <a
                    href="https://apps.apple.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-3 h-14 px-7 bg-white text-gray-900 rounded-2xl hover:bg-gray-100 transition-colors shadow-lg"
                  >
                    <svg viewBox="0 0 24 24" className="size-7 fill-current">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                    </svg>
                    <div className="text-left">
                      <div className="text-[10px] leading-none opacity-60">Download on the</div>
                      <div className="text-base font-semibold leading-tight">App Store</div>
                    </div>
                  </a>
                  <a
                    href="https://play.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-3 h-14 px-7 bg-white text-gray-900 rounded-2xl hover:bg-gray-100 transition-colors shadow-lg"
                  >
                    <svg viewBox="0 0 24 24" className="size-7 fill-current">
                      <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.802 8.99l-2.303 2.303-8.635-8.635z" />
                    </svg>
                    <div className="text-left">
                      <div className="text-[10px] leading-none opacity-60">Get it on</div>
                      <div className="text-base font-semibold leading-tight">Google Play</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-gray-100 dark:border-gray-800 py-10 dark:bg-[#0a0a0f]">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
                <GraduationCap className="size-5 text-white" />
              </div>
              <div>
                <span className="font-bold">EduBridge</span>
                <p className="text-xs text-gray-500 dark:text-gray-400">{"Your companion for studying in Kenya \u{1F1F0}\u{1F1EA}"}</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
              <a href="#features" className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors">Features</a>
              <a href="#about" className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors">About</a>
              <a href="mailto:olameeben@gmail.com" className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors">Contact</a>
              <button
                onClick={() => navigate("/login")}
                className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
              >
                Admin
              </button>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              &copy; {new Date().getFullYear()} OLAME BARHIBONERA Eben. Made with <Heart className="inline size-3.5 text-pink-500 fill-pink-500" /> for international students.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
