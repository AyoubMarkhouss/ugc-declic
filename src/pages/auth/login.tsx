"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../../lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: signInData, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !signInData.session) {
      toast({ title: "Login failed", description: error?.message });
      setLoading(false);
      return;
    }

    // ✅ Get user ID
    const userId = signInData.session.user.id;

    // ✅ Check role from profiles table
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    if (profileError || !profile) {
      toast({
        title: "Login error",
        description: "Unable to fetch user role.",
      });
      setLoading(false);
      return;
    }

    // ✅ Redirect based on role
    if (profile.role === "creator") {
      router.push("/creator/dashboard");
    } else if (profile.role === "brand") {
      router.push("/brand/dashboard");
    } else {
      toast({ title: "Unknown user role", description: "Access denied." });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md space-y-6 bg-white p-8 rounded-lg shadow"
      >
        <h1 className="text-2xl font-bold text-center">Login</h1>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </div>
  );
}
