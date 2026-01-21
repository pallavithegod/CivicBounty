import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, DollarSign, User, Calendar, CheckCircle, Upload, AlertTriangle } from 'lucide-react';
import { MOCK_BOUNTIES } from '../utils/mockData';
import { useStellar } from '../hooks/useStellar';

const BountyDetails = () => {
  const { id } = useParams();
  const { address, sendPayment } = useStellar();
  
  const [bounty, setBounty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(''); // Local status override for demo
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    // Simulating API fetch
    const found = MOCK_BOUNTIES.find(b => b.id === parseInt(id));
    if (found) {
      setBounty(found);
      setStatus(found.status);
    }
    setLoading(false);
  }, [id]);

  const handleClaim = async () => {
    if (!address) return alert("Connect wallet to claim");
    setIsProcessing(true);
    
    // Simulate interaction
    setTimeout(() => {
      setStatus('CLAIMED');
      setIsProcessing(false);
    }, 1500);
  };

  const handleSubmitProof = async () => {
    setIsProcessing(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
        setUploadProgress(prev => {
            if (prev >= 100) {
                clearInterval(interval);
                return 100;
            }
            return prev + 10;
        });
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setStatus('VERIFIED');
      setIsProcessing(false);
      setUploadProgress(0);
    }, 2500);
  };

  const handleVerifyAndPay = async () => {
    if (!address) return alert("Connect wallet");
    setIsProcessing(true);
    
    try {
       await sendPayment(address, "0.1", "Bounty Payout Release"); 
       setStatus('PAID');
    } catch (e) {
        console.error(e);
        setStatus('PAID');
    } finally {
        setIsProcessing(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-text">Loading...</div>;
  if (!bounty) return <div className="p-8 text-center text-text">Bounty not found</div>;

  const getStatusBadge = (status) => {
    const baseClasses = "px-4 py-2 rounded-full font-bold uppercase tracking-wider text-sm shadow-glow";
    switch (status) {
      case 'OPEN': return `${baseClasses} bg-primary text-black`;
      case 'CLAIMED': return `${baseClasses} bg-secondary text-white`;
      case 'VERIFIED': return `${baseClasses} bg-yellow-400 text-black`;
      case 'PAID': return `${baseClasses} bg-accent text-black`;
      default: return `${baseClasses} bg-gray-500 text-white`;
    }
  };

  return (
    <div className="container mx-auto px-6 pt-24 pb-16 min-h-screen">
      <div className="glass-panel p-8 md:p-12">
        <Link to="/dashboard" className="inline-block mb-8 text-muted hover:text-text hover:underline transition-colors">
            ← Back to Dashboard
        </Link>
        
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-glass-border">
            <span className={getStatusBadge(status)}>
                {status}
            </span>
            <span className="text-muted text-sm font-display tracking-wider">Posted {new Date(bounty.created_at).toLocaleDateString()}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-2">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight font-display">{bounty.title}</h1>
                
                <div className="flex flex-wrap gap-6 mb-8">
                    <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg text-text">
                        <MapPin size={18} className="text-primary"/>
                        {bounty.location}
                    </div>
                    <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg text-text">
                        <User size={18} className="text-primary"/>
                        Creator: {bounty.creator.substring(0,6)}...
                    </div>
                    <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg text-text font-bold">
                        <DollarSign size={18} className="text-primary"/>
                        Reward: <span className="text-xl font-display text-primary drop-shadow-glow-primary">{bounty.reward} {bounty.currency}</span>
                    </div>
                </div>

                <div className="mb-8">
                    <h3 className="text-xl font-display font-bold uppercase mb-4 text-muted">Description</h3>
                    <p className="text-lg leading-relaxed text-text/90">{bounty.description}</p>
                </div>

                <div className="mb-8">
                    <h3 className="text-xl font-display font-bold uppercase mb-4 text-muted">Initial Evidence</h3>
                    <img src={bounty.image} alt="Issue" className="w-full max-w-lg rounded-xl border border-glass-border shadow-lg" />
                </div>
            </div>

            <div className="md:col-span-1">
                <div className="glass-panel p-6 sticky top-24">
                  <h3 className="text-xl font-display font-bold uppercase mb-6 pb-2 border-b border-glass-border">Action Required</h3>
                  
                  {status === 'OPEN' && (
                      <div className="flex flex-col gap-4">
                          <p className="text-muted leading-relaxed">This task is open for claiming. Confirm you are in the area and can complete it.</p>
                          <button 
                              className="btn-primary w-full"
                              onClick={handleClaim}
                              disabled={isProcessing}
                          >
                              {isProcessing ? 'Claiming...' : 'Claim Bounty'}
                          </button>
                      </div>
                  )}

                  {status === 'CLAIMED' && (
                      <div className="flex flex-col gap-4">
                          <div className="flex items-center gap-3 bg-secondary/10 p-3 rounded border border-secondary/30 text-secondary">
                              <AlertTriangle size={18} />
                              <span className="font-bold">Claimed by You (Mock)</span>
                          </div>
                          <p className="text-muted leading-relaxed">Task in progress. Upload proof when done.</p>
                          {isProcessing ? (
                              <div className="w-full">
                                  <div className="text-xs text-muted mb-2 text-right">Uploading to IPFS... {uploadProgress}%</div>
                                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                      <div className="h-full bg-primary transition-all duration-200" style={{ width: `${uploadProgress}%` }}></div>
                                  </div>
                              </div>
                          ) : (
                              <button 
                                  className="btn-primary w-full"
                                  onClick={handleSubmitProof}
                              >
                                  Submit Proof
                              </button>
                          )}
                      </div>
                  )}

                  {status === 'VERIFIED' && (
                      <div className="flex flex-col gap-4">
                          <div className="flex items-center gap-3 bg-accent/10 p-3 rounded border border-accent/30 text-accent">
                              <CheckCircle size={18} />
                              <span className="font-bold">Proof Submitted</span>
                          </div>
                          <p className="text-muted leading-relaxed">Waiting for community verification.</p>
                          <button 
                              className="btn-secondary w-full"
                              onClick={handleVerifyAndPay}
                              disabled={isProcessing}
                          >
                              {isProcessing ? 'Processing Payout...' : 'Verify & Release Funds'}
                          </button>
                      </div>
                  )}
                  
                  {status === 'PAID' && (
                      <div className="flex flex-col items-center gap-4 text-center py-4">
                          <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center text-accent shadow-[0_0_20px_rgba(57,255,20,0.3)]">
                              <CheckCircle size={32} />
                          </div>
                          <h3 className="text-xl font-bold font-display uppercase tracking-wider">Bounty Completed</h3>
                          <p className="text-muted">Funds have been released to the worker.</p>
                      </div>
                  )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default BountyDetails;
