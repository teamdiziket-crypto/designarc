import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Award,
  ShieldCheck,
  Settings,
  LogOut,
  GraduationCap,
} from 'lucide-react';
import logoFull from '@/assets/logo-full.png';
import logoIcon from '@/assets/logo-icon.png';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Students', href: '/students', icon: Users },
  { name: 'Courses', href: '/courses', icon: GraduationCap },
  { name: 'Certificates', href: '/certificates', icon: Award },
  { name: 'Verify', href: '/verify', icon: ShieldCheck },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    toast.success('Logged out successfully');
    navigate('/auth');
  };

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <img src={logoIcon} alt="Design Arc" className="w-10 h-10 rounded-xl" />
          <img src={logoFull} alt="Design Arc Academy" className="h-8 object-contain" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`sidebar-link ${isActive ? 'active' : ''}`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Admin Info */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-sidebar-accent">
          <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-sm font-semibold text-primary">
              {user?.email ? getInitials(user.email) : 'AD'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              Admin
            </p>
            <p className="text-xs text-sidebar-foreground/60 truncate">
              {user?.email || 'admin@designarc.com'}
            </p>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-sidebar-border transition-colors text-sidebar-foreground/60 hover:text-sidebar-foreground"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}