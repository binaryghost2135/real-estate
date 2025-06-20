
"use client";

import type { FC } from 'react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onNavigate: (filter: 'buy' | 'rent' | 'favorites') => void;
  onOpenSellModal: () => void;
  isAdminLoggedIn: boolean;
  onLogout: () => void;
}

const Header: FC<HeaderProps> = ({ onNavigate, onOpenSellModal, isAdminLoggedIn, onLogout }) => {
  const handleNavClick = (filter: 'buy' | 'rent' | 'favorites') => {
    onNavigate(filter);
  };

  const handleLogoClick = () => {
    onNavigate('buy'); 
  };

  return (
    <header className="bg-card/80 backdrop-blur-lg sticky top-0 z-50 shadow-sm rounded-b-xl border-b">
      <div className="container mx-auto flex flex-wrap justify-between items-center p-4">
        <button onClick={handleLogoClick} className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-indigo-600 text-transparent bg-clip-text cursor-pointer">
            HomeFind
          </h1>
        </button>
        <nav>
          <ul className="flex items-center space-x-2 sm:space-x-4 text-sm sm:text-base font-medium text-foreground/80">
            {!isAdminLoggedIn && (
              <li>
                <Button
                  onClick={onOpenSellModal}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold px-3 py-1.5 sm:px-4 sm:py-2 rounded-full transition-all duration-300 transform hover:scale-105 shadow-md text-xs sm:text-sm"
                >
                  Sell
                </Button>
              </li>
            )}
            <li>
              <Button variant="ghost" onClick={() => handleNavClick('buy')} className="hover:bg-accent hover:text-accent-foreground transition duration-300 px-2 py-1">
                Buy
              </Button>
            </li>
            <li>
              <Button variant="ghost" onClick={() => handleNavClick('rent')} className="hover:bg-accent hover:text-accent-foreground transition duration-300 px-2 py-1">
                Rent
              </Button>
            </li>
             {isAdminLoggedIn && (
                <li>
                  <Button variant="outline" onClick={onLogout} className="text-xs sm:text-sm">
                    Logout
                  </Button>
                </li>
              )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
