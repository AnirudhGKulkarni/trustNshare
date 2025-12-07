import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Shield } from 'lucide-react';
import policiesData from '@/data/policies.json';

interface Policy {
  id: string;
  policyName: string;
  policyDescription: string;
  policyCategory?: string;
  protectedFields?: { field: string; reason?: string }[];
  allowedActions?: Record<string, { allowed: boolean; notes?: string }>;
  status?: string;
}

const ClientPolicies: React.FC = () => {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [viewPolicy, setViewPolicy] = useState<Policy | null>(null);

  useEffect(() => {
    // Load policies from localStorage or use static data
    try {
      const raw = localStorage.getItem('policies_v1');
      if (raw) {
        const parsed = JSON.parse(raw);
        setPolicies(parsed);
        return;
      }
    } catch (e) {
      console.error('Error loading policies from localStorage', e);
    }
    // Fallback to static JSON
    setPolicies((policiesData as any[]) || []);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Security Policies</h2>
        <p className="text-sm text-muted-foreground">View data protection and access control policies</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {policies.length === 0 ? (
          <Card className="md:col-span-2 lg:col-span-3">
            <CardContent className="pt-6">
              <div className="text-center text-muted-foreground">No policies available</div>
            </CardContent>
          </Card>
        ) : (
          policies.map((policy) => (
            <Card key={policy.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      {policy.policyName}
                    </CardTitle>
                  </div>
                  {policy.status && (
                    <Badge variant={policy.status === 'Active' ? 'default' : 'secondary'}>
                      {policy.status}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Category</p>
                  <p className="text-sm">{policy.policyCategory || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Description</p>
                  <p className="text-sm line-clamp-2">{policy.policyDescription}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setViewPolicy(policy)}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Policy Details Dialog */}
      <Dialog open={Boolean(viewPolicy)} onOpenChange={(v) => { if (!v) setViewPolicy(null); }}>
        <DialogContent className="w-full sm:w-[640px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              {viewPolicy?.policyName}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {viewPolicy && (
              <>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Description</p>
                  <div className="mt-2 text-sm">{viewPolicy.policyDescription}</div>
                </div>

                {viewPolicy.policyCategory && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Category</p>
                    <div className="mt-2 text-sm">{viewPolicy.policyCategory}</div>
                  </div>
                )}

                {viewPolicy.protectedFields && viewPolicy.protectedFields.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Protected Fields</p>
                    <div className="mt-2 space-y-2">
                      {viewPolicy.protectedFields.map((pf: any, i: number) => (
                        <div key={i} className="p-2 border rounded text-sm">
                          <div className="font-medium">{pf.field}</div>
                          {pf.reason && <div className="text-xs text-muted-foreground">{pf.reason}</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {viewPolicy.allowedActions && Object.keys(viewPolicy.allowedActions).length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Allowed Actions</p>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {Object.entries(viewPolicy.allowedActions).map(([key, val]: any) => (
                        <div key={key} className="p-2 border rounded text-sm">
                          <div className="font-medium capitalize">{key}</div>
                          <div className="text-xs text-muted-foreground">
                            {val.allowed ? '✓ Allowed' : '✗ Not allowed'}
                          </div>
                          {val.notes && <div className="text-xs text-muted-foreground mt-1">{val.notes}</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {viewPolicy.status && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <div className="mt-2">
                      <Badge variant={viewPolicy.status === 'Active' ? 'default' : 'secondary'}>
                        {viewPolicy.status}
                      </Badge>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
            <Button variant="outline" onClick={() => setViewPolicy(null)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientPolicies;
