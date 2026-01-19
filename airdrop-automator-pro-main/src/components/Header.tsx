import { Zap, Shield, Activity } from 'lucide-react';

export const Header = () => {
  return (
    <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-primary">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full pulse-glow" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gradient-primary">
                Founder Extractor
              </h1>
              <p className="text-xs text-muted-foreground">
                Airdrop Extraction Site
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm">
              <Activity className="w-4 h-4 text-success" />
              <span className="text-muted-foreground">Network:</span>
              <span className="text-foreground font-mono">Multi-Chain</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-success font-medium">Secure Mode</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
