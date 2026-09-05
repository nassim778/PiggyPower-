import { NextResponse } from "next/server";
import { getDb, isFirebaseConfigured } from "@/lib/firebase";
import { ensureUserProfile, resolveRole, verifyIdToken } from "@/lib/auth-server";

export async function POST(req: Request) {
  try {
    if (!isFirebaseConfigured()) {
      return NextResponse.json(
        { error: "Auth backend is not configured." },
        { status: 503 },
      );
    }

    const user = await verifyIdToken(req.headers.get("authorization"));
    const body = (await req.json().catch(() => ({}))) as {
      firstName?: string;
      lastName?: string;
      displayName?: string;
    };

    await ensureUserProfile({
      uid: user.uid,
      email: user.email,
      displayName: body.displayName || null,
    });

    if (body.firstName || body.lastName || body.displayName) {
      await getDb()
        .collection("users")
        .doc(user.uid)
        .set(
          {
            firstName: body.firstName || null,
            lastName: body.lastName || null,
            displayName: body.displayName || null,
            updatedAt: new Date().toISOString(),
          },
          { merge: true },
        );
    }

    const role = await resolveRole(user.uid, user.email);
    return NextResponse.json({
      uid: user.uid,
      email: user.email,
      role,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unauthorized";
    const status = message.includes("Admin") ? 403 : 401;
    return NextResponse.json({ error: message }, { status });
  }
}
