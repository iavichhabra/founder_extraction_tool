import { http, createConfig } from 'wagmi';
import { mainnet, polygon, arbitrum, optimism, base, bsc } from 'wagmi/chains';
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors';

const projectId = 'demo-project-id'; // Replace with actual WalletConnect project ID for production

export const config = createConfig({
  chains: [mainnet, polygon, arbitrum, optimism, base, bsc],
  connectors: [
    injected(),
    walletConnect({ projectId }),
    coinbaseWallet({ appName: 'Founder Extractor' }),
  ],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
    [optimism.id]: http(),
    [base.id]: http(),
    [bsc.id]: http(),
  },
});

export const chainIdToName: Record<number, string> = {
  1: 'ethereum',
  137: 'polygon',
  42161: 'arbitrum',
  10: 'optimism',
  8453: 'base',
  56: 'bsc',
};

export const supportedChains = [
  { id: 1, name: 'Ethereum', icon: '⟠' },
  { id: 137, name: 'Polygon', icon: '⬡' },
  { id: 42161, name: 'Arbitrum', icon: '🔵' },
  { id: 10, name: 'Optimism', icon: '🔴' },
  { id: 8453, name: 'Base', icon: '🔷' },
  { id: 56, name: 'BSC', icon: '💛' },
];
