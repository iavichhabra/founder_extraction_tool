import { Airdrop } from '@/types/airdrop';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, Clock, Loader2, DollarSign, AlertCircle, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AirdropTableProps {
  airdrops: Airdrop[];
  onClaim: (id: string) => void;
  onSell: (id: string) => void;
  onClaimAll: () => void;
  onSellAll: () => void;
  onClaimAndSellAll: () => void;
  isBatchProcessing: boolean;
}

const statusConfig = {
  pending: { icon: Clock, label: 'Pending', className: 'bg-warning/20 text-warning border-warning/30' },
  claiming: { icon: Loader2, label: 'Claiming', className: 'bg-primary/20 text-primary border-primary/30' },
  claimed: { icon: CheckCircle, label: 'Claimed', className: 'bg-success/20 text-success border-success/30' },
  sold: { icon: DollarSign, label: 'Sold', className: 'bg-accent/20 text-accent border-accent/30' },
  failed: { icon: AlertCircle, label: 'Failed', className: 'bg-destructive/20 text-destructive border-destructive/30' },
};

export const AirdropTable = ({ airdrops, onClaim, onSell, onClaimAll, onSellAll, onClaimAndSellAll, isBatchProcessing }: AirdropTableProps) => {
  const truncateAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`;
  
  const pendingCount = airdrops.filter(a => a.status === 'pending').length;
  const claimedCount = airdrops.filter(a => a.status === 'claimed').length;
  const totalValue = airdrops.reduce((sum, a) => sum + a.value, 0);
  const actionableCount = pendingCount + claimedCount;

  return (
    <div className="card-cyber rounded-xl overflow-hidden">
      <div className="p-4 border-b border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold text-foreground">Discovered Airdrops</h3>
          <p className="text-sm text-muted-foreground">
            {airdrops.length} airdrops found • ${totalValue.toLocaleString()} total value
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClaimAll}
            disabled={pendingCount === 0 || isBatchProcessing}
          >
            {isBatchProcessing ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : null}
            Claim All ({pendingCount})
          </Button>
          <Button 
            variant="success" 
            size="sm" 
            onClick={onSellAll}
            disabled={claimedCount === 0 || isBatchProcessing}
          >
            {isBatchProcessing ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : null}
            Sell All ({claimedCount})
          </Button>
          <Button 
            variant="cyber" 
            size="sm" 
            onClick={onClaimAndSellAll}
            disabled={actionableCount === 0 || isBatchProcessing}
            className="font-bold"
          >
            {isBatchProcessing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <DollarSign className="w-4 h-4 mr-1" />}
            Extract All (${totalValue.toLocaleString()})
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">Token</TableHead>
              <TableHead className="text-muted-foreground">Amount</TableHead>
              <TableHead className="text-muted-foreground">Value</TableHead>
              <TableHead className="text-muted-foreground">Wallet</TableHead>
              <TableHead className="text-muted-foreground">Chain</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {airdrops.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                  No airdrops found. Start a scan to discover available airdrops.
                </TableCell>
              </TableRow>
            ) : (
              airdrops.map((airdrop) => {
                const status = statusConfig[airdrop.status];
                const StatusIcon = status.icon;
                
                return (
                  <TableRow key={airdrop.id} className="border-border">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-xs font-bold">
                          {airdrop.symbol.slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{airdrop.name}</p>
                          <p className="text-xs text-muted-foreground">{airdrop.symbol}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-foreground">
                      {airdrop.amount.toLocaleString()}
                    </TableCell>
                    <TableCell className="font-mono text-success">
                      ${airdrop.value.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <code className="text-xs font-mono text-muted-foreground bg-secondary px-2 py-1 rounded">
                        {truncateAddress(airdrop.walletAddress)}
                      </code>
                    </TableCell>
                    <TableCell>
                      <span className="capitalize text-sm text-foreground">{airdrop.chain}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn("gap-1 border", status.className)}>
                        <StatusIcon className={cn("w-3 h-3", airdrop.status === 'claiming' && "animate-spin")} />
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {airdrop.status === 'pending' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => onClaim(airdrop.id)}
                          >
                            Claim
                          </Button>
                        )}
                        {airdrop.status === 'claimed' && (
                          <Button 
                            size="sm" 
                            variant="success"
                            onClick={() => onSell(airdrop.id)}
                          >
                            Sell
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
