import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HelpCircle, Download, DollarSign, Send, CheckCircle } from "lucide-react";

export const HelpGuide = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <HelpCircle className="w-4 h-4" />
          Guide
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-primary">
            Founder Extraction Guide
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Claiming Section */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Download className="w-5 h-5 text-primary" />
              <h3>Claiming Airdrops</h3>
            </div>
            <div className="pl-7 space-y-2 text-muted-foreground">
              <p className="font-medium text-foreground">Identify Eligible Airdrops:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Add your wallet addresses using the "Add Wallet" button</li>
                <li>Click "Scan All Wallets" to detect available airdrops</li>
                <li>Review the discovered airdrops in the table below</li>
                <li>Check eligibility status for each token</li>
              </ul>
              <p className="font-medium text-foreground mt-3">Claim Process:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Click "Claim" on individual airdrops, or</li>
                <li>Use "Extract All" for bulk claiming across all wallets</li>
                <li>Confirm transactions in your connected wallet</li>
                <li>Wait for blockchain confirmation</li>
              </ul>
            </div>
          </section>

          {/* Selling Section */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <DollarSign className="w-5 h-5 text-green-400" />
              <h3>Selling Tokens Simultaneously</h3>
            </div>
            <div className="pl-7 space-y-2 text-muted-foreground">
              <p className="font-medium text-foreground">Bulk Sales Process:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>After claiming, tokens appear with "Claimed" status</li>
                <li>Click "Sell" on individual tokens, or</li>
                <li>Use "Extract All" to sell all claimed tokens at once</li>
                <li>Tokens are automatically routed to DEX aggregators</li>
                <li>Best price is found across multiple exchanges</li>
              </ul>
              <p className="font-medium text-foreground mt-3">Supported Platforms:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Uniswap, SushiSwap (Ethereum)</li>
                <li>PancakeSwap (BSC)</li>
                <li>Jupiter (Solana)</li>
                <li>1inch, 0x aggregators for best rates</li>
              </ul>
            </div>
          </section>

          {/* Extraction Section */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Send className="w-5 h-5 text-accent" />
              <h3>Extracting Tokens in Bulk</h3>
            </div>
            <div className="pl-7 space-y-2 text-muted-foreground">
              <p className="font-medium text-foreground">Bulk Extraction Process:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Select multiple tokens from your discovered airdrops</li>
                <li>Click "Extract All" to process all at once</li>
                <li>Tokens are claimed → sold → proceeds consolidated</li>
                <li>All operations happen simultaneously across wallets</li>
              </ul>
              <p className="font-medium text-foreground mt-3">Extraction Features:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>One-click extraction from unlimited wallets</li>
                <li>Automatic gas optimization</li>
                <li>Parallel transaction processing</li>
                <li>Real-time status updates for each operation</li>
              </ul>
            </div>
          </section>

          {/* Best Practices */}
          <section className="space-y-3 border-t border-border pt-4">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <CheckCircle className="w-5 h-5 text-primary" />
              <h3>Best Practices</h3>
            </div>
            <div className="pl-7 space-y-2 text-muted-foreground">
              <ul className="list-disc pl-5 space-y-1">
                <li>Always verify token contracts before claiming</li>
                <li>Check gas prices before bulk operations</li>
                <li>Use Secure Mode for sensitive operations</li>
                <li>Regularly scan for new airdrops</li>
                <li>Review token value before selling</li>
              </ul>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};
