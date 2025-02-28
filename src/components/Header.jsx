import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  LogOut,
  User,
  Plus
} from 'lucide-react';
import CreateTicketModal from './CreateTicketModal';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/Dropdown-menu";

const Header = ({ onMenuClick, onLogout, onCreateTicket }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      return payload?.role;
    } catch (err) {
      console.error('Error getting user role:', err);
      return null;
    }
  };
  const getCurrentUserId = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      const payload = parseJwt(token);
      return payload?.id;
    } catch (err) {
      console.error('Error getting user role:', err);
      return null;
    }
  };

  const userRole = getCurrentUserRole();
  const userId = getCurrentUserId();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    navigate('/login');
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuClick}
              className="hover:bg-accent"
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <h2 className="font-semibold text-lg hidden md:block">
              IT Service Management
            </h2>
            
            <Button 
              onClick={() => setIsModalOpen(true)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              New Ticket
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden md:block">Welcome, {userRole}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate(`/user-management/user/${userId}`)}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <CreateTicketModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={onCreateTicket}
      />
    </>
  );
};

export default Header;