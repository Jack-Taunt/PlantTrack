import { createContext, useContext, useEffect, useState } from "react";
import api from "../../client/client"
import type { User } from "../../types/user";

interface AuthContextType {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        
        const fetchUser = async () => {
            try {
                const response = await api.get("/users/me");
                setUser(response.data);
            } catch (err: any) {
                if (err.response?.status === 401) {
                    setUser(null);
                }
            }
        }
        fetchUser()
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>

    )
}

export default AuthProvider;

export const useAuth = (): AuthContextType => { 
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used inside an AuthProvider");
    }
    return ctx;
}
