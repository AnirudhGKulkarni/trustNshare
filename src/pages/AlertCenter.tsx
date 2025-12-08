import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle, 
  Shield, 
  Info, 
  CheckCircle, 
  Clock, 
  Search, 
  Filter,
  Bell,
  X,
  Eye,
  Archive
} from 'lucide-react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';

// Alerts are loaded from Firestore and classified into: critical, neutral, basic

const AlertCenter = () => {
  const [selectedTab, setSelectedTab] = useState('all');

  const getAlertIcon = (type: string) => {
    const t = String(type || '').toLowerCase();
    if (t === 'critical') return <AlertTriangle className="h-4 w-4" />;
    if (t === 'neutral' || t === 'warning' || t === 'warn') return <Shield className="h-4 w-4" />;
    if (t === 'basic' || t === 'info' || t === 'notice') return <Info className="h-4 w-4" />;
    return <Bell className="h-4 w-4" />;
  };

  const getAlertBadge = (type: string) => {
    const t = String(type || '').toLowerCase();
    if (t === 'critical') return <Badge variant="destructive">Critical</Badge>;
    if (t === 'neutral' || t === 'warning' || t === 'warn') return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Neutral</Badge>;
    if (t === 'basic' || t === 'info' || t === 'notice') return <Badge variant="outline" className="text-blue-600 border-blue-600">Basic</Badge>;
    return <Badge variant="outline">{type}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Active</Badge>;
      case 'investigating':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Investigating</Badge>;
      case 'acknowledged':
        return <Badge variant="outline" className="text-blue-600 border-blue-600">Acknowledged</Badge>;
      case 'resolved':
        return <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Resolved</Badge>;
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // runtime alerts state
  const [alertsState, setAlertsState] = useState<any[]>([]);
  const [statsState, setStatsState] = useState<any[]>([]);

  const classify = (a: any) => {
    // Normalize existing types to classification categories: critical, neutral, basic
    const t = String(a?.type || '').toLowerCase();
    if (t.includes('critical')) return 'critical';
    if (t.includes('warn') || t.includes('warning')) return 'neutral';
    if (t.includes('info') || t.includes('notice') || t === '') return 'basic';
    // fallback based on category or severity
    const c = String(a?.category || '').toLowerCase();
    if (c.includes('security') || c.includes('authentication')) return 'critical';
    return 'basic';
  };

  useEffect(() => {
    const q = query(collection(firestore, 'alerts'), orderBy('timestamp', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const docs = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
      const mapped = docs.map((d: any) => {
        const ts = d.timestamp?.toDate ? d.timestamp.toDate() : d.timestamp ? new Date(d.timestamp) : null;
        const classification = classify(d);
        return {
          ...d,
          timestamp: ts ? ts.toLocaleString() : (d.timestamp || ''),
          timestampDate: ts,
          classification,
        };
      });
      setAlertsState(mapped);

      // compute simple stats
      const total = mapped.length;
      const active = mapped.filter((m:any) => m.status === 'active').length;
      const critical = mapped.filter((m:any) => m.classification === 'critical').length;
      const neutral = mapped.filter((m:any) => m.classification === 'neutral').length;
      const basic = mapped.filter((m:any) => m.classification === 'basic').length;

      setStatsState([
        { title: 'Active Alerts', value: String(active), icon: AlertTriangle, color: 'text-red-600' },
        { title: 'Critical', value: String(critical), icon: Shield, color: 'text-red-700' },
        { title: 'Neutral', value: String(neutral), icon: Eye, color: 'text-yellow-600' },
        { title: 'Basic', value: String(basic), icon: Info, color: 'text-blue-600' },
      ]);
    }, (e) => console.warn('alerts listener', e));

    return () => unsub();
  }, []);

  const filteredAlerts = alertsState.filter(alert => {
    if (selectedTab === 'all') return true;
    if (selectedTab === 'critical') return alert.classification === 'critical';
    if (selectedTab === 'neutral') return alert.classification === 'neutral';
    if (selectedTab === 'basic') return alert.classification === 'basic';
    return true;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Alert Center</h2>
          <p className="text-muted-foreground mt-1">
            Monitor and manage security alerts and system notifications
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statsState.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Alert Management */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle>Security Alerts</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Archive className="h-4 w-4 mr-2" />
                  Archive All Resolved
                </Button>
                <Button size="sm">
                  <Bell className="h-4 w-4 mr-2" />
                  Configure Notifications
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input className="pl-10" placeholder="Search alerts..." />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>

            {/* Alert Tabs */}
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All Alerts</TabsTrigger>
                <TabsTrigger value="critical">Critical</TabsTrigger>
                <TabsTrigger value="neutral">Neutral</TabsTrigger>
                <TabsTrigger value="basic">Basic</TabsTrigger>
              </TabsList>

              <TabsContent value={selectedTab} className="mt-6">
                <div className="space-y-4">
                  {filteredAlerts.map((alert) => (
                    <Card key={alert.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className={`mt-1 ${
                              alert.classification === 'critical' ? 'text-red-600' :
                              alert.classification === 'neutral' ? 'text-yellow-600' :
                              'text-blue-600'
                            }`}>
                              {getAlertIcon(alert.classification || alert.type)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold">{alert.title}</h3>
                                {getAlertBadge(alert.classification || alert.type)}
                                {getStatusBadge(alert.status)}
                              </div>
                              <p className="text-muted-foreground text-sm mb-2">
                                {alert.description}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {alert.timestamp}
                                </div>
                                <span>Category: {alert.category}</span>
                                {alert.affectedUser && (
                                  <span>User: {alert.affectedUser}</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                            {alert.status === 'active' && (
                              <Button variant="outline" size="sm">
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Resolve
                              </Button>
                            )}
                            <Button variant="outline" size="sm">
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-6">
                    <p className="text-sm text-muted-foreground">
                    Showing {filteredAlerts.length} of {alertsState.length} alerts
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm">
                      Next
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AlertCenter;