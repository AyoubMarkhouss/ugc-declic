import { useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../../lib/supabaseClient";

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const checkUserProfile = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("No user session found");
        router.push("/auth/login");
        return;
      }

      // Fetch profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError.message);
        router.push("/auth/login");
        return;
      }

      // Check if first_name and last_name are filled
      if (!profile?.first_name || !profile?.last_name) {
        router.push("/creator/create-profile"); // incomplete profile
      } else {
        router.push("/creator/dashboard"); // profile complete
      }
    };

    checkUserProfile();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Checking your account... 🔄</p>
    </div>
  );
}
