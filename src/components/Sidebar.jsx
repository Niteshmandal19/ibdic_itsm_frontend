import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Ticket, 
  Users, 
  BarChart3, 
  Settings,
  ChevronsLeft,
  ChevronsRight, 
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const ROLES = {
  IBDIC_ADMIN: 'IBDIC_ADMIN',
  IBDIC_USER: 'IBDIC_USER',
  ORG_ADMIN: 'ORG_ADMIN',
  ORG_USER: 'ORG_USER'
};

const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));
    return payload;
  } catch (e) {
    console.error('Error parsing token:', e);
    return null;
  }
};

const getCurrentUserRole = () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const payload = parseJwt(token);
    return {
      role: payload?.role,
      is_sftp_user: payload?.IS_SFTP_USER === 1
    };
  } catch (err) {
    console.error('Error getting user role:', err);
    return null;
  }
};

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const currentUser = getCurrentUserRole();

  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      path: '/dashboard', 
      icon: LayoutDashboard,
      allowedRoles: [ROLES.IBDIC_ADMIN, ROLES.IBDIC_USER, ROLES.ORG_ADMIN, ROLES.ORG_USER]
    },
    { 
      id: 'incidents', 
      label: 'Incidents', 
      path: '/incidents', 
      icon: Ticket,
      allowedRoles: [ROLES.IBDIC_ADMIN, ROLES.IBDIC_USER, ROLES.ORG_ADMIN, ROLES.ORG_USER]
    },
    { 
      id: 'users', 
      label: 'User Management', 
      path: '/user-management', 
      icon: Users,
      allowedRoles: [ROLES.IBDIC_ADMIN, ROLES.ORG_ADMIN]
    },
    { 
      id: 'masters', 
      label: 'Master Management', 
      path: '/master-management', 
      icon: Users,
      allowedRoles: [ROLES.IBDIC_ADMIN]
    },
    // { 
    //   id: 'SFTP request', 
    //   label: 'SFTP Request Management', 
    //   path: '/sftp-request-management', 
    //   icon: Users,
    //   allowedRoles: [ROLES.IBDIC_ADMIN]
    // },
    { 
      id: 'SFTP', 
      label: 'SFTP', 
      path: '/sftp', 
      icon: Users,
      allowedRoles: [ROLES.IBDIC_ADMIN, ROLES.IBDIC_USER, ROLES.ORG_ADMIN, ROLES.ORG_USER],
      isSftpUserOnly: true
    },
    { 
      id: 'prodcuts', 
      label: 'Product Management', 
      path: '/product-management', 
      icon: Users,
      allowedRoles: [ROLES.IBDIC_ADMIN]
    },
    { 
      id: 'reports', 
      label: 'Reports', 
      path: '/reports', 
      icon: BarChart3,
      allowedRoles: [ROLES.IBDIC_ADMIN, ROLES.IBDIC_USER, ROLES.ORG_ADMIN, ROLES.ORG_USER]
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      path: '/settings', 
      icon: Settings,
      allowedRoles: [ROLES.IBDIC_ADMIN, ROLES.IBDIC_USER, ROLES.ORG_ADMIN, ROLES.ORG_USER]
    },
  ];

  const authorizedMenuItems = menuItems.filter(item => 
    item.allowedRoles.includes(currentUser?.role) && 
    (!item.isSftpUserOnly || currentUser?.is_sftp_user)
  );

  const NavItem = ({ item }) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.path;

    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              to={item.path}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-slate-800",
                isActive ? "bg-slate-800 text-white" : "text-slate-300 hover:text-white",
                !isOpen && "justify-center"
              )}
            >
              <Icon className="h-4 w-4" />
              {isOpen && <span>{item.label}</span>}
            </Link>
          </TooltipTrigger>
          {!isOpen && (
            <TooltipContent side="right">
              {item.label}
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div
      className={cn(
        "flex flex-col bg-slate-900 text-white",
        "fixed left-0 top-0 z-40 h-full",
        "transition-all duration-300 ease-in-out",
        isOpen ? "w-60" : "w-16"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4">
        <h2 className={cn(
          "font-semibold tracking-tight transition-all",
          isOpen ? "text-xl" : "text-sm"
        )}>
          {isOpen ? 'ITSM System' : 'ITSM'}
        </h2>
        <Button
          variant="ghost"
          size="icon"
          className="text-slate-300 hover:text-white hover:bg-slate-800"
          onClick={toggleSidebar}
        >
          {isOpen ? <ChevronsLeft className="h-4 w-4" /> : <ChevronsRight className="h-4 w-4" />}
        </Button>
      </div>
      
      <Separator className="bg-slate-800" />
      
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-2">
          {authorizedMenuItems.map((item) => (
            <NavItem key={item.id} item={item} />
          ))}
        </nav>
      </ScrollArea>
    </div>
  );
};

export default Sidebar;