"use client";

import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Check, Wallet, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function LightningSettingsPage() {
  const { user } = useAuth();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast.success(`${fieldName} copied to clipboard`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Lightning Wallet</h2>
        <p className="text-sm text-muted-foreground">Configure your Lightning wallet settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-warning-500" />
            Wallet Connection
          </CardTitle>
          <CardDescription>
            Your Lightning wallet information for receiving bounty payments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="contactKey">Contact Key</Label>
            <div className="flex gap-2">
              <Input
                id="contactKey"
                value={user.contactKey || "Not configured"}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={!user.contactKey}
                onClick={() => user.contactKey && copyToClipboard(user.contactKey, "Contact Key")}
              >
                {copiedField === "Contact Key" ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              This key is used to send Lightning payments to your wallet
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="routeHint">Route Hint</Label>
            <div className="flex gap-2">
              <Textarea
                id="routeHint"
                value={user.routeHint || "Not configured"}
                readOnly
                className="font-mono text-sm resize-none"
                rows={3}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={!user.routeHint}
                onClick={() => user.routeHint && copyToClipboard(user.routeHint, "Route Hint")}
              >
                {copiedField === "Route Hint" ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Route hints help improve payment reliability
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary-500" />
            Wallet Setup
          </CardTitle>
          <CardDescription>How to configure your Lightning wallet connection</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-4 space-y-3">
            <h4 className="font-medium text-sm">Setup Instructions:</h4>
            <ol className="text-sm space-y-2 list-decimal list-inside text-muted-foreground">
              <li>Install a Lightning wallet (e.g., Phoenix, Breez, or Zeus)</li>
              <li>Generate your LNURL or Lightning Address</li>
              <li>Contact an administrator to configure your wallet settings</li>
              <li>Once configured, you can start receiving bounty payments</li>
            </ol>
          </div>

          <div className="rounded-lg border border-warning-200 bg-warning-50 p-4">
            <p className="text-sm text-warning-800">
              <strong>Note:</strong> Wallet configuration must be done by an administrator for
              security reasons. Please reach out to the team if you need to update your wallet
              settings.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
