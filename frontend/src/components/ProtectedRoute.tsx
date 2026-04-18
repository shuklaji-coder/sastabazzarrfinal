import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();
  const [isMounting, setIsMounting] = useState(true);

  useEffect(() => {
    // Small delay to allow localStorage to propagate on initial hook mount
    const timer = setTimeout(() => setIsMounting(false), 100);
    return () => clearTimeout(timer);
  }, []);

  if (isMounting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect inactive sessions to login but save the attempted destination
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    // Example: Only 'ROLE_ADMIN' maps to 'ADMIN' requirement
    // backend generates "ROLE_CUSTOMER" or "ROLE_ADMIN". Aligning logic.
    const normalizedRole = role?.replace('ROLE_', '').toUpperCase();
    console.log("Current Auth Role:", role);
    console.log("Normalized Role:", normalizedRole);
    console.log("Allowed Roles:", allowedRoles);
    
    if (!normalizedRole || !allowedRoles.includes(normalizedRole)) {
      // Valid user, invalid role
      console.warn(`Access Denied. User role '${normalizedRole}' does not match required roles: ${allowedRoles.join(', ')}`);
      
      // Delay toast slightly to ensure it shows after redirect
      setTimeout(() => {
        toast.error("Access Denied", {
          description: `You do not have permission to view this page. Required roles: ${allowedRoles.join(', ')}`,
        });
      }, 100);

      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};
