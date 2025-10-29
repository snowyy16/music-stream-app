// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

// Định nghĩa kiểu dữ liệu cho người dùng
interface User {
  username: string;
  email: string;
  // Thêm các trường khác nếu cần
}

// Định nghĩa kiểu cho Context Value
interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

// Tạo Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider Component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Hàm được gọi khi đăng nhập thành công
  const login = (userData: User) => {
    // Chúng ta chỉ lưu username và email là đủ cho mục đích này
    setUser({ username: userData.username, email: userData.email });
  };

  // Hàm được gọi khi đăng xuất
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook để dễ dàng truy cập Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
