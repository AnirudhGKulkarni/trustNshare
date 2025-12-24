import React, { useRef, useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home,
  FolderOpen,
  Upload,
  MessageSquare,
  History,
  Lock,
  UserCircle,
  ChevronRight,
  Activity as ActivityIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { firestore } from '@/lib/firebase';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';

const navigation = [
  { name: 'Dashboard', href: '/client', icon: Home, end: true },
  { name: 'Share Files', href: '/client/share', icon: Upload },
  { name: 'Policies', href: '/client/policies', icon: FolderOpen },
  { name: 'Chat', href: '/client/messages', icon: MessageSquare },
  { name: 'Activity', href: '/client/activity', icon: History },
  { name: 'Security', href: '/client/security', icon: Lock },
  { name: 'Profile', href: '/client/profile', icon: UserCircle },
];

interface ActivityItem {
  id: string;
  action: string;
  resource?: string;
  timestamp?: any;
}

const getRelativeTime = (ts: any): string => {
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

export const ClientSidebar = ({ mobileOpen = false, onClose }: { mobileOpen?: boolean; onClose?: () => void }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { currentUser, profile } = useAuth();
  const isClient = profile?.role === 'client';
  const filteredNavigation = navigation.filter((item) => {
    if (isClient && item.name.toLowerCase().includes('security')) return false;
    return true;
  });
  const activityRef = useRef<HTMLDivElement | null>(null);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([]);

  // Fetch real activity data from Firestore
  useEffect(() => {
    if (!currentUser) return;

    const logsRef = collection(firestore, 'audit_logs');
    const q = query(logsRef, where('userId', '==', currentUser.uid), orderBy('timestamp', 'desc'), limit(5));
    
    const unsub = onSnapshot(q, (snap) => {
      const out: ActivityItem[] = [];
      snap.forEach((d) => {
        const data = d.data() as any;
        out.push({ 
          id: d.id, 
          action: data.action ?? 'Activity', 
          resource: data.resource,
          timestamp: data.timestamp ?? data.createdAt 
        });
      });
      setRecentActivities(out);
    }, (err) => {
      console.error('Activity fetch error:', err);
      setRecentActivities([]);
    });

    return () => unsub();
  }, [currentUser]);

  // Detect horizontal overflow
  useEffect(() => {
    const el = activityRef.current;
    if (!el) {
      setCanScrollRight(false);
      return;
    }

    const update = () => {
      setCanScrollRight(el.scrollWidth > el.clientWidth && el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    };

    update();
    window.addEventListener('resize', update);
    el.addEventListener('scroll', update);

    return () => {
      window.removeEventListener('resize', update);
      el.removeEventListener('scroll', update);
    };
  }, [recentActivities]);

  const panel = (
    <div className="flex flex-col h-full">
      <div className="w-full">
        <div className="h-20 border-b border-border flex items-center">
          <div className="w-full h-20 flex items-center justify-center px-2">
            {/* Logo: Show full logo on mobile, compact on desktop collapsed state */}
            <div className="flex items-center justify-center w-full h-full relative">
              {/* Compact favicon (desktop only, hidden on mobile) */}
              <div className="hidden lg:flex items-center justify-center w-14 h-14 flex-shrink-0 z-10 group-hover:hidden">
                <img src="/favicon.ico" alt="favicon-light" className="h-8 w-8 object-contain block dark:hidden" />
                <img src="/favicon2.ico" alt="favicon-dark" className="h-8 w-8 object-contain hidden dark:block" />
              </div>

              {/* Full logo (visible on mobile and on desktop hover) */}
              <div className="hidden lg:flex lg:opacity-0 opacity-100 lg:group-hover:flex lg:group-hover:opacity-100 transition-opacity duration-200 items-center justify-center">
                <img src="/lbg.png" alt="trustNshare light" className="max-h-16 max-w-full object-contain block dark:hidden" />
                <img src="/bg.png" alt="trustNshare dark" className="max-h-16 max-w-full object-contain hidden dark:block" />
              </div>

              {/* Mobile logo */}
              <div className="lg:hidden flex items-center justify-center">
                <img src="/lbg.png" alt="trustNshare light" className="max-h-16 max-w-full object-contain block dark:hidden" />
                <img src="/bg.png" alt="trustNshare dark" className="max-h-16 max-w-full object-contain hidden dark:block" />
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
            end={(item as any).end}
            title={item.name}
            className={({ isActive }) =>
              cn(
                'flex items-center transition-all duration-150 rounded-lg',
                'lg:justify-center lg:group-hover:justify-start justify-start',
                'px-3 lg:px-0 lg:group-hover:px-3',
                'py-2.5 text-sm font-medium',
                'hover:bg-secondary hover:text-foreground',
                isActive ? 'lg:group-hover:bg-gradient-to-r lg:group-hover:from-blue-500 lg:group-hover:to-purple-600 lg:group-hover:text-white bg-gradient-to-r from-blue-500 to-purple-600 text-white' : 'text-muted-foreground'
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
                <span className="ml-3 overflow-hidden lg:max-w-0 lg:opacity-0 max-w-xs opacity-100 group-hover:max-w-xs group-hover:opacity-100 transition-[max-width,opacity] duration-200 whitespace-nowrap">{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Sidebar compacted: support card and recent-activity removed per request */}
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

        <div className={`fixed left-0 top-0 bottom-0 w-64 transform transition-transform ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} bg-card border-r border-border`}>
          {panel}
        </div>
      </div>

      {/* Desktop sidebar: collapsed icon rail expands on hover */}
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
          className="flex flex-col h-full w-16 group-hover:w-64 transition-[width] duration-200 ease-linear bg-sky-50 dark:bg-background group-hover:bg-white dark:group-hover:bg-card border-r-2 border-sky-200 group-hover:border-border overflow-hidden z-20 group-hover:z-40"
          style={{ willChange: 'width' }}
        >
          {panel}
        </aside>
      </div>
    </>
  );
};
