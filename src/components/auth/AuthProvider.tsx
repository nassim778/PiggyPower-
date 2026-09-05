"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { getClientAuth, isFirebaseClientConfigured } from "@/lib/firebase-client";

export type UserRole = "customer" | "admin";

interface AuthContextValue {
  user: User | null;
  role: UserRole | null;
  loading: boolean;
  configured: boolean;
  getIdToken: () => Promise<string | null>;
  login: (email: string, password: string) => Promise<UserRole>;
  loginWithGoogle: () => Promise<UserRole>;
  register: (input: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => Promise<UserRole>;
  logout: () => Promise<void>;
  refreshRole: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function syncAndGetRole(
  token: string,
  body?: Record<string, string>,
): Promise<UserRole> {
  let res: Response;
  try {
    res = await fetch("/api/auth/sync", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error(
      "Could not reach the auth server. Restart npm run dev and try again.",
    );
  }
  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(data.error || "Failed to sync account.");
  }
  const data = (await res.json()) as { role?: UserRole };
  return data.role === "admin" ? "admin" : "customer";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const configured = isFirebaseClientConfigured();
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshRole = useCallback(async () => {
    const auth = getClientAuth();
    const current = auth.currentUser;
    if (!current) {
      setRole(null);
      return;
    }
    const token = await current.getIdToken();
    const r = await syncAndGetRole(token);
    setRole(r);
  }, []);

  useEffect(() => {
    if (!configured) {
      setLoading(false);
      return;
    }

    const auth = getClientAuth();
    const unsub = onAuthStateChanged(auth, async (next) => {
      setUser(next);
      if (next) {
        try {
          const token = await next.getIdToken();
          const r = await syncAndGetRole(token);
          setRole(r);
        } catch {
          setRole("customer");
        }
      } else {
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsub();
  }, [configured]);

  const getIdToken = useCallback(async () => {
    if (!user) return null;
    return user.getIdToken();
  }, [user]);

  const login = useCallback(async (email: string, password: string) => {
    const cred = await signInWithEmailAndPassword(getClientAuth(), email, password);
    const token = await cred.user.getIdToken();
    const r = await syncAndGetRole(token);
    setRole(r);
    return r;
  }, []);

  const loginWithGoogle = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    const cred = await signInWithPopup(getClientAuth(), provider);
    const displayName = cred.user.displayName || "";
    const [firstName = "", ...rest] = displayName.trim().split(/\s+/);
    const lastName = rest.join(" ");
    const token = await cred.user.getIdToken();
    const r = await syncAndGetRole(token, {
      displayName,
      firstName,
      lastName,
    });
    setRole(r);
    return r;
  }, []);

  const register = useCallback(
    async (input: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
    }) => {
      const cred = await createUserWithEmailAndPassword(
        getClientAuth(),
        input.email,
        input.password,
      );
      const displayName = `${input.firstName} ${input.lastName}`.trim();
      await updateProfile(cred.user, { displayName });

      const token = await cred.user.getIdToken();
      const r = await syncAndGetRole(token, {
        firstName: input.firstName,
        lastName: input.lastName,
        displayName,
      });
      setRole(r);
      return r;
    },
    [],
  );

  const logout = useCallback(async () => {
    await firebaseSignOut(getClientAuth());
    setRole(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      role,
      loading,
      configured,
      getIdToken,
      login,
      loginWithGoogle,
      register,
      logout,
      refreshRole,
    }),
    [
      user,
      role,
      loading,
      configured,
      getIdToken,
      login,
      loginWithGoogle,
      register,
      logout,
      refreshRole,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
