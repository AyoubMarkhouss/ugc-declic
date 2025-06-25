"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../../lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export default function BrandCreateProfile() {
  const router = useRouter();
  const [brandName, setBrandName] = useState("");
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const initSession = async () => {
      await supabase.auth.refreshSession(); // ensures token is valid
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        toast({
          title: "Session error",
          description: error?.message || "Please login again",
        });
        return router.push("/auth/login");
      }
      setUserId(data.user.id);
    };
    initSession();
  }, [router]);

  const handleSave = async () => {
    if (!userId || !brandName) return;
    setLoading(true);

    // 1. Insert brand info into brands table
    const { error: brandError } = await supabase.from("brands").upsert({
      id: userId,
      company_name: brandName,
      website,
    });

    if (brandError) {
      toast({
        title: "Failed to save brand info",
        description: brandError.message,
      });
      setLoading(false);
      return;
    }

    // 2. Update role in profiles table
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({ id: userId, role: "brand" });

    if (profileError) {
      toast({
        title: "Profile role update failed",
        description: profileError.message,
      });
      setLoading(false);
      return;
    }

    toast({
      title: "Profile created 🎉",
      description: "Welcome to the dashboard.",
    });
    router.push("/brand/dashboard");
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 border rounded-xl shadow-sm">
      <h1 className="text-2xl font-bold mb-6">Complete Your Brand Profile</h1>
      <div className="space-y-4">
        <div>
          <Label>Brand Name</Label>
          <Input
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            required
          />
        </div>
        <div>
          <Label>Website (optional)</Label>
          <Input value={website} onChange={(e) => setWebsite(e.target.value)} />
        </div>
        <Button
          onClick={handleSave}
          disabled={loading || !brandName}
          className="w-full bg-green-600"
        >
          {loading ? "Saving..." : "Save Profile"}
        </Button>
      </div>
    </div>
  );
}
