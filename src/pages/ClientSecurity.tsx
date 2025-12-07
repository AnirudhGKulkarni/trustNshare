import React, { useState } from 'react';
// Rendered within the `/client` parent route which provides the layout
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Shield, Key, Lock } from 'lucide-react';

const ClientSecurity: React.FC = () => {
  const [twoFactor, setTwoFactor] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Security</h2>
        <p className="text-sm text-muted-foreground">Manage security settings for your account</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Shield className="h-4 w-4" /> Authentication</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <Label>Two-Factor Authentication</Label>
                <div className="text-xs text-muted-foreground">Protect your account with an additional verification step</div>
              </div>
              <Switch checked={twoFactor} onCheckedChange={(v) => setTwoFactor(Boolean(v))} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Lock className="h-4 w-4" /> Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <Label>Login Notifications</Label>
                <div className="text-xs text-muted-foreground">Receive alerts for new device logins</div>
              </div>
              <Switch checked={loginAlerts} onCheckedChange={(v) => setLoginAlerts(Boolean(v))} />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button variant="outline">Reset Defaults</Button>
          <Button>Save Changes</Button>
        </div>
      </div>
    </div>
  );
};

export default ClientSecurity;
