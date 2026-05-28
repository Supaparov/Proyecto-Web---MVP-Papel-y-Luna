import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const isCashier = useAuthStore((state) => state.isCashier);

  return {
    token,
    user,
    isAuthenticated,
    login,
    logout,
    isAdmin: isAdmin(),
    isCashier: isCashier()
  };
};
