import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Shield, 
  FileText, 
  CheckSquare,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/super-admin', icon: LayoutDashboard },
  { name: 'Admin Approvals', href: '/super-admin/approvals', icon: CheckSquare },
  { name: 'Audit Logs', href: '/super-admin/audit', icon: FileText },
  { name: 'All Users', href: '/super-admin/users', icon: Users },
];

export const SuperAdminSidebar = () => {
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
            end={item.href === '/super-admin'}
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

      <div className="p-4 border-t border-border">
        <div className="bg-secondary rounded-lg p-3 border">
          <p className="text-xs font-semibold">Super Admin</p>
          <p className="text-xs text-muted-foreground mt-1">Full system access</p>
        </div>
      </div>
    </aside>
  );
};
