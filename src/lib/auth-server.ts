import { getAuth } from "firebase-admin/auth";
import { getDb, getFirebaseApp, isFirebaseConfigured } from "@/lib/firebase";

export type UserRole = "customer" | "admin";

export interface AuthUser {
  uid: string;
  email: string | null;
  role: UserRole;
}

function adminEmails(): Set<string> {
  const raw = process.env.ADMIN_EMAILS || "";
  return new Set(
    raw
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean),
  );
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return adminEmails().has(email.trim().toLowerCase());
}

export async function resolveRole(
  uid: string,
  email: string | null,
): Promise<UserRole> {
  if (isAdminEmail(email)) return "admin";

  if (!isFirebaseConfigured()) return "customer";

  const snap = await getDb().collection("users").doc(uid).get();
  const role = snap.data()?.role;
  if (role === "admin") return "admin";
  return "customer";
}

export async function ensureUserProfile(input: {
  uid: string;
  email: string | null;
  displayName?: string | null;
}) {
  if (!isFirebaseConfigured()) return;

  const ref = getDb().collection("users").doc(input.uid);
  const existing = await ref.get();
  const role = await resolveRole(input.uid, input.email);

  if (!existing.exists) {
    await ref.set({
      email: input.email,
      displayName: input.displayName || null,
      role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return;
  }

  // Promote if email was added to ADMIN_EMAILS
  if (role === "admin" && existing.data()?.role !== "admin") {
    await ref.set(
      { role: "admin", updatedAt: new Date().toISOString() },
      { merge: true },
    );
  }
}

export async function verifyIdToken(
  authorizationHeader: string | null,
): Promise<AuthUser> {
  if (!isFirebaseConfigured()) {
    throw new Error("Firebase Admin is not configured.");
  }

  if (!authorizationHeader?.startsWith("Bearer ")) {
    throw new Error("Missing authorization token.");
  }

  const token = authorizationHeader.slice("Bearer ".length).trim();
  if (!token) throw new Error("Missing authorization token.");

  getFirebaseApp();
  const decoded = await getAuth().verifyIdToken(token);
  const role = await resolveRole(decoded.uid, decoded.email ?? null);

  return {
    uid: decoded.uid,
    email: decoded.email ?? null,
    role,
  };
}

export async function requireAdmin(
  authorizationHeader: string | null,
): Promise<AuthUser> {
  const user = await verifyIdToken(authorizationHeader);
  if (user.role !== "admin") {
    throw new Error("Admin access required.");
  }
  return user;
}
