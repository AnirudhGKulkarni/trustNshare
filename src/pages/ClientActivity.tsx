import React, { useEffect, useState } from 'react';
// Rendered within the `/client` parent route which provides the layout
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { firestore } from '@/lib/firebase';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';

interface ActivityItem {
  id: string;
  action: string;
  resource?: string;
  details?: string;
  timestamp?: any;
}

const getRelativeTime = (ts: any) => {
  if (!ts) return 'recently';
  try {
    const t = ts?.seconds ? new Date(ts.seconds * 1000) : new Date(ts);
    const diff = Date.now() - t.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  } catch (e) {
    return 'recently';
  }
};

const ClientActivity: React.FC = () => {
  const { currentUser } = useAuth();
  const [items, setItems] = useState<ActivityItem[]>([]);

  useEffect(() => {
    if (!currentUser) return;
    const logsRef = collection(firestore, 'audit_logs');
    const q = query(logsRef, where('userId', '==', currentUser.uid), orderBy('timestamp', 'desc'), limit(50));
    const unsub = onSnapshot(q, (snap) => {
      const out: ActivityItem[] = [];
      snap.forEach((d) => {
        const data = d.data() as any;
        out.push({ id: d.id, action: data.action ?? 'Activity', resource: data.resource, details: data.details, timestamp: data.timestamp ?? data.createdAt });
      });
      setItems(out);
    }, (err) => {
      console.error('Activity subscribe error', err);
      setItems([]);
    });
    return () => unsub();
  }, [currentUser]);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Recent Activity</h2>
        <p className="text-sm text-muted-foreground">Your recent actions and audit trail</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Activity className="h-4 w-4" /> Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {items.length === 0 && <div className="text-sm text-muted-foreground">No activity yet.</div>}
            {items.map((it) => (
              <div key={it.id} className="p-3 rounded-md border bg-secondary/20 flex items-start justify-between">
                <div>
                  <div className="text-sm font-medium">{it.action}{it.resource ? ` — ${it.resource}` : ''}</div>
                  {it.details && <div className="text-xs text-muted-foreground mt-1">{it.details}</div>}
                </div>
                <div className="text-xs text-muted-foreground">{getRelativeTime(it.timestamp)}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientActivity;
