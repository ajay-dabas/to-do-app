import axios, { isAxiosError } from "axios";
import type { ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "react-toastify";
import { AuthState } from "./definitions/types";
import { useNavigate } from "react-router-dom";

const initialState: AuthState = {
  isAuthenticated: false,
  setIsAuthenticated: () => null,
  token: null,
  setToken: () => null,
  loginUser: () => Promise.resolve(),
  registerUser: () => Promise.resolve(),
  logoutUser: () => {},
};

const Context = createContext<AuthState>(initialState);

const useAuth = () => useContext<AuthState>(Context);

const useCheckLogin = ({
  redirectOnLogin,
  redirectIfNotLoggedIn,
}: {
  redirectOnLogin?: string;
  redirectIfNotLoggedIn?: string;
}) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (redirectOnLogin && isAuthenticated) {
      navigate(redirectOnLogin);
    }
    if (redirectIfNotLoggedIn && !isAuthenticated) {
      navigate(redirectIfNotLoggedIn);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);
};

type Props = {
  children: ReactNode;
};

const AuthProvider = (props: Props) => {
  const { children } = props;
  const [isAuthenticated, setIsAuthenticated] = useState<
    AuthState["isAuthenticated"]
  >(initialState.isAuthenticated);
  const [token, setToken] = useState<AuthState["token"]>(initialState.token);

  const loginWithToken = useCallback((token: string) => {
    localStorage.setItem("token", token);
    axios.defaults.headers.common["x-auth-token"] = token;
    setToken(token);
    setIsAuthenticated(true);
  }, []);

  const logoutUser = useCallback(() => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["x-auth-token"];
    setIsAuthenticated(false);
    setToken(null);
  }, []);

  const loginUser = useCallback(
    async (email: string, password: string) => {
      try {
        const res = await axios.post("/api/auth", { email, password });
        loginWithToken(res.data.token);
        toast.success("You have logged in successfully");
      } catch (err) {
        if (isAxiosError(err)) {
          const errors = err.response?.data.errors;
          if (errors) {
            errors.forEach((error: { msg: string }) => toast.error(error.msg));
          }
        }
        throw err;
      }
    },
    [loginWithToken],
  );

  const registerUser = useCallback(
    async (name: string, email: string, password: string) => {
      try {
        const res = await axios.post("/api/users", { name, email, password });
        loginWithToken(res.data.token);
        toast.success("You have registered successfully");
      } catch (err) {
        if (isAxiosError(err)) {
          const errors = err.response?.data.errors;
          if (errors) {
            errors.forEach((error: { msg: string }) => toast.error(error.msg));
          }
        }
        throw err;
      }
    },
    [loginWithToken],
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      loginWithToken(token);
    }
  }, [loginWithToken]);

  return (
    <Context.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        token,
        setToken,
        loginUser,
        registerUser,
        logoutUser,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export { useAuth, useCheckLogin, AuthProvider };
