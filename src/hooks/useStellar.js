import { useState, useEffect } from 'react';
import { isConnected, getAddress, signTransaction } from '@stellar/freighter-api';
import { Horizon, TransactionBuilder, Networks, BASE_FEE, Asset, Operation } from 'stellar-sdk';

const TESTNET_URL = 'https://horizon-testnet.stellar.org';
const server = new Horizon.Server(TESTNET_URL);

export function useStellar() {
  const [address, setAddress] = useState(null);
  const [balance, setBalance] = useState('0');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if previously connected
    const checkConnection = async () => {
      try {
        if (await isConnected()) {
          const key = await getAddress();
          if (key) {
             // getAddress returns an object { address: string } or string depending on version, 
             // but usually strictly string in v2+. Wait, let's allow flexibility or just use result.
             // Actually currently getAddress() returns a string promise in most docs.
             // If it returns object: const { address } = await getAddress();
             // Let's assume string for now based on previous simple usage, OR handle object.
             // Safe way:
             const addr = typeof key === 'object' ? key.address : key;
             setAddress(addr);
             fetchBalance(addr);
          }
        }
      } catch (err) {
        console.error("Failed to check connection", err);
      }
    };
    checkConnection();
  }, []);

  const fetchBalance = async (publicKey) => {
    if (!publicKey || typeof publicKey !== 'string') {
        console.warn("Invalid public key for balance fetch:", publicKey);
        return;
    }
    
    try {
      const account = await server.loadAccount(publicKey);
      const xlmBalance = account.balances.find((b) => b.asset_type === 'native');
      setBalance(xlmBalance ? xlmBalance.balance : '0');
    } catch (err) {
      if (err.response && (err.response.status === 404 || err.response.status === 400)) {
         // 404: Account not funded yet
         // 400: Malformed key or other bad request (safely assume 0 balance to avoid crash)
         setBalance('0');
      } else {
        console.error("Failed to fetch balance", err);
        setBalance('0');
      }
    }
  };

  const connectWallet = async () => {
    setIsConnecting(true);
    setError(null);
    try {
      const connected = await isConnected();
      if (!connected) {
        // Freighter not installed or not active
        setError("Freighter wallet not found. Please install it.");
        setIsConnecting(false);
        return;
      }
      
      const key = await getAddress();
      const addr = typeof key === 'object' ? key.address : key;
      setAddress(addr);
      await fetchBalance(addr);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsConnecting(false);
    }
  };

  const sendPayment = async (destination, amount, memo) => {
    setError(null);
    try {
      if (!address) throw new Error("Wallet not connected");
      
      const account = await server.loadAccount(address);
      const transaction = new TransactionBuilder(account, {
        fee: BASE_FEE,
        networkPassphrase: Networks.TESTNET
      })
      .addOperation(Operation.payment({
        destination: destination,
        asset: Asset.native(),
        amount: amount.toString()
      }))
      .setTimeout(30)
      .build();

      const signedXdr = await signTransaction(transaction.toXDR(), { network: "TESTNET" });
      
      if (signedXdr) {
        const result = await server.submitTransaction(TransactionBuilder.fromXDR(signedXdr, Networks.TESTNET));
        await fetchBalance(address); // Refresh balance
        return result;
      } else {
        throw new Error("User rejected transaction");
      }
    } catch (err) {
      console.error("Payment failed", err);
      // Construct a meaningful error message
      let msg = err.message || "Transaction failed";
      if (err.response && err.response.data && err.response.data.extras && err.response.data.extras.result_codes) {
        msg += `: ${err.response.data.extras.result_codes.transaction}`;
      }
      throw new Error(msg);
    }
  };

  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  };

  return {
    address,
    balance,
    isConnecting,
    error,
    connectWallet,
    sendPayment,
    formatAddress
  };
}
