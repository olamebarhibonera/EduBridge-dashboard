import { createBrowserRouter } from "react-router";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { WelcomePage } from "@/pages/WelcomePage";
import { DashboardPage } from "@/pages/DashboardPage";
import { UsersPage } from "@/pages/UsersPage";
import { TranslationsPage } from "@/pages/TranslationsPage";
import { ServicesPage } from "@/pages/ServicesPage";
import { AnnouncementsPage } from "@/pages/AnnouncementsPage";
import { ReportsPage } from "@/pages/ReportsPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { LoginPage } from "@/pages/LoginPage";

export const router = createBrowserRouter([
  {
    path: "/welcome",
    Component: WelcomePage,
  },
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/",
    Component: AdminLayout,
    children: [
      { index: true, Component: DashboardPage },
      { path: "users", Component: UsersPage },
      { path: "translations", Component: TranslationsPage },
      { path: "services", Component: ServicesPage },
      { path: "announcements", Component: AnnouncementsPage },
      { path: "reports", Component: ReportsPage },
      { path: "settings", Component: SettingsPage },
    ],
  },
]);
