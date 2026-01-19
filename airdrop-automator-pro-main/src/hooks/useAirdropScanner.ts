import { useState, useCallback, useEffect } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { Wallet, Airdrop, ScanProgress } from '@/types/airdrop';
import { chainIdToName } from '@/lib/wagmi';

// Mock airdrop data generator
const generateMockAirdrops = (wallets: Wallet[]): Airdrop[] => {
  const mockTokens = [
    { name: 'Arbitrum', symbol: 'ARB', minValue: 100, maxValue: 500 },
    { name: 'Optimism', symbol: 'OP', minValue: 50, maxValue: 300 },
    { name: 'Blur', symbol: 'BLUR', minValue: 200, maxValue: 1000 },
    { name: 'Eigen Layer', symbol: 'EIGEN', minValue: 500, maxValue: 2000 },
    { name: 'LayerZero', symbol: 'ZRO', minValue: 150, maxValue: 600 },
    { name: 'Starknet', symbol: 'STRK', minValue: 80, maxValue: 400 },
    { name: 'zkSync', symbol: 'ZK', minValue: 100, maxValue: 450 },
    { name: 'Scroll', symbol: 'SCR', minValue: 60, maxValue: 250 },
  ];

  const airdrops: Airdrop[] = [];
  
  wallets.forEach(wallet => {
    // Randomly assign 1-3 airdrops per wallet
    const numAirdrops = Math.floor(Math.random() * 3) + 1;
    const shuffledTokens = [...mockTokens].sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < numAirdrops; i++) {
      const token = shuffledTokens[i];
      const value = Math.floor(Math.random() * (token.maxValue - token.minValue)) + token.minValue;
      const amount = Math.floor(value * (Math.random() * 10 + 5));
      
      airdrops.push({
        id: `${wallet.id}-${token.symbol}-${Date.now()}-${Math.random()}`,
        name: token.name,
        symbol: token.symbol,
        amount,
        value,
        walletId: wallet.id,
        walletAddress: wallet.address,
        chain: wallet.chain,
        status: 'pending',
      });
    }
  });

  return airdrops;
};

export const useAirdropScanner = () => {
  const { address, isConnected, connector } = useAccount();
  const chainId = useChainId();
  
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [airdrops, setAirdrops] = useState<Airdrop[]>([]);
  const [scanProgress, setScanProgress] = useState<ScanProgress>({
    isScanning: false,
    currentWallet: 0,
    totalWallets: 0,
    airdropsFound: 0,
  });
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);

  // Update wallets when account changes
  useEffect(() => {
    if (isConnected && address) {
      const chainName = chainIdToName[chainId] || 'ethereum';
      const connectorName = connector?.name || 'Connected Wallet';
      
      setWallets(prev => {
        // Check if wallet already exists
        const exists = prev.some(w => w.address.toLowerCase() === address.toLowerCase());
        if (exists) {
          // Update the chain if needed
          return prev.map(w => 
            w.address.toLowerCase() === address.toLowerCase()
              ? { ...w, chain: chainName }
              : w
          );
        }
        // Add new wallet
        return [...prev, {
          id: `${address}-${Date.now()}`,
          address,
          name: connectorName,
          chain: chainName,
          balance: 0, // Will be fetched by the card component
        }];
      });
    }
  }, [isConnected, address, chainId, connector]);

  // Remove wallet when disconnected
  useEffect(() => {
    if (!isConnected) {
      setWallets([]);
      setAirdrops([]);
    }
  }, [isConnected]);

  const startScan = useCallback(async () => {
    if (wallets.length === 0) return;

    setScanProgress({
      isScanning: true,
      currentWallet: 0,
      totalWallets: wallets.length,
      airdropsFound: 0,
    });
    setAirdrops([]);

    // Simulate scanning each wallet
    const newAirdrops = generateMockAirdrops(wallets);
    
    for (let i = 0; i < wallets.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const walletAirdrops = newAirdrops.filter(a => a.walletId === wallets[i].id);
      
      setScanProgress(prev => ({
        ...prev,
        currentWallet: i + 1,
        airdropsFound: prev.airdropsFound + walletAirdrops.length,
      }));
      
      setAirdrops(prev => [...prev, ...walletAirdrops]);
    }

    setScanProgress(prev => ({
      ...prev,
      isScanning: false,
    }));
  }, [wallets]);

  const claimAirdrop = useCallback(async (id: string) => {
    setAirdrops(prev => 
      prev.map(a => a.id === id ? { ...a, status: 'claiming' as const } : a)
    );

    await new Promise(resolve => setTimeout(resolve, 2000));

    setAirdrops(prev => 
      prev.map(a => a.id === id ? { ...a, status: 'claimed' as const } : a)
    );
  }, []);

  const sellAirdrop = useCallback(async (id: string) => {
    setAirdrops(prev => 
      prev.map(a => a.id === id ? { ...a, status: 'claiming' as const } : a)
    );

    await new Promise(resolve => setTimeout(resolve, 1500));

    setAirdrops(prev => 
      prev.map(a => a.id === id ? { ...a, status: 'sold' as const } : a)
    );
  }, []);

  // Claim all pending airdrops SIMULTANEOUSLY across all wallets
  const claimAllAirdrops = useCallback(async () => {
    const pendingAirdrops = airdrops.filter(a => a.status === 'pending');
    if (pendingAirdrops.length === 0) return;

    setIsBatchProcessing(true);
    
    // Set all to claiming state simultaneously
    setAirdrops(prev => 
      prev.map(a => a.status === 'pending' ? { ...a, status: 'claiming' as const } : a)
    );

    // Simulate parallel claiming (all at once)
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Set all to claimed state simultaneously
    setAirdrops(prev => 
      prev.map(a => a.status === 'claiming' ? { ...a, status: 'claimed' as const } : a)
    );

    setIsBatchProcessing(false);
  }, [airdrops]);

  // Sell all claimed airdrops SIMULTANEOUSLY across all wallets
  const sellAllAirdrops = useCallback(async () => {
    const claimedAirdrops = airdrops.filter(a => a.status === 'claimed');
    if (claimedAirdrops.length === 0) return;

    setIsBatchProcessing(true);
    
    // Set all claimed to "selling" state (reusing claiming for animation)
    setAirdrops(prev => 
      prev.map(a => a.status === 'claimed' ? { ...a, status: 'claiming' as const } : a)
    );

    // Simulate parallel selling (all at once)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Set all to sold state simultaneously
    setAirdrops(prev => 
      prev.map(a => a.status === 'claiming' ? { ...a, status: 'sold' as const } : a)
    );

    setIsBatchProcessing(false);
  }, [airdrops]);

  // One-click: Claim ALL then Sell ALL simultaneously
  const claimAndSellAll = useCallback(async () => {
    const pendingAirdrops = airdrops.filter(a => a.status === 'pending');
    const alreadyClaimed = airdrops.filter(a => a.status === 'claimed');
    
    if (pendingAirdrops.length === 0 && alreadyClaimed.length === 0) return;

    setIsBatchProcessing(true);

    // Step 1: Claim all pending simultaneously
    if (pendingAirdrops.length > 0) {
      setAirdrops(prev => 
        prev.map(a => a.status === 'pending' ? { ...a, status: 'claiming' as const } : a)
      );
      await new Promise(resolve => setTimeout(resolve, 2500));
      setAirdrops(prev => 
        prev.map(a => a.status === 'claiming' ? { ...a, status: 'claimed' as const } : a)
      );
    }

    // Step 2: Sell all claimed simultaneously
    setAirdrops(prev => 
      prev.map(a => a.status === 'claimed' ? { ...a, status: 'claiming' as const } : a)
    );
    await new Promise(resolve => setTimeout(resolve, 2000));
    setAirdrops(prev => 
      prev.map(a => a.status === 'claiming' ? { ...a, status: 'sold' as const } : a)
    );

    setIsBatchProcessing(false);
  }, [airdrops]);

  // Transfer all funds to a destination address
  const transferAll = useCallback(async (destinationAddress: string) => {
    setIsTransferring(true);
    
    // Simulate transferring from all wallets
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // In a real implementation, this would:
    // 1. Loop through all connected wallets
    // 2. Send transactions to transfer ETH/tokens to destination
    // 3. Handle gas estimation and confirmations
    
    setIsTransferring(false);
  }, []);

  const stats = {
    totalWallets: wallets.length,
    totalAirdrops: airdrops.length,
    totalValue: airdrops.reduce((sum, a) => sum + a.value, 0),
    pendingClaims: airdrops.filter(a => a.status === 'pending').length,
    soldValue: airdrops.filter(a => a.status === 'sold').reduce((sum, a) => sum + a.value, 0),
    totalWalletBalance: 0, // Would be calculated from actual balances
  };

  return {
    wallets,
    airdrops,
    scanProgress,
    stats,
    isBatchProcessing,
    isTransferring,
    isConnected,
    startScan,
    claimAirdrop,
    sellAirdrop,
    claimAllAirdrops,
    sellAllAirdrops,
    claimAndSellAll,
    transferAll,
  };
};
