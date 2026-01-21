import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Users, Zap, ArrowRight, Shield, Globe } from 'lucide-react';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

const Landing = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Split Text Animation for Hero Title
      const titleText = new SplitType('#hero-title', { types: 'chars' });
      
      gsap.from(titleText.chars, {
        opacity: 0,
        y: 100,
        rotateX: -90,
        stagger: 0.02,
        duration: 1,
        ease: "back.out(1.7)",
        delay: 0.5
      });

      // Reveal elements on scroll
      gsap.utils.toArray('.reveal-on-scroll').forEach((elem) => {
        gsap.fromTo(elem,
          { 
            y: 50, 
            opacity: 0,
            filter: "blur(10px)"
          },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: elem,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });

      // Rotating Globe/Circle Decoration
      gsap.to(".hero-decoration", {
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: "none"
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden">
      
      {/* HERO SECTION */}
      <section className="min-h-screen relative flex flex-col items-center justify-center text-center px-4 pt-20">
        
        {/* Background Gradients/Glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
        </div>

        {/* Decorative Elements */}
        <div className="hero-decoration absolute top-1/4 right-[10%] w-32 h-32 border border-dashed border-primary/30 rounded-full opacity-50 hidden md:block" />
        <div className="absolute bottom-10 left-10 font-mono text-xs text-muted hidden md:flex flex-col gap-2">
           <span>COORDS: 35.6895° N, 139.6917° E</span>
           <span>NET: STELLAR TESTNET</span>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-mono tracking-widest mb-6 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            SYSTEM ONLINE V2.0
          </div>
          
          <h1 id="hero-title" className="text-6xl md:text-8xl font-display font-bold uppercase leading-[0.9] tracking-tight mb-8 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">
            DECENTRALIZED<br />
            <span className="text-stroke-primary text-transparent" style={{ WebkitTextStroke: '1px var(--color-primary)' }}>CIVIC ACTION</span>
          </h1>
          
          <p className="font-sans text-lg md:text-xl text-muted max-w-2xl mx-auto mb-10 leading-relaxed reveal-on-scroll">
            The world's first <span className="text-white font-bold">Proof-of-Civic-Work</span> platform.
            Report issues. Crowdfund bounties. Earn crypto for fixing your city.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 reveal-on-scroll">
            <Link to="/dashboard" className="group relative px-8 py-4 bg-primary text-black font-display font-bold text-lg uppercase tracking-widest clip-corner hover:bg-white transition-colors">
              <span className="relative z-10 flex items-center gap-2">
                Launch App <ArrowRight size={18} />
              </span>
              {/* Button Glitch Effect Overlay */}
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
            </Link>
            
            <Link to="/create" className="px-8 py-4 border border-glass-border text-white font-display font-bold text-lg uppercase tracking-widest hover:border-primary hover:text-primary transition-all clip-corner">
              View Bounties
            </Link>
          </div>
        </div>
      </section>


      {/* STATS SECTION */}
      <section className="py-20 border-y border-glass-border bg-black/50 backdrop-blur-sm relative">
        <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12">
           {[
             { label: "Total Value Locked", value: "$420K+", icon: Shield },
             { label: "Active Citizens", value: "12,405", icon: Users },
             { label: "Bounties Cleared", value: "859", icon: MapPin },
             { label: "Cities Online", value: "14", icon: Globe },
           ].map((stat, i) => (
             <div key={i} className="reveal-on-scroll flex flex-col items-center justify-center text-center gap-2 group">
                <stat.icon size={24} className="text-muted group-hover:text-primary transition-colors mb-2" />
                <h3 className="text-4xl md:text-5xl font-display font-bold text-white group-hover:text-primary transition-colors">{stat.value}</h3>
                <p className="font-mono text-xs text-muted uppercase tracking-widest">{stat.label}</p>
             </div>
           ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-32 relative">
        <div className="container mx-auto px-6">
          <div className="mb-20 text-center reveal-on-scroll">
             <h2 className="text-4xl md:text-5xl font-display font-bold uppercase mb-4">
               Protocol <span className="text-primary">Workflow</span>
             </h2>
             <p className="text-muted max-w-xl mx-auto">Autonomous coordination for physical infrastructure maintenance.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                step: "01", 
                title: "Initialize Bounty", 
                desc: "Uploaded geotechnical data points (potholes, debris) are verified via consensus.",
                icon: MapPin 
              },
              { 
                step: "02", 
                title: "Smart Escrow", 
                desc: "Funds are locked in a Stellar smart contract. Trustless and secure.",
                icon: Shield 
              },
              { 
                step: "03", 
                title: "Proof of Work", 
                desc: "Workers execute repairs and upload cryptographic proof. Payment is instant.",
                icon: Zap 
              }
            ].map((card, i) => (
              <div key={i} className="reveal-on-scroll group relative p-8 bg-card border border-glass-border hover:border-primary/50 transition-all duration-500 clip-double">
                 <div className="absolute top-0 right-0 p-4 font-mono text-4xl font-bold text-white/5 group-hover:text-primary/10 transition-colors">
                   {card.step}
                 </div>
                 <div className="w-12 h-12 bg-primary/10 flex items-center justify-center rounded mb-6 group-hover:bg-primary group-hover:text-black transition-all duration-300">
                   <card.icon size={24} />
                 </div>
                 <h3 className="text-2xl font-display font-bold uppercase mb-4 group-hover:text-primary transition-colors">{card.title}</h3>
                 <p className="text-muted leading-relaxed group-hover:text-gray-300 transition-colors">{card.desc}</p>
                 
                 <div className="absolute bottom-0 left-0 w-0 h-1 bg-primary group-hover:w-full transition-all duration-500 ease-out" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-glass-border bg-black py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5" />
        <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-left">
            <h4 className="text-2xl font-display font-bold tracking-widest text-white mb-2">CIVIC<span className="text-primary">BOUNTY</span></h4>
            <p className="text-muted text-sm font-mono">Decentralized Autonomous Civic Infrastructure.</p>
          </div>
          
          <div className="flex gap-8 text-sm font-mono text-muted uppercase tracking-wider">
            <a href="#" className="hover:text-primary transition-colors">Documentation</a>
            <a href="#" className="hover:text-primary transition-colors">Smart Contracts</a>
            <a href="#" className="hover:text-primary transition-colors">Governance</a>
          </div>
          
          <div className="text-xs text-muted/50 font-mono">
            &copy; 2026 CIVIC LABS. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Landing;
