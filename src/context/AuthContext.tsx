// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

// 🧩 Định nghĩa kiểu dữ liệu cho người dùng
interface User {
  username: string;
  email: string;
  avatar?: string; // ✅ Thêm avatar, có thể rỗng nếu chưa có
}

// 🧩 Định nghĩa kiểu cho Context Value
interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>; // ✅ Cho phép cập nhật avatar
}

// 🧩 Tạo Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 🧩 Provider Component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // ✅ Khi đăng nhập thành công
  const login = (userData: User) => {
    setUser({
      username: userData.username,
      email: userData.email,
      avatar: userData.avatar || "https://picsum.photos/200/200", // có avatar thì dùng, không thì default
    });
  };

  // ✅ Khi đăng xuất
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// 🧩 Custom Hook để dễ dàng truy cập Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
