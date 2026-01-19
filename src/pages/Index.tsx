import { Header } from '@/components/Header';
import { StatsCard } from '@/components/StatsCard';
import { ConnectedWalletCard } from '@/components/ConnectedWalletCard';
import { ConnectWalletModal } from '@/components/ConnectWalletModal';
import { TransferModal } from '@/components/TransferModal';
import { AirdropTable } from '@/components/AirdropTable';
import { ScanProgress } from '@/components/ScanProgress';
import { useAirdropScanner } from '@/hooks/useAirdropScanner';
import { Button } from '@/components/ui/button';
import { Wallet, Gift, DollarSign, TrendingUp, Radar } from 'lucide-react';
import { useAccount, useChainId } from 'wagmi';

const Index = () => {
  const { address, connector } = useAccount();
  const chainId = useChainId();
  
  const {
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
  } = useAirdropScanner();

  return (
    <div className="min-h-screen bg-background grid-pattern">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Connected Wallets"
            value={stats.totalWallets}
            subtitle="Multi-chain support"
            icon={<Wallet className="w-6 h-6" />}
          />
          <StatsCard
            title="Available Airdrops"
            value={stats.totalAirdrops}
            subtitle={`${stats.pendingClaims} pending claims`}
            icon={<Gift className="w-6 h-6" />}
            trend="up"
          />
          <StatsCard
            title="Total Value"
            value={`$${stats.totalValue.toLocaleString()}`}
            subtitle="Across all airdrops"
            icon={<DollarSign className="w-6 h-6" />}
          />
          <StatsCard
            title="Extracted Profit"
            value={`$${stats.soldValue.toLocaleString()}`}
            subtitle="Successfully sold"
            icon={<TrendingUp className="w-6 h-6" />}
            trend="up"
          />
        </div>

        {/* Scan Progress */}
        {(scanProgress.isScanning || scanProgress.currentWallet > 0) && (
          <div className="mb-8">
            <ScanProgress progress={scanProgress} />
          </div>
        )}

        {/* Wallets Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Your Wallets</h2>
              <p className="text-sm text-muted-foreground">
                Connect wallets to scan for airdrops
              </p>
            </div>
            <div className="flex gap-3">
              <ConnectWalletModal />
              <TransferModal 
                totalValue={stats.totalValue}
                walletCount={stats.totalWallets}
                onTransferAll={transferAll}
                isTransferring={isTransferring}
              />
              <Button 
                variant="cyber" 
                onClick={startScan}
                disabled={scanProgress.isScanning || wallets.length === 0}
                className="gap-2"
              >
                <Radar className="w-4 h-4" />
                {scanProgress.isScanning ? 'Scanning...' : 'Scan All Wallets'}
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isConnected && address && (
              <ConnectedWalletCard
                address={address}
                chainId={chainId}
                connectorName={connector?.name || 'Connected Wallet'}
                isScanning={scanProgress.isScanning && scanProgress.currentWallet === 1}
              />
            )}
            {wallets.length === 0 && !isConnected && (
              <div className="col-span-full card-cyber rounded-xl p-12 text-center">
                <Wallet className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  No wallets connected. Connect your wallet to start scanning for airdrops.
                </p>
                <ConnectWalletModal />
              </div>
            )}
          </div>
        </section>

        {/* Airdrops Table */}
        <section>
          <AirdropTable
            airdrops={airdrops}
            onClaim={claimAirdrop}
            onSell={sellAirdrop}
            onClaimAll={claimAllAirdrops}
            onSellAll={sellAllAirdrops}
            onClaimAndSellAll={claimAndSellAll}
            isBatchProcessing={isBatchProcessing}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12 py-6">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>Founder Extractor • Built for efficiency and maximum extraction</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
