import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, roles }) => {
    const { role, loading } = useAuth();
    const token = localStorage.getItem("adminToken");

    if (loading) return <div className="flex h-screen items-center justify-center text-slate-500">Loading Auth...</div>;

    if (!token) {
        return <Navigate to="/" />;
    }

    if (roles && !roles.includes(role)) {
        console.warn("ProtectedRoute: Role mismatch. Redirecting to /", { userRole: role, allowedRoles: roles });
        return <Navigate to="/" />; // Redirect to login if unauthorized
    }

    return children;
};

export default ProtectedRoute;
