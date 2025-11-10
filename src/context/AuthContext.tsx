import React, { createContext, useContext, useState, ReactNode } from "react";
import { stopActiveSound } from "../player/manager"; // 

interface User {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isLoggedIn: boolean;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);


interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);


  const login = (userData: User) => {
    setUser({
      _id: userData._id,
      username: userData.username,
      email: userData.email,
      avatar: userData.avatar !== undefined && userData.avatar !== ""
        ? userData.avatar
        : "https://cdn-icons-png.flaticon.com/512/4825/4825038.png",
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
    });
  };

  const logout = async () => {
    // 🧩 Dừng nhạc khi user logout
    try {
      await stopActiveSound();
    } catch (e) {
      console.warn("Không thể dừng nhạc khi logout:", e);
    }

    setUser(null);
  };


  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        setUser,
        isLoggedIn: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
