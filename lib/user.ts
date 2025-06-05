// lib/user.ts

import database from "@/infra/database";

export async function createUser(userDetails: {
  username: string;
  email: string;
  password: string;
}) {
  try {
    // Insert the new user
    const result = await database.query({
      text: `
        INSERT INTO users (username, email, password)
        VALUES ($1, $2, $3)
        RETURNING id
      `,
      values: [
        userDetails.username,
        userDetails.email,
        userDetails.password
      ],
    });

    const newUserId = result.rows[0].id;
    return newUserId;

    // If there's a valid referrer, process the referral
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
}