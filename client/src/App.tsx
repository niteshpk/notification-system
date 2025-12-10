import { type ReactNode, useMemo, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  NavLink,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import {
  BarChart3,
  Bell,
  Code,
  Menu,
  Settings,
  TestTube,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { ApiManagement } from "./components/ApiManagement";
import { Dashboard } from "./components/Dashboard";
import { NotificationPreferences } from "./components/NotificationPreferences";
import { NotificationTesting } from "./components/NotificationTesting";
import { SystemSettings } from "./components/SystemSettings";
import { UserManagement } from "./components/UserManagement";

type NavigationItem = {
  id: string;
  name: string;
  icon: LucideIcon;
  path: string;
  element: ReactNode;
};

const navigation: NavigationItem[] = [
  { id: "dashboard", name: "Dashboard", icon: BarChart3, path: "/dashboard", element: <Dashboard /> },
  { id: "users", name: "User Management", icon: Users, path: "/users", element: <UserManagement /> },
  { id: "preferences", name: "Notification Preferences", icon: Bell, path: "/preferences", element: <NotificationPreferences /> },
  { id: "settings", name: "System Settings", icon: Settings, path: "/settings", element: <SystemSettings /> },
  { id: "testing", name: "Testing Module", icon: TestTube, path: "/testing", element: <NotificationTesting /> },
  { id: "api", name: "API Management", icon: Code, path: "/api", element: <ApiManagement /> },
];

function Shell() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const activePage = useMemo(
    () => navigation.find((item) => location.pathname.startsWith(item.path)),
    [location.pathname],
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-0"
        } bg-white border-r border-gray-200 transition-all duration-300 overflow-hidden`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                <Bell className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-base font-semibold">NotifyHub</div>
                <div className="text-xs text-gray-500">Admin Dashboard</div>
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-1 p-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm transition-colors ${
                      isActive ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50"
                    }`
                  }
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold">
                A
              </div>
              <div>
                <div className="text-sm font-medium">Admin User</div>
                <div className="text-xs text-gray-500">admin@notifyhub.com</div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="border-b border-gray-200 bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen((prev) => !prev)}
                className="rounded-lg p-2 transition-colors hover:bg-gray-100"
                aria-label="Toggle sidebar"
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              <h1 className="text-lg font-semibold">
                {activePage?.name ?? "Dashboard"}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <NavLink
                to="/testing"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                Quick Test
              </NavLink>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <Routes>
            {navigation.map((item) => (
              <Route key={item.id} path={item.path} element={item.element} />
            ))}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  );
}
