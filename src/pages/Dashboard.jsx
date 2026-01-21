import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Clock, Filter, Plus } from 'lucide-react';
import { MOCK_BOUNTIES } from '../utils/mockData';
import { useStellar } from '../hooks/useStellar';

const Dashboard = () => {
  const { address } = useStellar();
  const [activeTab, setActiveTab] = useState('find'); // find, created, claimed
  const [filter, setFilter] = useState('ALL');

  const filteredBounties = MOCK_BOUNTIES.filter(bounty => {
    // Tab logic
    if (activeTab === 'created') {
      if (!address) return false; 
      return bounty.creator === 'GB7B...2D4S'; 
    }
    if (activeTab === 'claimed') {
      if (!address) return false;
      return bounty.worker === 'GA55...HH12'; 
    }
    return bounty.status === 'OPEN';
  }).filter(bounty => {
    if (filter === 'ALL') return true;
    return bounty.status === filter;
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'OPEN': return 'bg-primary text-black shadow-glow';
      case 'CLAIMED': return 'bg-secondary text-white shadow-[0_0_10px_rgba(255,0,255,0.5)]';
      case 'VERIFIED': return 'bg-accent text-black shadow-[0_0_10px_rgba(57,255,20,0.5)]';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="container mx-auto px-6 pt-24 pb-16 min-h-screen">
      <header className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-2 font-display uppercase">Community <span className="text-primary">Bounties</span></h1>
          <p className="text-muted text-lg max-w-xl">Find tasks, fund projects, and improve your neighborhood.</p>
        </div>
        <Link to="/create" className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          Create Bounty
        </Link>
      </header>

      {/* Tabs */}
      <div className="flex gap-8 mb-8 border-b border-glass-border pb-4 overflow-x-auto">
        {[
          { id: 'find', label: 'Find Work' },
          { id: 'created', label: 'Created by Me' },
          { id: 'claimed', label: 'My Tasks' }
        ].map(tab => (
          <button 
            key={tab.id}
            className={`font-display text-lg px-2 relative transition-colors whitespace-nowrap ${
              activeTab === tab.id ? 'text-text' : 'text-muted hover:text-text'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute -bottom-[17px] left-0 w-full h-0.5 bg-primary shadow-glow" />
            )}
          </button>
        ))}
      </div>

      {/* Filters (Optional) */}
      <div className="glass-panel w-fit px-6 py-4 mb-8 flex items-center gap-4">
        <Filter size={16} className="text-muted" />
        <span className="font-display font-semibold text-muted">Status:</span>
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          className="bg-transparent border border-glass-border text-text px-2 py-1 rounded font-sans focus:outline-none focus:border-primary"
        >
          <option className="bg-card text-text" value="ALL">All Status</option>
          <option className="bg-card text-text" value="OPEN">Open</option>
          <option className="bg-card text-text" value="CLAIMED">Claimed</option>
          <option className="bg-card text-text" value="VERIFIED">Verified</option>
        </select>
      </div>

      {/* Bounty Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {filteredBounties.length > 0 ? (
          filteredBounties.map((bounty) => (
            <motion.div key={bounty.id} variants={item}>
              <Link to={`/bounty/${bounty.id}`} className="block h-full group">
                <div className="glass-panel h-full flex flex-col overflow-hidden transition-all duration-300 ease-out group-hover:-translate-y-1 group-hover:border-primary group-hover:shadow-glow">
                  <div className="h-48 bg-cover bg-center relative" style={{ backgroundImage: `url(${bounty.image})` }}>
                    <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(bounty.status)}`}>
                      {bounty.status}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold leading-tight mr-4">{bounty.title}</h3>
                      <div className="font-display text-2xl font-bold text-primary whitespace-nowrap drop-shadow-glow-primary">
                        {bounty.reward} <span className="text-sm font-medium">{bounty.currency}</span>
                      </div>
                    </div>
                    <p className="text-muted text-sm mb-6 flex-grow">{bounty.description.substring(0, 80)}...</p>
                    
                    <div className="flex justify-between items-center pt-4 border-t border-glass-border text-muted text-xs">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} />
                        <span>{bounty.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={14} />
                        <span>2 days ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-16 text-center bg-glass-bg rounded-xl text-muted">
            <p className="text-lg">No bounties found in this category.</p>
            {activeTab !== 'find' && !address && (
              <p className="text-sm mt-2">Connect wallet to view your history.</p>
            )}
            {activeTab === 'created' && address && (
              <Link to="/create" className="text-primary mt-2 inline-block hover:underline">Create your first bounty</Link>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;
