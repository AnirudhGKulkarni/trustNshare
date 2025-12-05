import { useEffect, useMemo, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, Shield, AlertTriangle, Activity, CheckCircle, XCircle, Trash2, Plus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { collection, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { toast } from 'sonner';

// Stats are now computed from Firestore in real-time below.

const chartData = [
  { name: 'Jan', admins: 8, clients: 180 },
  { name: 'Feb', admins: 9, clients: 195 },
  { name: 'Mar', admins: 10, clients: 210 },
  { name: 'Apr', admins: 11, clients: 225 },
  { name: 'May', admins: 11, clients: 235 },
  { name: 'Jun', admins: 12, clients: 248 },
];

const SuperAdminDashboard = () => {
  type UserRecord = {
    id: string; // Firestore doc id (uid for most users)
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: 'admin' | 'client' | 'super_admin';
    status?: 'pending' | 'active' | 'rejected';
    company?: string | null;
    createdAt?: any;
  };

  const [users, setUsers] = useState<UserRecord[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<number>(0);
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'client' | 'super_admin'>('all');
  const [adding, setAdding] = useState(false);
  const [newUser, setNewUser] = useState<{ firstName: string; lastName: string; email: string; role: 'admin' | 'client' }>(
    { firstName: '', lastName: '', email: '', role: 'client' }
  );

  // Real-time users subscription
  useEffect(() => {
    const ref = collection(firestore, 'users');
    const unsub = onSnapshot(ref, (snap) => {
      const list: UserRecord[] = [];
      snap.forEach((d) => {
        const data = d.data() as any;
        list.push({
          id: d.id,
          firstName: data?.firstName ?? '',
          lastName: data?.lastName ?? '',
          email: data?.email ?? '',
          role: data?.role ?? 'client',
          status: data?.status ?? 'active',
          company: data?.company ?? null,
          createdAt: data?.createdAt ?? null,
        });
      });
      // Sort newest first when timestamp available
      list.sort((a, b) => {
        const at = (a.createdAt?.seconds ? a.createdAt.seconds * 1000 : Date.parse(a.createdAt || 0)) || 0;
        const bt = (b.createdAt?.seconds ? b.createdAt.seconds * 1000 : Date.parse(b.createdAt || 0)) || 0;
        return bt - at;
      });
      setUsers(list);
    });
    return () => unsub();
  }, []);

  // Real-time pending approvals count
  useEffect(() => {
    const approvalsRef = collection(firestore, 'approval_documents');
    const unsub = onSnapshot(approvalsRef, (snap) => {
      let pending = 0;
      snap.forEach((d) => {
        const st = (d.data() as any)?.status;
        if (st === 'pending') pending += 1;
      });
      setPendingApprovals(pending);
    });
    return () => unsub();
  }, []);

  const filteredUsers = useMemo(() => {
    if (roleFilter === 'all') return users;
    return users.filter(u => u.role === roleFilter);
  }, [users, roleFilter]);

  const handleAddUser = async () => {
    if (!newUser.email.trim()) {
      toast.error('Email is required');
      return;
    }
    setAdding(true);
    try {
      // Create a Firestore record (profile). Note: creating an Auth account requires a secure backend.
      await addDoc(collection(firestore, 'users'), {
        firstName: newUser.firstName.trim(),
        lastName: newUser.lastName.trim(),
        email: newUser.email.trim().toLowerCase(),
        role: newUser.role,
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      // Optional backend call to create Firebase Auth user
      try {
        const endpoint = import.meta.env.VITE_ADMIN_CREATE_USER_URL as string | undefined;
        if (endpoint) {
          const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: newUser.email.trim().toLowerCase(),
              displayName: `${newUser.firstName} ${newUser.lastName}`.trim(),
              role: newUser.role,
            }),
          });
          if (!res.ok) console.warn('Create user endpoint returned non-OK:', res.status);
        }
      } catch (e) {
        console.warn('Auth create call failed (optional):', e);
      }

      setNewUser({ firstName: '', lastName: '', email: '', role: 'client' });
      toast.success('User added');
    } catch (e: any) {
      console.error('Add user failed:', e);
      toast.error(e?.message || 'Failed to add user');
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteUser = async (u: UserRecord) => {
    if (!confirm(`Delete ${u.email}? This removes their profile.`)) return;
    try {
      await deleteDoc(doc(firestore, 'users', u.id));
      // Optional backend call to delete Firebase Auth by email
      try {
        const endpoint = import.meta.env.VITE_ADMIN_DELETE_USER_URL as string | undefined;
        if (endpoint && u.email) {
          const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: u.email }),
          });
          if (!res.ok) console.warn('Delete user endpoint returned non-OK:', res.status);
        }
      } catch (e) {
        console.warn('Auth delete call failed (optional):', e);
      }
      toast.success('User deleted');
    } catch (e: any) {
      console.error('Delete user failed:', e);
      toast.error(e?.message || 'Failed to delete user');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Super Admin Dashboard</h2>
          <p className="text-muted-foreground mt-1">
            Manage the entire platform, approve admins, and monitor system-wide activity
          </p>
        </div>

        {/* Real-time Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { name: 'Total Admins', value: String(users.filter(u => u.role === 'admin').length), icon: Shield },
            { name: 'Total Clients', value: String(users.filter(u => u.role === 'client').length), icon: Users },
            { name: 'Pending Approvals', value: String(pendingApprovals), icon: AlertTriangle },
            (() => {
              const total = users.length || 1;
              const active = users.filter(u => u.status === 'active').length;
              const percent = Math.min(100, Math.round((active / total) * 100));
              return { name: 'System Activity', value: `${percent}%`, icon: Activity };
            })(),
          ].map((stat, i) => (
            <Card key={i} className="overflow-hidden transition-all hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.name}
                </CardTitle>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs mt-1 text-muted-foreground">Live</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Users Management + Existing Content Layout */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Left: Real-time Users */}
          <Card className="shadow-card md:col-span-1">
            <CardHeader>
              <CardTitle>All Users</CardTitle>
              <div className="flex items-center gap-2">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value as any)}
                  className="rounded-md border px-2 py-1 text-sm bg-background"
                >
                  <option value="all">All</option>
                  <option value="admin">Admins</option>
                  <option value="client">Clients</option>
                  <option value="super_admin">Super Admins</option>
                </select>
                <span className="text-xs text-muted-foreground">{filteredUsers.length} shown</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[420px] overflow-auto pr-1">
                {filteredUsers.map((u) => (
                  <div key={u.id} className="flex items-center justify-between gap-3 p-3 rounded-lg border">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{u.firstName || u.lastName ? `${u.firstName || ''} ${u.lastName || ''}`.trim() : (u.email || 'Unnamed')}</p>
                      <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                      <p className="text-xs"><span className="uppercase px-2 py-0.5 rounded bg-secondary">{u.role}</span> <span className="ml-2 text-muted-foreground">{u.status}</span></p>
                    </div>
                    <Button variant="destructive" size="icon" onClick={() => handleDeleteUser(u)} aria-label="Delete user">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                {filteredUsers.length === 0 && (
                  <div className="text-sm text-muted-foreground">No users found for this filter.</div>
                )}
              </div>

              {/* Add user */}
              <div className="mt-6 border-t pt-4">
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2"><Plus className="w-4 h-4"/> Add User (Firestore)</h4>
                <div className="grid grid-cols-1 gap-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Input placeholder="First name" value={newUser.firstName} onChange={(e) => setNewUser(s => ({...s, firstName: e.target.value}))} />
                    <Input placeholder="Last name" value={newUser.lastName} onChange={(e) => setNewUser(s => ({...s, lastName: e.target.value}))} />
                  </div>
                  <Input type="email" placeholder="Email" value={newUser.email} onChange={(e) => setNewUser(s => ({...s, email: e.target.value}))} />
                  <div className="flex items-center gap-2">
                    <Label className="text-xs">Role</Label>
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser(s => ({...s, role: e.target.value as any}))}
                      className="rounded-md border px-2 py-1 text-sm bg-background"
                    >
                      <option value="client">Client</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <Button onClick={handleAddUser} disabled={adding} className="w-full">
                    {adding ? 'Adding…' : 'Add User'}
                  </Button>
                  <p className="text-[11px] text-muted-foreground">
                    Note: Creating a Firebase Auth account requires a secure backend. If configured via <code>VITE_ADMIN_CREATE_USER_URL</code>, we will call it.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right: existing dashboard content spans 2 columns */}
          <div className="md:col-span-2 space-y-6">

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Platform Growth Overview</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Monthly growth of admins and clients across the platform
                </p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" className="text-sm" />
                    <YAxis className="text-sm" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="admins" fill="hsl(var(--primary))" name="Admins" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="clients" fill="hsl(var(--accent))" name="Clients" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Recent Admin Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: 'John Doe', company: 'TechCorp Inc.', status: 'pending', time: '2 hours ago' },
                      { name: 'Jane Smith', company: 'DataSys Ltd.', status: 'pending', time: '5 hours ago' },
                      { name: 'Mike Johnson', company: 'SecureNet', status: 'approved', time: '1 day ago' },
                    ].map((request, i) => (
                      <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/50">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          {request.status === 'pending' ? (
                            <AlertTriangle className="h-5 w-5 text-orange-500" />
                          ) : (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{request.name}</p>
                          <p className="text-xs text-muted-foreground">{request.company}</p>
                        </div>
                        <div className="text-right">
                          <span className={`text-xs px-2 py-1 rounded ${
                            request.status === 'pending' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                          }`}>
                            {request.status}
                          </span>
                          <p className="text-xs text-muted-foreground mt-1">{request.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {[
                      { title: 'Review Admin Approvals', desc: 'View pending admin requests', icon: Shield, badge: '5' },
                      { title: 'View Audit Logs', desc: 'Monitor system activity', icon: Activity, badge: null },
                      { title: 'Manage Users', desc: 'View all admins and clients', icon: Users, badge: null },
                    ].map((action, i) => (
                      <button
                        key={i}
                        className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-secondary to-accent hover:shadow-md transition-all text-left relative"
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                          <action.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{action.title}</p>
                          <p className="text-sm text-muted-foreground">{action.desc}</p>
                        </div>
                        {action.badge && (
                          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                            {action.badge}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                    <div>
                      <p className="text-sm font-medium">Database</p>
                      <p className="text-xs text-muted-foreground">Operational</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                    <div>
                      <p className="text-sm font-medium">Authentication</p>
                      <p className="text-xs text-muted-foreground">Operational</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                    <div>
                      <p className="text-sm font-medium">Storage</p>
                      <p className="text-xs text-muted-foreground">Operational</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* end users+content grid */}
      </div>
    </DashboardLayout>
  );
};

export default SuperAdminDashboard;
