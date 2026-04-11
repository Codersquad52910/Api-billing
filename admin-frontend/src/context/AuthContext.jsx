import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(() => localStorage.getItem("adminRole"));
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        const storedRole = localStorage.getItem("adminRole");
        console.log("AuthContext Init:", { token, storedRole });
        setLoading(false);
    }, []);

    const login = (token, userRole) => {
        localStorage.setItem("adminToken", token);
        localStorage.setItem("adminRole", userRole);
        setRole(userRole);
        navigate("/dashboard");
    };

    const logout = () => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminRole");
        setUser(null);
        setRole(null);
        navigate("/");
    };

    return (
        <AuthContext.Provider value={{ user, role, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

