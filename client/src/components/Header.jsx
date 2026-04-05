import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Map, Heart } from 'lucide-react';

const Header = ({ onLoginClick }) => {
  const { user, logout } = useAuth();

  return (
    <header className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 shadow-lg w-full overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-24 h-24 bg-white rounded-full translate-x-12 -translate-y-12 animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 left-1/4 w-20 h-20 bg-white rounded-full -translate-x-10 translate-y-10 animate-pulse delay-500"></div>
        <div className="absolute bottom-0 right-1/3 w-16 h-16 bg-white rounded-full translate-x-8 translate-y-8 animate-pulse delay-1500"></div>
      </div>

      <div className="relative z-10 py-4 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">

          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <img
              src="/spy1.jpg"
              alt="SPY Logo"
              className="h-12 w-auto object-contain"
            />
            <div>
              <h1 className="text-2xl font-bold text-white tracking-wide">SPY</h1>
              <p className="text-sm text-blue-100 hidden sm:block">Socho, Parkho, Yatra Karo!!</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#destinations" className="flex items-center space-x-2 text-white/90 hover:text-white transition-colors group">
              <Map className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Destinations</span>
            </a>
            <a href="#experiences" className="flex items-center space-x-2 text-white/90 hover:text-white transition-colors group">
              <Heart className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Experiences</span>
            </a>
            <a href="#history" className="flex items-center space-x-2 text-white/90 hover:text-white transition-colors group">
              <span className="font-medium">History</span>
            </a>
          </nav>

          {/* Auth Section */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="flex items-center gap-2 text-white/90 bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm">
                  <User size={16} />
                  <span className="font-medium hidden sm:block">{user.username}</span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:scale-105"
                >
                  <LogOut size={16} />
                  <span className="hidden sm:block">Logout</span>
                </button>
              </>
            ) : (
              <button
                onClick={onLoginClick}
                className="px-6 py-2 bg-white text-blue-600 hover:bg-blue-50 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg hover:scale-105"
              >
                Login / Sign Up
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;