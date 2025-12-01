import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle, XCircle, Eye, FileText, Download, User, Mail, Briefcase, Calendar } from 'lucide-react';
import { collection, query, where, getDocs, doc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { firestore, auth } from '@/lib/firebase';
import { toast } from 'sonner';

interface Document {
  fileName: string;
  fileSize: number;
  fileType: string;
  base64: string;
}

interface AdminRequest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  domain: string;
  customCategory: string | null;
  documents: Document[];
  status: 'pending' | 'approved' | 'rejected';
  createdAt: any;
}

const AdminApproval = () => {
  const [requests, setRequests] = useState<AdminRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<AdminRequest | null>(null);
  const [viewingDocument, setViewingDocument] = useState<Document | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const q = query(collection(firestore, 'approval_documents'));
      const querySnapshot = await getDocs(q);
      
      const requestsData: AdminRequest[] = [];
      querySnapshot.forEach((doc) => {
        requestsData.push({
          id: doc.id,
          ...doc.data(),
        } as AdminRequest);
      });

      // Sort by createdAt (newest first)
      requestsData.sort((a, b) => {
        const aTime = a.createdAt?.seconds || 0;
        const bTime = b.createdAt?.seconds || 0;
        return bTime - aTime;
      });

      setRequests(requestsData);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Failed to load admin requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (request: AdminRequest) => {
    if (!confirm(`Approve admin registration for ${request.firstName} ${request.lastName}?`)) {
      return;
    }

    setProcessing(true);
    try {
      // Generate temporary password
      const tempPassword = `Admin@${Math.random().toString(36).slice(-8)}`;

      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, request.email, tempPassword);
      
      // Add to users collection with admin role
      await addDoc(collection(firestore, 'users'), {
        uid: userCredential.user.uid,
        email: request.email,
        firstName: request.firstName,
        lastName: request.lastName,
        company: request.company,
        domain: request.domain,
        customCategory: request.customCategory,
        role: 'admin',
        status: 'active',
        tempPassword: tempPassword,
        createdAt: serverTimestamp(),
        approvedAt: serverTimestamp(),
      });

      // Update approval document status
      await updateDoc(doc(firestore, 'approval_documents', request.id), {
        status: 'approved',
        approvedAt: serverTimestamp(),
        approvedBy: 'super_admin',
      });

      toast.success(`Admin approved! Temporary password: ${tempPassword}`);
      
      // TODO: Send email with credentials
      console.log(`Send email to ${request.email} with password: ${tempPassword}`);

      fetchRequests();
      setSelectedRequest(null);
    } catch (error: any) {
      console.error('Error approving admin:', error);
      toast.error(error.message || 'Failed to approve admin');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async (request: AdminRequest) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;

    setProcessing(true);
    try {
      await updateDoc(doc(firestore, 'approval_documents', request.id), {
        status: 'rejected',
        rejectedAt: serverTimestamp(),
        rejectedBy: 'super_admin',
        rejectionReason: reason,
      });

      toast.success('Admin request rejected');
      fetchRequests();
      setSelectedRequest(null);
    } catch (error) {
      console.error('Error rejecting admin:', error);
      toast.error('Failed to reject admin request');
    } finally {
      setProcessing(false);
    }
  };

  const downloadDocument = (doc: Document) => {
    const link = window.document.createElement('a');
    link.href = doc.base64;
    link.download = doc.fileName;
    link.click();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp?.seconds) return 'N/A';
    return new Date(timestamp.seconds * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'approved': return 'bg-green-100 text-green-700 border-green-300';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Admin Approvals</h2>
          <p className="text-muted-foreground mt-1">
            Review and approve admin registration requests with document verification
          </p>
        </div>

        {loading ? (
          <Card>
            <CardContent className="py-10">
              <div className="text-center text-muted-foreground">Loading requests...</div>
            </CardContent>
          </Card>
        ) : requests.length === 0 ? (
          <Card>
            <CardContent className="py-10">
              <div className="text-center text-muted-foreground">No admin requests found</div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {requests.map((request) => (
              <Card key={request.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        {request.firstName} {request.lastName}
                      </CardTitle>
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {request.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          {request.company}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(request.createdAt)}
                        </span>
                      </div>
                    </div>
                    <Badge className={getStatusColor(request.status)}>
                      {request.status.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Domain:</span> {request.domain}
                      </div>
                      {request.customCategory && (
                        <div>
                          <span className="font-medium">Category:</span> {request.customCategory}
                        </div>
                      )}
                      <div>
                        <span className="font-medium">Documents:</span> {request.documents.length} file(s)
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedRequest(request)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      {request.status === 'pending' && (
                        <>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleApprove(request)}
                            disabled={processing}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleReject(request)}
                            disabled={processing}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Request Details Dialog */}
        <Dialog open={selectedRequest !== null} onOpenChange={() => setSelectedRequest(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Admin Request Details</DialogTitle>
              <DialogDescription>
                Review the complete information and uploaded documents
              </DialogDescription>
            </DialogHeader>

            {selectedRequest && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">First Name</label>
                    <p className="text-sm text-muted-foreground">{selectedRequest.firstName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Last Name</label>
                    <p className="text-sm text-muted-foreground">{selectedRequest.lastName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <p className="text-sm text-muted-foreground">{selectedRequest.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Company</label>
                    <p className="text-sm text-muted-foreground">{selectedRequest.company}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Domain</label>
                    <p className="text-sm text-muted-foreground">{selectedRequest.domain}</p>
                  </div>
                  {selectedRequest.customCategory && (
                    <div>
                      <label className="text-sm font-medium">Custom Category</label>
                      <p className="text-sm text-muted-foreground">{selectedRequest.customCategory}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium">Status</label>
                    <p className="text-sm">
                      <Badge className={getStatusColor(selectedRequest.status)}>
                        {selectedRequest.status.toUpperCase()}
                      </Badge>
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Submitted</label>
                    <p className="text-sm text-muted-foreground">{formatDate(selectedRequest.createdAt)}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-3">Uploaded Documents ({selectedRequest.documents.length})</h4>
                  <div className="space-y-2">
                    {selectedRequest.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-secondary/50">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm font-medium">{doc.fileName}</p>
                            <p className="text-xs text-muted-foreground">
                              {doc.fileType} • {formatFileSize(doc.fileSize)}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setViewingDocument(doc)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadDocument(doc)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedRequest.status === 'pending' && (
                  <div className="flex gap-3 pt-4 border-t">
                    <Button
                      onClick={() => handleApprove(selectedRequest)}
                      disabled={processing}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve Admin
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleReject(selectedRequest)}
                      disabled={processing}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject Request
                    </Button>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Document Viewer Dialog */}
        <Dialog open={viewingDocument !== null} onOpenChange={() => setViewingDocument(null)}>
          <DialogContent className="max-w-6xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>{viewingDocument?.fileName}</DialogTitle>
              <DialogDescription>
                {viewingDocument?.fileType} • {viewingDocument && formatFileSize(viewingDocument.fileSize)}
              </DialogDescription>
            </DialogHeader>

            {viewingDocument && (
              <div className="flex items-center justify-center bg-gray-100 rounded-lg p-4 min-h-[500px]">
                {viewingDocument.fileType.startsWith('image/') ? (
                  <img
                    src={viewingDocument.base64}
                    alt={viewingDocument.fileName}
                    className="max-w-full max-h-[600px] object-contain"
                  />
                ) : viewingDocument.fileType === 'application/pdf' ? (
                  <iframe
                    src={viewingDocument.base64}
                    className="w-full h-[600px] border-0"
                    title={viewingDocument.fileName}
                  />
                ) : (
                  <div className="text-center space-y-4">
                    <FileText className="h-16 w-16 mx-auto text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Preview not available for this file type
                    </p>
                    <Button onClick={() => downloadDocument(viewingDocument)}>
                      <Download className="h-4 w-4 mr-2" />
                      Download to View
                    </Button>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default AdminApproval;
