import React, { useState } from 'react';
// This page is rendered as a nested route under the `/client` route
// which already provides the `ClientLayout` via an <Outlet />.
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Send, Phone, Video, MoreVertical } from 'lucide-react';

const chatContacts = [
  { id: 1, name: 'Alice Johnson', avatar: 'AJ', status: 'online', lastMessage: 'Can you review the security policy?', time: '2m', unread: 2 },
  { id: 2, name: 'Bob Smith', avatar: 'BS', status: 'away', lastMessage: 'File shared successfully', time: '15m', unread: 0 },
];

const messages = [
  { id: 1, sender: 'Alice Johnson', content: 'Hi! Can you help me with the new security policy?', time: '10:30 AM', isMe: false },
  { id: 2, sender: 'Me', content: 'Of course! Which section do you need help with?', time: '10:32 AM', isMe: true },
];

const ClientMessages: React.FC = () => {
  const [selectedContact, setSelectedContact] = useState(chatContacts[0]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // placeholder: integrate send logic
      setNewMessage('');
    }
  };

  return (
    <div className="p-6 space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Team Chat</h2>
          <p className="text-sm text-muted-foreground">Collaborate securely with your team</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-220px)]">
          <Card className="lg:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Conversations
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {chatContacts.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => setSelectedContact(contact)}
                    className={`w-full p-3 text-left hover:bg-secondary/50 transition-colors ${
                      selectedContact.id === contact.id ? 'bg-secondary' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="" />
                          <AvatarFallback className="text-xs">{contact.avatar}</AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background ${
                          contact.status === 'online' ? 'bg-green-500' : contact.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                        }`}></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium truncate">{contact.name}</p>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-muted-foreground">{contact.time}</span>
                            {contact.unread > 0 && (
                              <Badge variant="destructive" className="text-xs min-w-5 h-5 flex items-center justify-center p-0">
                                {contact.unread}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground truncate mt-1">{contact.lastMessage}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 flex flex-col">
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="" />
                    <AvatarFallback className="text-xs">{selectedContact.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{selectedContact.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{selectedContact.status}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm"><Phone className="h-4 w-4" /></Button>
                  <Button variant="outline" size="sm"><Video className="h-4 w-4" /></Button>
                  <Button variant="outline" size="sm"><MoreVertical className="h-4 w-4" /></Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.isMe ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${message.isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{message.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>

            <div className="p-4 border-t">
              <div className="flex items-center gap-2">
                <Input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." className="flex-1" onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} />
                <Button onClick={handleSendMessage} size="sm"><Send className="h-4 w-4" /></Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
  );
};

export default ClientMessages;
