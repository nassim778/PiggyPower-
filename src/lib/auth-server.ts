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

/** Accept "admin" / "Admin" / whitespace; anything else is customer. */
export function normalizeRole(raw: unknown): UserRole {
  return String(raw ?? "")
    .trim()
    .toLowerCase() === "admin"
    ? "admin"
    : "customer";
}

/**
 * Source of truth: Firestore `users/{uid}.role`.
 * Change it to "admin" or "customer" in the console — the app reads that value.
 */
export async function resolveRole(
  uid: string,
  email: string | null,
): Promise<UserRole> {
  if (isFirebaseConfigured()) {
    const snap = await getDb().collection("users").doc(uid).get();
    if (snap.exists) {
      const data = snap.data() || {};
      // Prefer `role`, but also accept accidental `Role`
      const raw = data.role ?? data.Role;
      if (raw !== undefined && raw !== null && String(raw).trim() !== "") {
        return normalizeRole(raw);
      }
    }
  }

  if (isAdminEmail(email)) return "admin";
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

  if (!existing.exists) {
    // New users only — never overwrite role on existing docs
    await ref.set({
      email: input.email,
      displayName: input.displayName || null,
      role: "customer",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return;
  }

  // Existing user: update profile fields only — do NOT touch `role`
  const data = existing.data() || {};
  const updates: Record<string, unknown> = {};

  if (input.email && data.email !== input.email) {
    updates.email = input.email;
  }
  if (
    input.displayName &&
    input.displayName !== data.displayName &&
    !data.displayName
  ) {
    updates.displayName = input.displayName;
  }

  if (Object.keys(updates).length > 0) {
    updates.updatedAt = new Date().toISOString();
    await ref.set(updates, { merge: true });
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
