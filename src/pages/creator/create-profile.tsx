import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../../lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Toast } from "@/components/ui/toast";
import { toast } from "@/hooks/use-toast";
export default function CreateProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    bio: "",
    instagram_url: "",
    tiktok_url: "",
    youtube_url: "",
    portfolio_url: "",
  });

  // 🚀 Force refresh session on page load
  useEffect(() => {
    const refreshSession = async () => {
      await supabase.auth.refreshSession();
    };
    refreshSession();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    console.log("👉 Starting profile save...");

    let avatarUrl = null;

    if (avatarFile) {
      const fileExt = avatarFile.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, avatarFile);

      if (uploadError) {
        console.error("❌ Avatar upload failed:", uploadError.message);
        setLoading(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      avatarUrl = publicUrlData.publicUrl;
      console.log("✅ Avatar uploaded successfully:", avatarUrl);
    }

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    console.log("🔄 Session data:", session);

    if (sessionError || !session || !session.user) {
      console.error(
        "❌ Session error or no user found:",
        sessionError?.message
      );
      setLoading(false);
      return;
    }

    const userId = session.user.id;
    console.log("✅ User ID found:", userId);

    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        first_name: formData.first_name,
        last_name: formData.last_name,
        bio: formData.bio,
        instagram_url: formData.instagram_url,
        tiktok_url: formData.tiktok_url,
        youtube_url: formData.youtube_url,
        portfolio_url: formData.portfolio_url,
        avatar_url: avatarUrl,
        full_name: `${formData.first_name} ${formData.last_name}`,
      })
      .eq("id", userId);

    if (profileError) {
      console.error("❌ Profile update failed:", profileError.message);
      setLoading(false);
      return;
    }

    // ✅ Show success toast
    toast({
      title: "Profile Completed 🎉",
      description: "Your profile has been saved successfully.",
    });

    // ✅ Redirect after small delay
    setTimeout(() => {
      router.push("/creator/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-center mb-6">
          Complete your Profile
        </h1>

        {/* Avatar Upload */}
        <div className="flex flex-col items-center">
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Avatar Preview"
              className="w-24 h-24 rounded-full object-cover mb-4"
            />
          )}
          <Input type="file" accept="image/*" onChange={handleAvatarChange} />
        </div>

        {/* First Name */}
        <div>
          <Label htmlFor="first_name">First Name</Label>
          <Input
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleInputChange}
          />
        </div>

        {/* Last Name */}
        <div>
          <Label htmlFor="last_name">Last Name</Label>
          <Input
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleInputChange}
          />
        </div>

        {/* Bio */}
        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
          />
        </div>

        {/* Socials */}
        <div>
          <Label htmlFor="instagram_url">Instagram</Label>
          <Input
            id="instagram_url"
            name="instagram_url"
            value={formData.instagram_url}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <Label htmlFor="tiktok_url">TikTok</Label>
          <Input
            id="tiktok_url"
            name="tiktok_url"
            value={formData.tiktok_url}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <Label htmlFor="youtube_url">YouTube</Label>
          <Input
            id="youtube_url"
            name="youtube_url"
            value={formData.youtube_url}
            onChange={handleInputChange}
          />
        </div>

        {/* Portfolio */}
        <div>
          <Label htmlFor="portfolio_url">Portfolio</Label>
          <Input
            id="portfolio_url"
            name="portfolio_url"
            value={formData.portfolio_url}
            onChange={handleInputChange}
          />
        </div>

        {/* Submit */}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Saving..." : "Save Profile"}
        </Button>
      </form>
    </div>
  );
}
