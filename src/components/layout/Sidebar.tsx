import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Shield, 
  Share2, 
  FileText, 
  Settings,
  MessageCircle,
  Clock,
  Bell,
  ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Users & Roles', href: '/users', icon: Users },
  { name: 'Policies', href: '/policies', icon: Shield },
  { name: 'Share Data', href: '/share', icon: Share2 },
  { name: 'Chat', href: '/chat', icon: MessageCircle },
  { name: 'Login History', href: '/login-history', icon: Clock },
  { name: 'Alert Center', href: '/alert-center', icon: Bell },
  { name: 'Security Settings', href: '/security-settings', icon: ShieldCheck },
  { name: 'Audit Logs', href: '/audit', icon: FileText },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const Sidebar = () => {
  return (
    <aside className="hidden lg:flex lg:flex-col w-64 bg-card border-r border-border">
      <div className="flex h-20 items-center px-0 border-b border-border">
        <div className="w-full h-20 overflow-hidden">
          <img src="/trustNshare.jpg" alt="trustNshare" className="w-full h-20 object-cover block dark:hidden" />
          <img src="/bg.png" alt="trustNshare dark" className="w-full h-20 object-cover hidden dark:block" />
        </div>
      </div>
      
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              )
            }
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
