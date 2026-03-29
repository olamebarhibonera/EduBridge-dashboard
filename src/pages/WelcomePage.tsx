import { useRef } from "react";
import { useNavigate } from "react-router";
import { motion, useInView, useScroll, useTransform } from "motion/react";
import {
  GraduationCap,
  Languages,
  Wallet,
  MapPin,
  Shield,
  Users,
  Megaphone,
  FileBarChart,
  ArrowRight,
  Globe,
  Smartphone,
  Monitor,
  Github,
  Mail,
  ChevronDown,
  Sparkles,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";

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

const mobileFeatures = [
  {
    icon: Languages,
    title: "28+ Language Translation",
    description:
      "Real-time translation between 28+ languages with auto-translate as you type. Powered by MyMemory API.",
    color: "from-blue-500 to-indigo-600",
    bg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    icon: Wallet,
    title: "Budget Tracker",
    description:
      "Track income & expenses in KES. Designed for student life with categories and visual breakdowns.",
    color: "from-amber-500 to-orange-600",
    bg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  {
    icon: MapPin,
    title: "Local Services",
    description:
      "Find hospitals, banks, embassies, transport, restaurants and essential services near you.",
    color: "from-emerald-500 to-green-600",
    bg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    icon: Shield,
    title: "Emergency Contacts",
    description:
      "Quick-dial emergency services. Police, ambulance, and fire department at your fingertips.",
    color: "from-red-500 to-rose-600",
    bg: "bg-red-50",
    iconColor: "text-red-600",
  },
];

const adminFeatures = [
  {
    icon: Users,
    title: "User Management",
    description: "Full CRUD: create, edit, update, and delete user profiles with role assignment.",
  },
  {
    icon: Languages,
    title: "Translation Management",
    description: "Manage verified phrases, review translations, and curate language content.",
  },
  {
    icon: Megaphone,
    title: "Announcements",
    description: "Broadcast announcements to students with priority levels and scheduling.",
  },
  {
    icon: FileBarChart,
    title: "Reports & PDF Export",
    description: "Generate comprehensive reports and export data as professional PDFs.",
  },
];

const techStack = [
  { name: "React Native", category: "Mobile", icon: Smartphone },
  { name: "Expo", category: "Mobile", icon: Smartphone },
  { name: "React + Vite", category: "Dashboard", icon: Monitor },
  { name: "shadcn/ui", category: "Dashboard", icon: Monitor },
  { name: "Supabase", category: "Backend", icon: Globe },
  { name: "Drizzle ORM", category: "Backend", icon: Globe },
  { name: "Tailwind CSS", category: "Styling", icon: Sparkles },
  { name: "TypeScript", category: "Language", icon: Star },
];

export function WelcomePage() {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);

  return (
    <div className="min-h-screen bg-white">
      {/* ─── Navbar ─── */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/20"
      >
        <div className="mx-auto max-w-7xl px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center shadow-lg shadow-violet-500/25">
              <GraduationCap className="size-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">EduBridge</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#admin" className="hover:text-foreground transition-colors">Admin</a>
            <a href="#tech" className="hover:text-foreground transition-colors">Tech Stack</a>
            <a href="#about" className="hover:text-foreground transition-colors">About</a>
          </div>
          <Button onClick={() => navigate("/login")} size="sm">
            Admin Login
            <ArrowRight className="ml-1 size-4" />
          </Button>
        </div>
      </motion.nav>

      {/* ─── Hero ─── */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-200/40 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-violet-100/30 to-fuchsia-100/30 rounded-full blur-3xl" />
        </div>

        <div className="mx-auto max-w-6xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-100 text-violet-700 text-sm font-semibold">
              <Sparkles className="size-4" />
              Final Year Project — 2025/2026
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6"
          >
            Your Bridge to
            <br />
            <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
              Student Life in Kenya
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            EduBridge is a comprehensive mobile + web platform helping international
            students navigate life in Kenya with translation, budgeting, local services,
            and an admin dashboard for management.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Button
              size="lg"
              className="h-12 px-8 text-base rounded-xl shadow-lg shadow-primary/25"
              onClick={() => navigate("/login")}
            >
              Open Dashboard
              <ArrowRight className="ml-2 size-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-8 text-base rounded-xl"
              onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
            >
              Explore Features
            </Button>
          </motion.div>

          {/* Floating stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
          >
            {[
              { label: "Languages", value: "28+" },
              { label: "Services", value: "6+" },
              { label: "Admin Pages", value: "8" },
              { label: "Platforms", value: "2" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="glass rounded-2xl p-4 hover-lift cursor-default"
              >
                <p className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <ChevronDown className="size-6 text-muted-foreground" />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ─── Mobile Features ─── */}
      <section id="features" className="py-24 bg-gray-50/50">
        <div className="mx-auto max-w-6xl px-6">
          <AnimatedSection className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-semibold mb-4">
              <Smartphone className="size-3.5" /> MOBILE APP
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Everything a Student Needs
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Built with React Native & Expo, the mobile app is your daily companion for life in Kenya.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-6">
            {mobileFeatures.map((feature, i) => (
              <AnimatedSection key={feature.title} delay={i * 0.1}>
                <div className="group relative bg-white rounded-2xl p-6 border border-gray-100 hover-lift h-full">
                  <div className={`inline-flex p-3 rounded-xl ${feature.bg} mb-4`}>
                    <feature.icon className={`size-6 ${feature.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Admin Dashboard ─── */}
      <section id="admin" className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <AnimatedSection className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold mb-4">
              <Monitor className="size-3.5" /> ADMIN DASHBOARD
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Powerful Admin Panel
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A professional shadcn/ui dashboard to manage users, content, and platform data with PDF reporting.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {adminFeatures.map((feature, i) => (
              <AnimatedSection key={feature.title} delay={i * 0.1}>
                <div className="group bg-white rounded-2xl p-5 border border-gray-100 hover-lift h-full text-center">
                  <div className="inline-flex p-3 rounded-xl bg-violet-50 mb-3 group-hover:bg-violet-100 transition-colors">
                    <feature.icon className="size-5 text-violet-600" />
                  </div>
                  <h3 className="font-semibold mb-1.5 text-sm">{feature.title}</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Dashboard preview mockup */}
          <AnimatedSection delay={0.3} className="mt-16">
            <div className="relative rounded-2xl border border-gray-200 bg-white p-2 shadow-2xl shadow-gray-200/50">
              <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
                <div className="flex gap-1.5">
                  <div className="size-3 rounded-full bg-red-400" />
                  <div className="size-3 rounded-full bg-amber-400" />
                  <div className="size-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="bg-gray-100 rounded-md px-4 py-1 text-xs text-muted-foreground font-mono">
                    edubridge-admin.vercel.app
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-violet-50 via-white to-purple-50 rounded-xl p-8 min-h-[300px] flex items-center justify-center">
                <div className="grid grid-cols-3 gap-4 w-full max-w-2xl">
                  {[
                    { label: "Total Users", value: "1,247", change: "+12%" },
                    { label: "Translations", value: "8,492", change: "+28%" },
                    { label: "Active Today", value: "342", change: "+5%" },
                  ].map((card) => (
                    <div key={card.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                      <p className="text-xs text-muted-foreground mb-1">{card.label}</p>
                      <p className="text-2xl font-bold">{card.value}</p>
                      <span className="text-xs text-emerald-600 font-medium">{card.change}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── Tech Stack ─── */}
      <section id="tech" className="py-24 bg-gray-50/50">
        <div className="mx-auto max-w-6xl px-6">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Tech Stack
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Built with modern, production-ready technologies.
            </p>
          </AnimatedSection>

          <AnimatedSection>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {techStack.map((tech, i) => (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl p-4 border border-gray-100 hover-lift text-center"
                >
                  <tech.icon className="size-5 mx-auto mb-2 text-violet-600" />
                  <p className="font-semibold text-sm">{tech.name}</p>
                  <p className="text-xs text-muted-foreground">{tech.category}</p>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── Architecture ─── */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Architecture
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Both platforms share the same Supabase backend for seamless synchronization.
            </p>
          </AnimatedSection>

          <AnimatedSection>
            <div className="relative">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Mobile */}
                <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-6 border border-violet-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-violet-600 text-white">
                      <Smartphone className="size-5" />
                    </div>
                    <h3 className="font-bold">Mobile App</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-violet-400" />React Native + Expo</li>
                    <li className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-violet-400" />Supabase Auth</li>
                    <li className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-violet-400" />MyMemory API</li>
                    <li className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-violet-400" />Multi-theme UI</li>
                  </ul>
                </div>

                {/* Backend */}
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-emerald-600 text-white">
                      <Globe className="size-5" />
                    </div>
                    <h3 className="font-bold">Supabase Backend</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-emerald-400" />PostgreSQL Database</li>
                    <li className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-emerald-400" />Row Level Security</li>
                    <li className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-emerald-400" />Edge Functions</li>
                    <li className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-emerald-400" />Realtime Subscriptions</li>
                  </ul>
                </div>

                {/* Dashboard */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-blue-600 text-white">
                      <Monitor className="size-5" />
                    </div>
                    <h3 className="font-bold">Admin Dashboard</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-blue-400" />React + Vite</li>
                    <li className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-blue-400" />shadcn/ui + Tailwind</li>
                    <li className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-blue-400" />Drizzle ORM</li>
                    <li className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-blue-400" />PDF Export (jsPDF)</li>
                  </ul>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── About the Creator ─── */}
      <section id="about" className="py-24 bg-gray-50/50">
        <div className="mx-auto max-w-6xl px-6">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              About the Creator
            </h2>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-3xl p-8 md:p-10 border border-gray-100 shadow-lg shadow-gray-100/50 text-center">
                <div className="inline-flex size-20 rounded-full bg-gradient-to-br from-violet-600 to-purple-700 items-center justify-center mb-6 shadow-lg shadow-violet-500/25">
                  <span className="text-3xl font-bold text-white">OE</span>
                </div>
                <h3 className="text-2xl font-bold mb-1">OLAME BARHIBONERA Eben</h3>
                <p className="text-violet-600 font-medium mb-6">Final Year Student &amp; Developer</p>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  EduBridge was created as a final year project to help fellow
                  international students thrive during their studies in Kenya. The goal
                  is to bridge the gap between arriving in a new country and feeling at
                  home — through technology, empathy, and thoughtful design. 🇰🇪
                </p>
                <div className="flex justify-center gap-4">
                  <a
                    href="mailto:olameeben@gmail.com"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-50 text-violet-700 font-medium text-sm hover:bg-violet-100 transition-colors"
                  >
                    <Mail className="size-4" />
                    Contact
                  </a>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-medium text-sm hover:bg-gray-200 transition-colors"
                  >
                    <Github className="size-4" />
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <AnimatedSection>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 p-12 md:p-16 text-center text-white">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Ready to Explore?
                </h2>
                <p className="text-white/80 max-w-lg mx-auto mb-8">
                  Access the admin dashboard to manage users, translations,
                  announcements, and more.
                </p>
                <Button
                  size="lg"
                  variant="secondary"
                  className="h-12 px-8 text-base rounded-xl"
                  onClick={() => navigate("/login")}
                >
                  Go to Admin Dashboard
                  <ArrowRight className="ml-2 size-5" />
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-gray-100 py-8">
        <div className="mx-auto max-w-6xl px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-lg bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center">
              <GraduationCap className="size-4 text-white" />
            </div>
            <span className="font-semibold text-sm">EduBridge</span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} OLAME BARHIBONERA Eben. Built with love for international students. 🇰🇪
          </p>
        </div>
      </footer>
    </div>
  );
}
