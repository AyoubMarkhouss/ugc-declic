"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { useRouter } from "next/router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

export default function BrandSignup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [brandName, setBrandName] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const router = useRouter();

  const handleSignup = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/brand/create-profile`,
        data: { role: "brand", brand_name: brandName },
      },
    });
    if (error) {
      toast({ title: "Signup failed", description: error.message });
    } else {
      setEmailSent(true);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 border rounded-xl shadow-sm">
      <h1 className="text-2xl font-bold mb-6">Brand Sign Up</h1>
      {emailSent ? (
        <p className="text-green-600">
          A confirmation email has been sent to {email}. Please check your
          inbox.
        </p>
      ) : (
        <div className="space-y-4">
          <div>
            <Label>Brand Name</Label>
            <Input
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <Label>Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button
            onClick={handleSignup}
            disabled={loading || !email || !password || !brandName}
            className="w-full bg-green-600"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </Button>
        </div>
      )}
    </div>
  );
}
