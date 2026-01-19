import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRightLeft, Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface TransferModalProps {
  totalValue: number;
  walletCount: number;
  onTransferAll: (destinationAddress: string) => Promise<void>;
  isTransferring: boolean;
}

export const TransferModal = ({ 
  totalValue, 
  walletCount, 
  onTransferAll, 
  isTransferring 
}: TransferModalProps) => {
  const [open, setOpen] = useState(false);
  const [destinationAddress, setDestinationAddress] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const isValidAddress = destinationAddress.match(/^0x[a-fA-F0-9]{40}$/);

  const handleTransfer = async () => {
    if (!isValidAddress || !confirmed) return;
    
    try {
      await onTransferAll(destinationAddress);
      toast({
        title: "Transfer Complete",
        description: `Successfully transferred all funds to ${destinationAddress.slice(0, 6)}...${destinationAddress.slice(-4)}`,
      });
      setOpen(false);
      setDestinationAddress('');
      setConfirmed(false);
    } catch (error) {
      toast({
        title: "Transfer Failed",
        description: "There was an error transferring funds. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) {
        setConfirmed(false);
      }
    }}>
      <DialogTrigger asChild>
        <Button variant="warning" className="gap-2" disabled={walletCount === 0 || totalValue === 0}>
          <ArrowRightLeft className="w-4 h-4" />
          RUGG ALL
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <ArrowRightLeft className="w-5 h-5 text-warning" />
            Bulk Transfer
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          {/* Warning Banner */}
          <div className="bg-warning/10 border border-warning/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-warning">Important Notice</p>
                <p className="text-xs text-warning/80 mt-1">
                  This will transfer ALL funds from {walletCount} wallet{walletCount !== 1 ? 's' : ''} 
                  (approximately ${totalValue.toLocaleString()}) to the destination address. 
                  This action cannot be undone.
                </p>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-secondary/50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Source Wallets</span>
              <span className="font-medium">{walletCount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Value</span>
              <span className="font-medium text-primary">${totalValue.toLocaleString()}</span>
            </div>
          </div>

          {/* Destination Input */}
          <div className="space-y-2">
            <Label htmlFor="destination">Destination Address</Label>
            <Input
              id="destination"
              placeholder="0x..."
              value={destinationAddress}
              onChange={(e) => setDestinationAddress(e.target.value)}
              className="bg-secondary border-border font-mono"
            />
            {destinationAddress && !isValidAddress && (
              <p className="text-xs text-destructive">Please enter a valid Ethereum address</p>
            )}
            {isValidAddress && (
              <p className="text-xs text-success flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Valid address
              </p>
            )}
          </div>

          {/* Confirmation Checkbox */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-border bg-secondary accent-primary"
            />
            <span className="text-sm text-muted-foreground">
              I understand that this will transfer all funds from all connected wallets to the destination address and this action cannot be reversed.
            </span>
          </label>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => setOpen(false)} 
              className="flex-1"
              disabled={isTransferring}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleTransfer}
              disabled={!isValidAddress || !confirmed || isTransferring}
              variant="warning"
              className="flex-1"
            >
              {isTransferring ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Transferring...
                </>
              ) : (
                'Transfer All Funds'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
