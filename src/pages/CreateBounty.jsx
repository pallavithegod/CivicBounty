import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, MapPin, DollarSign, AlertCircle, CheckCircle } from 'lucide-react';
import { useStellar } from '../hooks/useStellar';

const CreateBounty = () => {
  const { address, sendPayment, connectWallet } = useStellar();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    reward: '',
    location: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [txStatus, setTxStatus] = useState(null); 
  const [txHash, setTxHash] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!address) {
      alert("Please connect your wallet first.");
      return;
    }

    setIsSubmitting(true);
    setTxStatus('pending');

    try {
      const result = await sendPayment(address, formData.reward, "Bounty Creation");
      setTxHash(result.hash);
      setTxStatus('success');
      setTimeout(() => navigate('/dashboard'), 3000);
    } catch (err) {
      console.error(err);
      setTxStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!address) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex-center">
        <div className="glass-panel p-12 text-center max-w-lg">
          <AlertCircle size={48} className="text-secondary mb-4 mx-auto" />
          <h2 className="text-2xl font-bold mb-4 font-display uppercase">Connect Wallet Required</h2>
          <p className="mb-8 text-muted">You must connect your Stellar wallet to create a bounty and fund the smart contract.</p>
          <button className="btn-primary" onClick={connectWallet}>Connect Wallet</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 flex justify-center container mx-auto px-6">
      <motion.div 
        className="w-full max-w-2xl bg-card border border-glass-border p-10 rounded-xl"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <h1 className="text-3xl font-bold mb-8 pb-4 border-b border-glass-border font-display uppercase tracking-wide">
          Create <span className="text-primary drop-shadow-glow-primary">Bounty</span>
        </h1>
        
        {txStatus === 'success' ? (
          <div className="py-8 text-center">
            <CheckCircle size={64} className="text-accent mx-auto mb-4 drop-shadow-[0_0_10px_rgba(57,255,20,0.5)]" />
            <h2 className="text-2xl text-accent font-bold mb-2 font-display">Bounty Funded!</h2>
            <p className="text-muted mb-6">Transaction Hash: <br/><span className="font-mono text-xs break-all">{txHash}</span></p>
            <p className="text-text animate-pulse">Redirecting to dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 text-sm text-muted uppercase tracking-widest">Issue Title</label>
              <input 
                type="text" 
                name="title" 
                placeholder="e.g. Broken Streetlight on 5th" 
                required 
                value={formData.title}
                onChange={handleChange}
                className="w-full bg-white/5 border border-glass-border p-3 rounded-lg text-text font-sans focus:outline-none focus:border-primary focus:shadow-[0_0_10px_rgba(0,243,255,0.2)] transition-all"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-muted uppercase tracking-widest">Description</label>
              <textarea 
                name="description" 
                placeholder="Describe the issue in detail..." 
                rows={4}
                required
                value={formData.description}
                onChange={handleChange}
                className="w-full bg-white/5 border border-glass-border p-3 rounded-lg text-text font-sans focus:outline-none focus:border-primary focus:shadow-[0_0_10px_rgba(0,243,255,0.2)] transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 text-sm text-muted uppercase tracking-widest">Location</label>
                <div className="relative">
                  <MapPin size={18} className="absolute top-1/2 left-4 -translate-y-1/2 text-muted" />
                  <input 
                    type="text" 
                    name="location" 
                    placeholder="City, Street or Geo" 
                    required 
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full pl-11 bg-white/5 border border-glass-border p-3 rounded-lg text-text font-sans focus:outline-none focus:border-primary focus:shadow-[0_0_10px_rgba(0,243,255,0.2)] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm text-muted uppercase tracking-widest">Bounty Reward (XLM)</label>
                <div className="relative">
                  <DollarSign size={18} className="absolute top-1/2 left-4 -translate-y-1/2 text-muted" />
                  <input 
                    type="number" 
                    name="reward" 
                    placeholder="0.00" 
                    step="0.1"
                    min="1"
                    required 
                    value={formData.reward}
                    onChange={handleChange}
                    className="w-full pl-11 bg-white/5 border border-glass-border p-3 rounded-lg text-text font-sans focus:outline-none focus:border-primary focus:shadow-[0_0_10px_rgba(0,243,255,0.2)] transition-all"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm text-muted uppercase tracking-widest">Evidence (Image)</label>
              <div className="border border-dashed border-glass-border p-8 rounded-lg flex flex-col items-center gap-4 text-muted cursor-pointer hover:border-primary hover:text-text transition-all relative group">
                <Upload size={24} className="group-hover:text-primary transition-colors" />
                <span>Click to upload or drag image here</span>
                <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              </div>
            </div>

            {txStatus === 'error' && (
              <div className="flex items-center gap-2 text-red-500 bg-red-500/10 p-3 rounded border border-red-500/20">
                <AlertCircle size={16} />
                <span>Transaction failed. Ensure you have testnet XLM.</span>
              </div>
            )}

            <div className="flex justify-end items-center gap-6 mt-8">
              <button type="button" className="text-muted hover:text-text uppercase tracking-widest text-sm font-medium" onClick={() => navigate('/dashboard')}>
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn-primary" 
                disabled={isSubmitting || txStatus === 'pending'}
              >
                {isSubmitting ? 'Processing Transaction...' : 'Mint Bounty & Fund'}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default CreateBounty;
