import { useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "../../../lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/router";

type FormData = {
  email: string;
  password: string;
};

export default function CreatorLoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setErrorMessage(null);

    const { email, password } = data;

    // Try to login
    const { data: loginData, error: loginError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (loginError || !loginData.user) {
      console.error(loginError?.message || "Login failed");
      setErrorMessage("Invalid credentials. Please try again.");
      setLoading(false);
      return;
    }

    // Fetch user profile to check role
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", loginData.user.id)
      .single();

    if (profileError || !profile) {
      console.error(profileError?.message || "Profile not found");
      setErrorMessage("Could not fetch user role. Please contact support.");
      setLoading(false);
      return;
    }

    // Redirect based on role
    if (profile.role === "creator") {
      router.push("/creator/dashboard");
    } else if (profile.role === "brand") {
      router.push("/brand/dashboard");
    } else if (profile.role === "admin") {
      router.push("/admin/dashboard");
    } else {
      router.push("/"); // fallback
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 w-full max-w-md"
      >
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>

        {errorMessage && (
          <div className="text-red-500 text-center mb-4">{errorMessage}</div>
        )}

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register("email", { required: true })}
          />
          {errors.email && (
            <span className="text-red-500 text-sm">Email is required</span>
          )}
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            {...register("password", { required: true })}
          />
          {errors.password && (
            <span className="text-red-500 text-sm">Password is required</span>
          )}
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </div>
  );
}
