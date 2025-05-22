import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import database from "@/infra/database";

export async function POST(request: Request) {
  try {
    const { username, email, password, referralCode } = await request.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { message: "Username, email, and password are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUserResult = await database.query({
      text: "SELECT * FROM users WHERE email = $1 OR username = $2",
      values: [email, username],
    });

    if (existingUserResult.rows.length > 0) {
      const existingField = existingUserResult.rows[0].email === email ? "Email" : "Username";
      return NextResponse.json(
        { message: `${existingField} already exists` },
        { status: 409 } // 409 Conflict
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // TODO: Add referral code logic if needed

    const result = await database.query({
      text: "INSERT INTO users (username, email, password, created_at, updated_at, user_role, status) VALUES ($1, $2, $3, NOW(), NOW(), 'user', 'active') RETURNING id, username, email, created_at, user_role, status",
      values: [username, email, hashedPassword],
    });

    const newUser = result.rows[0];

    return NextResponse.json({
      message: "User registered successfully",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        createdAt: newUser.created_at,
        role: newUser.user_role,
        status: newUser.status
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
} 