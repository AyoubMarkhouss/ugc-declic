"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../../lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
    date_of_birth: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    instagram_url: "",
    linkedin_url: "",
    portfolio_url: "",
  });

  useEffect(() => {
    supabase.auth.refreshSession();
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

    let avatarUrl = null;

    if (avatarFile) {
      const fileExt = avatarFile.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, avatarFile);

      if (uploadError) {
        console.error("Avatar upload failed:", uploadError.message);
        setLoading(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      avatarUrl = publicUrlData.publicUrl;
    }

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session?.user) {
      console.error("Session error:", sessionError?.message);
      setLoading(false);
      return;
    }

    const userId = session.user.id;

    const { error: profileError } = await supabase
      .from("profiles")
      .upsert([
        {
          id: userId,
          ...formData,
          avatar_url: avatarUrl,
          full_name: `${formData.first_name} ${formData.last_name}`,
          role: "creator",
        },
      ])
      .eq("id", userId);

    if (profileError) {
      console.error("Profile save failed:", profileError.message);
      setLoading(false);
      return;
    }

    toast({
      title: "Profile Completed 🎉",
      description: "Your profile has been saved successfully.",
    });

    setTimeout(() => {
      router.push("/creator/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl space-y-6 bg-white p-8 rounded-xl shadow-lg"
      >
        <h1 className="text-2xl font-bold text-center mb-6">
          Complete Your Profile
        </h1>

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="first_name">First Name</Label>
            <Input
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="last_name">Last Name</Label>
            <Input
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <Label htmlFor="date_of_birth">Date of Birth</Label>
            <Input
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="country">Country</Label>
            <Input
              name="country"
              value={formData.country}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <Label htmlFor="city">City</Label>
            <Input
              name="city"
              value={formData.city}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="instagram_url">Instagram</Label>
            <Input
              name="instagram_url"
              value={formData.instagram_url}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="linkedin_url">LinkedIn</Label>
            <Input
              name="linkedin_url"
              value={formData.linkedin_url}
              onChange={handleInputChange}
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="portfolio_url">Portfolio</Label>
            <Input
              name="portfolio_url"
              value={formData.portfolio_url}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Saving..." : "Save Profile"}
        </Button>
      </form>
    </div>
  );
}
