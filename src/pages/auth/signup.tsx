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
  fullName: string;
};

export default function CreatorSignupPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    const { email, password, fullName } = data;

    // Sign up with Supabase Auth
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp(
      {
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`, // where user is redirected after confirmation
        },
      }
    );

    if (signUpError) {
      console.error(signUpError.message);
      setLoading(false);
      return;
    }

    // Insert into profiles table (after signup, even if user not confirmed yet)
    if (signUpData.user) {
      const { error: profileError } = await supabase.from("profiles").insert([
        {
          id: signUpData.user.id,
          full_name: fullName,
          role: "creator",
        },
      ]);

      if (profileError) {
        console.error(profileError.message);
      }
    }

    setEmailSent(true); // Show confirmation message
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      {!emailSent ? (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 w-full max-w-md"
        >
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              {...register("fullName", { required: true })}
            />
            {errors.fullName && (
              <span className="text-red-500 text-sm">
                Full name is required
              </span>
            )}
          </div>

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
              {...register("password", { required: true, minLength: 6 })}
            />
            {errors.password && (
              <span className="text-red-500 text-sm">
                Password must be at least 6 characters
              </span>
            )}
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Signing up..." : "Sign Up as Creator"}
          </Button>
        </form>
      ) : (
        <div className="text-center space-y-4 max-w-md">
          <p className="text-green-600 font-semibold">
            📩 Confirmation email sent!
          </p>
          <p className="text-gray-500">
            Please check your email and click on the confirmation link to
            activate your account.
          </p>
        </div>
      )}
    </div>
  );
}
