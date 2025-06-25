// pages/api/delete-user.ts
import type { NextApiRequest, NextApiResponse } from "next";
import supabaseAdmin from "../../../utils/supabase-admin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "Missing userId" });
  }

  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

  if (error) {
    console.error("Delete user error:", error);
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ message: "User deleted successfully" });
}
