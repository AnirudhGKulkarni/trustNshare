import React, { useRef } from 'react';
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
import { useAuth } from '@/contexts/AuthContext';

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

export const Sidebar = ({ mobileOpen = false, onClose }: { mobileOpen?: boolean; onClose?: () => void }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { profile } = useAuth();
  const isClient = profile?.role === 'client';

  const filteredNavigation = navigation.filter((item) => {
    // hide any security-related nav items for client users
    if (isClient && item.name.toLowerCase().includes('security')) return false;
    return true;
  });

  const panel = (
    <div className="flex flex-col h-full">
      {/* Desktop and mobile share panel markup; desktop will be collapsed by default via wrapper classes below */}
      <div className="w-full">
        <div className="h-20 border-b border-border flex items-center">
          <div className="w-full h-20 flex items-center px-2">
            {/* Logo: show compact shield in collapsed state and full image on hover */}
              <div className="flex items-center gap-3 w-full h-full relative">
              {/* Compact favicon (visible when collapsed) - show both favicons and make them larger and slightly overlapped */}
              <div className="flex items-center justify-center w-14 h-14 flex-shrink-0 z-10">
                {/* Single favicon per theme — hide on sidebar hover so expanded image/video shows */}
                <img src="/favicon.ico" alt="favicon-light" className="h-9 w-9 object-contain transition-all duration-150 block dark:hidden group-hover:opacity-0" />
                <img src="/favicon2.ico" alt="favicon-dark" className="h-9 w-9 object-contain transition-all duration-150 hidden dark:block group-hover:opacity-0" />
              </div>

              {/* Expanded area: fills the entire header box when hovered */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {/* Show light image when not dark, and dark image when dark mode enabled. Images are above video and use contain so full logo is visible. */}
                <img src="/lbg.png" alt="trustNshare light" className="absolute inset-0 m-auto max-h-full max-w-full object-contain opacity-0 group-hover:opacity-100 transition-opacity duration-200 block dark:hidden z-20 p-2" />
                <img src="/bg.png" alt="trustNshare dark" className="absolute inset-0 m-auto max-h-full max-w-full object-contain opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden dark:block z-20 p-2" />
                {/* Video remains optional and placed behind images */}
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
        {filteredNavigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            title={item.name}
            className={({ isActive }) =>
              cn(
                // center icons when collapsed, align left on hover
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
    </div>
  );

  return (
    <>
      {/* Mobile drawer */}
      <div className={`fixed inset-0 z-40 lg:hidden ${mobileOpen ? '' : 'pointer-events-none'}`} aria-hidden={!mobileOpen}>
        <div
          className={`fixed inset-0 bg-black transition-opacity ${mobileOpen ? 'opacity-60' : 'opacity-0'}`}
          onClick={onClose}
        />

        <div className={`fixed left-0 top-0 bottom-0 w-64 transform transition-transform ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          {panel}
        </div>
      </div>

      {/* Desktop sidebar: collapsed to icons (w-16) and expands to full (w-64) on hover */}
      <div className="hidden lg:block group">
        <aside
          onMouseEnter={() => {
            try {
              if (videoRef.current) {
                videoRef.current.play().catch(() => {});
              }
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
