import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Sparkles, LogOut, User, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const navLinkClass = ({ isActive }: { isActive: boolean }): string =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
      isActive
        ? 'bg-accent-primary/20 text-accent-primary'
        : 'text-text-secondary hover:text-text-primary hover:bg-card'
    }`;

  const handleSignOut = async () => {
    await signOut();
    setShowDropdown(false);
  };

  return (
    <header className="bg-background/80 backdrop-blur-lg sticky top-0 z-40 border-b border-accent-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <NavLink to="/dashboard" className="flex items-center space-x-2 text-2xl font-bold text-accent-primary transition-opacity hover:opacity-80">
                <Sparkles className="h-6 w-6" />
                <span>Aura</span>
            </NavLink>
          </div>
          
          {user && (
            <>
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-4">
                <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
                <NavLink to="/wardrobe" className={navLinkClass}>My Wardrobe</NavLink>
                <NavLink to="/stylist" className={navLinkClass}>AI Stylist</NavLink>
                <NavLink to="/rate-outfit" className={navLinkClass}>Rate My Outfit</NavLink>
                <NavLink to="/chat" className={navLinkClass}>Chat</NavLink>
                
                {/* User Dropdown */}
                <div className="relative ml-4">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-card transition-colors"
                  >
                    <User className="h-5 w-5" />
                    <span>{profile?.full_name || 'Account'}</span>
                  </button>
                  
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-card rounded-md shadow-lg border border-accent-secondary/30 py-1">
                      <div className="px-4 py-2 border-b border-accent-secondary/30">
                        <p className="text-sm font-medium text-text-primary">{profile?.full_name}</p>
                        <p className="text-xs text-text-secondary truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-text-secondary hover:bg-accent-secondary/20 hover:text-text-primary flex items-center space-x-2"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </nav>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-card"
              >
                {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        {user && showMobileMenu && (
          <div className="md:hidden py-4 border-t border-accent-secondary/30">
            <nav className="flex flex-col space-y-2">
              <NavLink to="/dashboard" className={navLinkClass} onClick={() => setShowMobileMenu(false)}>Dashboard</NavLink>
              <NavLink to="/wardrobe" className={navLinkClass} onClick={() => setShowMobileMenu(false)}>My Wardrobe</NavLink>
              <NavLink to="/stylist" className={navLinkClass} onClick={() => setShowMobileMenu(false)}>AI Stylist</NavLink>
              <NavLink to="/rate-outfit" className={navLinkClass} onClick={() => setShowMobileMenu(false)}>Rate My Outfit</NavLink>
              <NavLink to="/chat" className={navLinkClass} onClick={() => setShowMobileMenu(false)}>Chat</NavLink>
              <div className="pt-4 border-t border-accent-secondary/30">
                <div className="px-3 py-2 text-sm">
                  <p className="font-medium text-text-primary">{profile?.full_name}</p>
                  <p className="text-xs text-text-secondary">{user.email}</p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-card rounded-md flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;