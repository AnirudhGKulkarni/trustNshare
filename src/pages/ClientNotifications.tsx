import React, { useEffect, useState } from 'react';
// Rendered within the `/client` layout (parent route)
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { firestore } from '@/lib/firebase';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';

interface AlertItem {
  id: string;
  message: string;
  type?: string;
  createdAt?: any;
}

const ClientNotifications: React.FC = () => {
  const { currentUser } = useAuth();
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  useEffect(() => {
    if (!currentUser) return;
    const alertsRef = collection(firestore, 'alerts');
    const q = query(alertsRef, where('userId', 'in', [currentUser.uid, 'all']), orderBy('createdAt', 'desc'), limit(50));
    const unsub = onSnapshot(q, (snap) => {
      const out: AlertItem[] = [];
      snap.forEach((d) => {
        const data = d.data() as any;
        out.push({ id: d.id, message: data.message ?? '', type: data.type ?? 'info', createdAt: data.createdAt ?? data.timestamp });
      });
      setAlerts(out);
    }, (err) => {
      console.error('alerts subscribe error', err);
      setAlerts([]);
    });
    return () => unsub();
  }, [currentUser]);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Notifications</h2>
        <p className="text-sm text-muted-foreground">System and security notifications for your account</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {alerts.length === 0 && <div className="text-sm text-muted-foreground">No notifications.</div>}
            {alerts.map((a) => (
              <div key={a.id} className="p-3 rounded-md border bg-secondary/20 flex items-start justify-between">
                <div className="text-sm">{a.message}</div>
                <div className="text-xs text-muted-foreground">{a.createdAt?.seconds ? new Date(a.createdAt.seconds * 1000).toLocaleString() : a.createdAt}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientNotifications;
