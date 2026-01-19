export interface Wallet {
  id: string;
  address: string;
  name: string;
  chain: string;
  balance: number;
}

export interface Airdrop {
  id: string;
  name: string;
  symbol: string;
  amount: number;
  value: number;
  walletId: string;
  walletAddress: string;
  chain: string;
  status: 'pending' | 'claiming' | 'claimed' | 'sold' | 'failed';
  claimDeadline?: string;
  logo?: string;
}

export interface ScanProgress {
  isScanning: boolean;
  currentWallet: number;
  totalWallets: number;
  airdropsFound: number;
}
