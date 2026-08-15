import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  createSessionToken,
  setSessionCookie,
  verifyPassword,
} from "@/lib/auth";
import { loginSchema } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Identifiants invalides" },
        { status: 400 },
      );
    }

    const admin = await prisma.admin.findUnique({
      where: { email: parsed.data.email.toLowerCase() },
    });

    if (!admin) {
      return NextResponse.json(
        { error: "E-mail ou mot de passe incorrect" },
        { status: 401 },
      );
    }

    const valid = await verifyPassword(parsed.data.password, admin.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { error: "E-mail ou mot de passe incorrect" },
        { status: 401 },
      );
    }

    const token = await createSessionToken({
      sub: admin.id,
      email: admin.email,
      name: admin.name,
    });
    await setSessionCookie(token);

    return NextResponse.json({ ok: true, name: admin.name });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
