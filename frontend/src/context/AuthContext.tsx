import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';
import { User, StudentProfile } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  profile: StudentProfile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (fullName: string, email: string, password: string, role?: string) => Promise<User>;
  logout: () => void;
  fetchProfile: () => Promise<StudentProfile | null>;
  updateProfile: (data: Partial<StudentProfile>) => Promise<StudentProfile>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('careercompass_token'));
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load current user and profile on initialization
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('careercompass_token');
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const userRes = await api.get<User>('/auth/me');
        setUser(userRes.data);
        localStorage.setItem('careercompass_user', JSON.stringify(userRes.data));

        if (userRes.data.role === 'student') {
          try {
            const profileRes = await api.get<StudentProfile>('/students/profile');
            setProfile(profileRes.data);
          } catch (profileErr) {
            console.warn('Profile fetch note:', profileErr);
          }
        }
      } catch (err) {
        console.error('Failed to restore session:', err);
        localStorage.removeItem('careercompass_token');
        localStorage.removeItem('careercompass_user');
        setUser(null);
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { access_token, user: loggedUser } = res.data;
      
      localStorage.setItem('careercompass_token', access_token);
      localStorage.setItem('careercompass_user', JSON.stringify(loggedUser));
      setToken(access_token);
      setUser(loggedUser);

      if (loggedUser.role === 'student') {
        try {
          const profileRes = await api.get<StudentProfile>('/students/profile');
          setProfile(profileRes.data);
        } catch {
          // Profile may be empty initially
        }
      }

      return loggedUser;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    fullName: string,
    email: string,
    password: string,
    role: string = 'student'
  ): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/register', {
        full_name: fullName,
        email,
        password,
        role,
      });
      const { access_token, user: registeredUser } = res.data;

      localStorage.setItem('careercompass_token', access_token);
      localStorage.setItem('careercompass_user', JSON.stringify(registeredUser));
      setToken(access_token);
      setUser(registeredUser);

      return registeredUser;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('careercompass_token');
    localStorage.removeItem('careercompass_user');
    setToken(null);
    setUser(null);
    setProfile(null);
  };

  const fetchProfile = async (): Promise<StudentProfile | null> => {
    try {
      const res = await api.get<StudentProfile>('/students/profile');
      setProfile(res.data);
      return res.data;
    } catch (err) {
      console.error('Error fetching profile:', err);
      return null;
    }
  };

  const updateProfile = async (data: Partial<StudentProfile>): Promise<StudentProfile> => {
    const res = await api.put<StudentProfile>('/students/profile', data);
    setProfile(res.data);
    return res.data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        profile,
        isLoading,
        login,
        register,
        logout,
        fetchProfile,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

