import { Copy, ExternalLink, Power } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useDisconnect, useBalance } from 'wagmi';
import { chainIdToName } from '@/lib/wagmi';
import { formatEther } from 'viem';

interface ConnectedWalletCardProps {
  address: `0x${string}`;
  chainId: number;
  connectorName: string;
  isScanning?: boolean;
}

const chainColors: Record<string, string> = {
  ethereum: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  polygon: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  arbitrum: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
  optimism: 'bg-red-500/20 text-red-400 border-red-500/30',
  base: 'bg-blue-600/20 text-blue-300 border-blue-600/30',
  bsc: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
};

const chainExplorers: Record<string, string> = {
  ethereum: 'https://etherscan.io',
  polygon: 'https://polygonscan.com',
  arbitrum: 'https://arbiscan.io',
  optimism: 'https://optimistic.etherscan.io',
  base: 'https://basescan.org',
  bsc: 'https://bscscan.com',
};

export const ConnectedWalletCard = ({ 
  address, 
  chainId, 
  connectorName,
  isScanning 
}: ConnectedWalletCardProps) => {
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({ address, chainId });
  
  const chainName = chainIdToName[chainId] || 'unknown';
  const explorer = chainExplorers[chainName] || 'https://etherscan.io';
  
  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    toast({
      title: "Address Copied",
      description: "Wallet address copied to clipboard",
    });
  };

  const formattedBalance = balance 
    ? parseFloat(formatEther(balance.value)).toFixed(4)
    : '0.0000';

  return (
    <div className={cn(
      "card-cyber rounded-xl p-4 transition-all duration-300",
      isScanning && "pulse-glow"
    )}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="font-medium text-foreground">{connectorName}</span>
          <span className={cn(
            "text-xs px-2 py-0.5 rounded-full border capitalize",
            chainColors[chainName] || 'bg-secondary text-secondary-foreground'
          )}>
            {chainName}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => disconnect()}
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          title="Disconnect wallet"
        >
          <Power className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="flex items-center gap-2 mb-3">
        <code className="font-mono text-sm text-primary bg-primary/10 px-3 py-1.5 rounded-lg flex-1">
          {truncateAddress(address)}
        </code>
        <Button variant="ghost" size="icon" onClick={copyAddress} className="h-8 w-8">
          <Copy className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" asChild className="h-8 w-8">
          <a href={`${explorer}/address/${address}`} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-4 h-4" />
          </a>
        </Button>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Balance</span>
        <span className="font-mono text-foreground">
          {formattedBalance} {balance?.symbol || 'ETH'}
        </span>
      </div>

      {isScanning && (
        <div className="mt-3 relative overflow-hidden h-1 bg-secondary rounded-full">
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary animate-shimmer" 
               style={{ backgroundSize: '200% 100%' }} />
        </div>
      )}
    </div>
  );
};
