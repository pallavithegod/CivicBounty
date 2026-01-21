import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Wallet, Menu, X, Shield, Activity, ChevronRight } from 'lucide-react';
import { useStellar } from '../hooks/useStellar';
import classNames from 'classnames';

const Navbar = () => {
  const { address, balance, connectWallet, formatAddress, isConnecting, error } = useStellar();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navClasses = classNames(
    "fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b border-transparent",
    {
      "bg-background/80 backdrop-blur-md py-3 border-glass-border": scrolled,
      "bg-transparent py-6": !scrolled
    }
  );

  return (
    <nav className={navClasses}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        
        {/* LOGO */}
        <Link to="/" className="group flex items-center gap-3 font-display font-bold text-2xl tracking-widest text-text">
          <div className="relative">
             <Shield className="text-primary group-hover:drop-shadow-[0_0_10px_rgba(254,231,21,0.8)] transition-all duration-300" size={32} />
             <Activity className="absolute -bottom-1 -right-1 text-secondary" size={14} />
          </div>
          <div className="flex flex-col leading-none">
            <span>CIVIC<span className="text-primary">BOUNTY</span></span>
            <span className="text-[9px] font-mono text-muted tracking-[0.3em] group-hover:text-primary transition-colors">PROTOCOL</span>
          </div>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center bg-card/50 px-2 py-1 rounded-full border border-glass-border backdrop-blur-sm">
          {['/', '/dashboard', '/create'].map((path) => {
             const isActive = location.pathname === path;
             return (
              <Link 
                key={path}
                to={path} 
                className={classNames(
                  "relative px-6 py-2 rounded-full font-sans text-sm uppercase tracking-widest transition-all duration-300",
                  {
                    "text-black bg-primary font-bold shadow-[0_0_15px_rgba(254,231,21,0.4)]": isActive,
                    "text-muted hover:text-white": !isActive
                  }
                )}
              >
                {path === '/' ? 'Home' : path.replace('/', '').replace('create', 'Create')}
              </Link>
             );
          })}
        </div>

        {/* WALLET ACTION */}
        <div className="hidden md:flex flex-col items-end gap-1">
          {error && <span className="text-[10px] text-red-500 font-mono bg-black/80 px-2 py-0.5 rounded border border-red-500/50">{error}</span>}
          {address ? (
            <div className="flex items-center gap-4 pl-4 pr-2 py-1.5 bg-black/60 rounded-r-full border-l-2 border-primary font-mono text-xs">
              <div className="flex flex-col items-end leading-tight">
                 <span className="text-primary font-bold">{Math.floor(balance)} XLM</span>
                 <span className="text-muted">{formatAddress(address)}</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-black font-bold">
                 {address.substring(0,2)}
              </div>
            </div>
          ) : (
            <button 
              className="group relative px-6 py-2 bg-transparent border border-primary text-primary font-display font-bold uppercase tracking-widest overflow-hidden transition-all hover:bg-primary hover:text-black"
              onClick={connectWallet}
              disabled={isConnecting}
            >
              <div className="relative z-10 flex items-center gap-2">
                <Wallet size={16} />
                <span>{isConnecting ? 'Syncing...' : 'Connect Freighter'}</span>
              </div>
            </button>
          )}
        </div>

        {/* MOBILE TOGGLE */}
        <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILE MENU OVERLAY */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full h-screen bg-black/95 backdrop-blur-xl border-t border-glass-border p-8 flex flex-col gap-8">
          <div className="flex flex-col gap-6">
            {['/', '/dashboard', '/create'].map((path) => (
              <Link 
                key={path}
                to={path} 
                className="text-3xl font-display font-bold uppercase text-white flex justify-between items-center group border-b border-white/10 pb-4" 
                onClick={() => setIsMenuOpen(false)}
              >
                {path === '/' ? 'Home' : path.replace('/', '')}
                <ChevronRight className="opacity-0 group-hover:opacity-100 text-primary transition-opacity" />
              </Link>
            ))}
          </div>
          
          <div className="mt-auto mb-20">
            {address ? (
              <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                <div className="text-primary font-mono mb-2">CONNECTED WALLET</div>
                <div className="text-xl text-white font-bold mb-1">{Math.floor(balance)} XLM</div>
                <div className="text-xs text-muted break-all font-mono">{address}</div>
              </div>
            ) : (
              <button 
                className="w-full py-4 bg-primary text-black font-bold font-display uppercase tracking-widest text-xl" 
                onClick={() => { connectWallet(); setIsMenuOpen(false); }}
              >
                Initialize Wallet Link
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
