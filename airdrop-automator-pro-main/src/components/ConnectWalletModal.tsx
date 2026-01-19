import { useState } from 'react';
import { useConnect, useAccount, useDisconnect } from 'wagmi';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Wallet, Loader2, FileText } from 'lucide-react';
import { toast } from 'sonner';

export const ConnectWalletModal = () => {
  const [open, setOpen] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [seedPhrases, setSeedPhrases] = useState('');
  const { connectors, connect, isPending } = useConnect();
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const getConnectorIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'metamask':
        return '🦊';
      case 'walletconnect':
        return '🔗';
      case 'coinbase wallet':
        return '💰';
      case 'injected':
        return '💉';
      default:
        return '🔌';
    }
  };

  const getConnectorLabel = (name: string) => {
    if (name.toLowerCase() === 'injected') return 'Browser Wallet';
    return name;
  };

  const handleBulkImport = () => {
    const phrases = seedPhrases.split('\n').filter(p => p.trim().length > 0);
    if (phrases.length === 0) {
      toast.error('Please enter at least one seed phrase');
      return;
    }
    // Placeholder - just show success toast
    toast.success(`${phrases.length} wallet(s) queued for import`);
    setSeedPhrases('');
    setShowBulkImport(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setShowBulkImport(false); }}>
      <DialogTrigger asChild>
        <Button variant="cyber" className="gap-2">
          <Wallet className="w-4 h-4" />
          {isConnected ? 'Connect More' : 'Connect Wallet'}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Wallet className="w-5 h-5 text-primary" />
            {showBulkImport ? 'Bulk Import Wallets' : 'Connect Your Wallet'}
          </DialogTitle>
        </DialogHeader>
        
        {showBulkImport ? (
          <div className="space-y-4 mt-4">
            <p className="text-sm text-muted-foreground">
              Paste multiple seed phrases below, one per line. Each wallet will be imported automatically.
            </p>
            <Textarea
              placeholder="Enter seed phrases (one per line)&#10;&#10;word1 word2 word3 ... word12&#10;word1 word2 word3 ... word12"
              value={seedPhrases}
              onChange={(e) => setSeedPhrases(e.target.value)}
              className="min-h-[150px] font-mono text-sm bg-background/50"
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowBulkImport(false)}
              >
                Back
              </Button>
              <Button
                variant="cyber"
                className="flex-1"
                onClick={handleBulkImport}
              >
                Import All
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3 mt-4">
            <p className="text-sm text-muted-foreground mb-4">
              Select a wallet provider to connect. You can connect multiple wallets to scan them all for airdrops.
            </p>
            {connectors.map((connector) => (
              <Button
                key={connector.uid}
                variant="outline"
                className="w-full justify-start gap-3 h-14 text-left"
                onClick={() => {
                  connect({ connector });
                  setOpen(false);
                }}
                disabled={isPending}
              >
                <span className="text-2xl">{getConnectorIcon(connector.name)}</span>
                <div className="flex flex-col items-start">
                  <span className="font-medium">{getConnectorLabel(connector.name)}</span>
                  <span className="text-xs text-muted-foreground">
                    {connector.name === 'WalletConnect' ? 'Scan QR code' : 'Connect directly'}
                  </span>
                </div>
                {isPending && <Loader2 className="w-4 h-4 ml-auto animate-spin" />}
              </Button>
            ))}
            
            <div className="pt-4 border-t border-border">
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-14 text-left border-dashed"
                onClick={() => setShowBulkImport(true)}
              >
                <span className="text-2xl">📝</span>
                <div className="flex flex-col items-start">
                  <span className="font-medium">Bulk Import</span>
                  <span className="text-xs text-muted-foreground">
                    Import multiple wallets via seed phrases
                  </span>
                </div>
                <FileText className="w-4 h-4 ml-auto text-muted-foreground" />
              </Button>
            </div>
            
            {isConnected && (
              <div className="pt-4 border-t border-border">
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => {
                    disconnect();
                    setOpen(false);
                  }}
                >
                  Disconnect All Wallets
                </Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};