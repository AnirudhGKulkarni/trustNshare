import React, { useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Shield, 
  FileText, 
  CheckSquare,
  Users,
  Settings as SettingsIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/super-admin', icon: LayoutDashboard },
  { name: 'Admin Approvals', href: '/super-admin/approvals', icon: CheckSquare },
  { name: 'Audit Logs', href: '/super-admin/audit', icon: FileText },
  { name: 'All Users', href: '/super-admin/users', icon: Users },
  { name: 'Settings', href: '/settings', icon: SettingsIcon },
];

export const SuperAdminSidebar = ({ mobileOpen = false, onClose }: { mobileOpen?: boolean; onClose?: () => void }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const panel = (
    <div className="flex flex-col h-full">
      <div className="w-full">
        <div className="h-20 border-b border-border flex items-center">
          <div className="w-full h-20 flex items-center px-2">
            <div className="flex items-center gap-3 w-full h-full relative">
              <div className="flex items-center justify-center w-14 h-14 flex-shrink-0 z-10">
                <img src="/favicon.ico" alt="favicon-light" className="h-9 w-9 object-contain transition-all duration-150 block dark:hidden group-hover:opacity-0" />
                <img src="/favicon2.ico" alt="favicon-dark" className="h-9 w-9 object-contain transition-all duration-150 hidden dark:block group-hover:opacity-0" />
              </div>

              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <img src="/lbg.png" alt="trustNshare light" className="absolute inset-0 m-auto max-h-full max-w-full object-contain opacity-0 group-hover:opacity-100 transition-opacity duration-200 block dark:hidden z-20 p-2" />
                <img src="/bg.png" alt="trustNshare dark" className="absolute inset-0 m-auto max-h-full max-w-full object-contain opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden dark:block z-20 p-2" />
                <video
                  ref={videoRef}
                  src="/test.mp4"
                  className="absolute inset-0 h-full w-full object-cover rounded-md opacity-0 group-hover:opacity-90 transition-opacity duration-200 z-10"
                  muted
                  loop
                  playsInline
                  preload="none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-0 py-4">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            end={item.href === '/super-admin'}
            className={({ isActive }) =>
              cn(
                'flex items-center transition-all duration-150 rounded-lg',
                'group-hover:justify-start justify-center',
                'px-0 group-hover:px-3',
                'py-2.5 text-sm font-medium',
                'hover:bg-secondary hover:text-foreground',
                isActive ? 'group-hover:bg-primary group-hover:text-primary-foreground' : 'text-muted-foreground'
              )
            }
          >
            {({ isActive }: { isActive: boolean }) => (
              <>
                <span
                  className={cn(
                    'inline-flex items-center justify-center w-9 h-9 flex-shrink-0 transition-all',
                    isActive ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' : 'text-muted-foreground',
                    'group-hover:bg-transparent group-hover:text-current group-hover:p-0'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                </span>
                <span className="ml-3 overflow-hidden max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 transition-[max-width,opacity] duration-200 whitespace-nowrap">{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="bg-secondary rounded-lg p-3 border">
          <p className="text-xs font-semibold">Super Admin</p>
          <p className="text-xs text-muted-foreground mt-1">Full system access</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className={`fixed inset-0 z-40 lg:hidden ${mobileOpen ? '' : 'pointer-events-none'}`} aria-hidden={!mobileOpen}>
        <div
          className={`fixed inset-0 bg-black transition-opacity ${mobileOpen ? 'opacity-60' : 'opacity-0'}`}
          onClick={onClose}
        />

        <div className={`fixed left-0 top-0 bottom-0 w-64 transform transition-transform ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          {panel}
        </div>
      </div>

      <div className="hidden lg:block group">
        <aside
          onMouseEnter={() => {
            try {
              if (videoRef.current) videoRef.current.play().catch(() => {});
            } catch (e) {}
          }}
          onMouseLeave={() => {
            try {
              if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.currentTime = 0;
              }
            } catch (e) {}
          }}
          className="flex flex-col h-full w-16 group-hover:w-64 transition-[width] duration-200 ease-linear bg-sky-50 dark:bg-background group-hover:bg-card border-r-2 border-sky-200 group-hover:border-border overflow-hidden z-20 group-hover:z-40"
          style={{ willChange: 'width' }}
        >
          {panel}
        </aside>
      </div>
    </>
  );
};
