import { ScanProgress as ScanProgressType } from '@/types/airdrop';
import { Progress } from '@/components/ui/progress';
import { Radar, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScanProgressProps {
  progress: ScanProgressType;
}

export const ScanProgress = ({ progress }: ScanProgressProps) => {
  const percentage = progress.totalWallets > 0 
    ? (progress.currentWallet / progress.totalWallets) * 100 
    : 0;

  if (!progress.isScanning && progress.currentWallet === 0) {
    return null;
  }

  return (
    <div className="card-cyber rounded-xl p-6 relative overflow-hidden">
      {progress.isScanning && <div className="scan-line" />}
      
      <div className="flex items-center gap-4 mb-4">
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center",
          progress.isScanning ? "bg-primary/20" : "bg-success/20"
        )}>
          {progress.isScanning ? (
            <Radar className="w-6 h-6 text-primary animate-pulse" />
          ) : (
            <CheckCircle2 className="w-6 h-6 text-success" />
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">
            {progress.isScanning ? 'Scanning Wallets...' : 'Scan Complete'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {progress.isScanning 
              ? `Wallet ${progress.currentWallet} of ${progress.totalWallets}`
              : `Scanned ${progress.totalWallets} wallets`
            }
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary">{progress.airdropsFound}</p>
          <p className="text-xs text-muted-foreground">Airdrops Found</p>
        </div>
      </div>

      <Progress 
        value={percentage} 
        className="h-2 bg-secondary"
      />
      
      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
        <span>Progress</span>
        <span>{Math.round(percentage)}%</span>
      </div>
    </div>
  );
};
