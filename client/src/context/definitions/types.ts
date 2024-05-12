export type AuthState = {
  isAuthenticated: boolean;
  setIsAuthenticated: (x: boolean) => void;
  token: string | null;
  setToken: (x: string | null) => void;
  loginUser: (email: string, password: string) => Promise<void>;
  registerUser: (
    name: string,
    email: string,
    password: string,
  ) => Promise<void>;
  logoutUser: () => void;
};
