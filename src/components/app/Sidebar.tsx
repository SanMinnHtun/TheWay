import { NavLink, useNavigate } from "react-router-dom";
import type { ComponentType, SVGProps } from "react";
import type { CurrentUser } from "../../data/mockUser";
import { useI18n } from "../../i18n/I18nContext";
import type { TranslationKey } from "../../i18n/translations";
import UserAvatar from "./UserAvatar";
import {
  BookIcon,
  CompassIcon,
  MapIcon,
  SettingsIcon,
  SidebarIcon,
  SignOutIcon,
  SparkleIcon
} from "./AppIcons";

type NavIcon = ComponentType<SVGProps<SVGSVGElement>>;

interface NavigationItem {
  labelKey: TranslationKey;
  to: string;
  icon: NavIcon;
}

const mainNavItems: NavigationItem[] = [
  { labelKey: "sidebar.explore", to: "/app/explore", icon: CompassIcon },
  { labelKey: "sidebar.roadmap", to: "/app/roadmap", icon: MapIcon },
  { labelKey: "sidebar.resources", to: "/app/resources", icon: BookIcon },
  { labelKey: "sidebar.assistant", to: "/app/assistant", icon: SparkleIcon }
];

const settingsItem: NavigationItem = {
  labelKey: "sidebar.settings",
  to: "/app/settings",
  icon: SettingsIcon
};

function SidebarItem({
  item,
  collapsed,
  onNavigate
}: {
  item: NavigationItem;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const { t } = useI18n();
  const Icon = item.icon;
  const label = t(item.labelKey);

  return (
    <NavLink
      to={item.to}
      onClick={onNavigate}
      aria-label={collapsed ? label : undefined}
      title={collapsed ? label : undefined}
      className={({ isActive }) =>
        `app-sidebar-item ${isActive ? "app-sidebar-item--active" : ""} ${collapsed ? "app-sidebar-item--collapsed" : ""}`
      }
    >
      {({ isActive }) => (
        <>
          <Icon className={`h-5 w-5 shrink-0 ${isActive ? "text-[#c4b5fd]" : "text-[#a78bfa]"}`} />
          <span className="app-sidebar-label">{label}</span>
        </>
      )}
    </NavLink>
  );
}

export default function Sidebar({
  user,
  collapsed,
  drawer = false,
  onCollapseToggle,
  onNavigate,
  onSignOut
}: {
  user: CurrentUser;
  collapsed: boolean;
  drawer?: boolean;
  onCollapseToggle?: () => void;
  onNavigate?: () => void;
  onSignOut?: () => Promise<void>;
}) {
  const navigate = useNavigate();
  const { t } = useI18n();
  const effectiveCollapsed = drawer ? false : collapsed;

  async function handleSignOut() {
    await onSignOut?.();
    onNavigate?.();
    navigate("/");
  }

  return (
    <aside className={`app-sidebar ${effectiveCollapsed ? "app-sidebar--collapsed" : ""} ${drawer ? "app-sidebar--drawer" : ""}`}>
      <div className="app-sidebar-brand-row">
        <span className="app-sidebar-brand">The Way</span>
        {onCollapseToggle ? (
          <button
            type="button"
            className="app-icon-button"
            onClick={onCollapseToggle}
            aria-label={effectiveCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <SidebarIcon className="h-5 w-5" />
          </button>
        ) : null}
      </div>

      <NavLink
        to="/app/profile"
        onClick={onNavigate}
        className={`app-sidebar-user ${effectiveCollapsed ? "app-sidebar-user--collapsed" : ""}`}
        aria-label={effectiveCollapsed ? t("sidebar.profile") : undefined}
        title={effectiveCollapsed ? t("sidebar.profile") : undefined}
      >
        <UserAvatar user={user} />
        <div className="app-sidebar-user-text">
          <span>{user.name}</span>
        </div>
      </NavLink>

      <nav className="app-sidebar-nav" aria-label="Main navigation">
        {mainNavItems.map((item) => (
          <SidebarItem key={item.to} item={item} collapsed={effectiveCollapsed} onNavigate={onNavigate} />
        ))}
      </nav>

      <nav className="app-sidebar-bottom" aria-label="Account navigation">
        <SidebarItem item={settingsItem} collapsed={effectiveCollapsed} onNavigate={onNavigate} />
        <button
          type="button"
          className={`app-sidebar-item app-sidebar-signout ${effectiveCollapsed ? "app-sidebar-item--collapsed" : ""}`}
          onClick={handleSignOut}
          aria-label={effectiveCollapsed ? t("sidebar.signOut") : undefined}
          title={effectiveCollapsed ? t("sidebar.signOut") : undefined}
        >
          <SignOutIcon className="h-5 w-5 shrink-0 text-[#a78bfa]" />
          <span className="app-sidebar-label">{t("sidebar.signOut")}</span>
        </button>
      </nav>
    </aside>
  );
}
