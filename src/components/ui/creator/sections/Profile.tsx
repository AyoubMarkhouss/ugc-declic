"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../../../lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Loader2, Pencil } from "lucide-react";

export default function ProfileSection() {
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [publicPosts, setPublicPosts] = useState<any[]>([]);

  useEffect(() => {
    refreshProfile();
    fetchPublishedPosts();
  }, []);

  const refreshProfile = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) return;

    const { data: updatedProfile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    setProfile(updatedProfile);
    setPreviewUrl(updatedProfile?.avatar_url || null);
  };

  const fetchPublishedPosts = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) return;

    const { data } = await supabase
      .from("posts")
      .select("id, media_url, title")
      .eq("creator_id", session.user.id)
      .eq("status", "published")
      .order("created_at", { ascending: false });

    setPublicPosts(data || []);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setLoading(true);
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
    let avatarUrl = profile.avatar_url;

    if (avatarFile) {
      const fileExt = avatarFile.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `user-${userId}/${fileName}`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, avatarFile, { upsert: true });

      if (!uploadError) {
        const { data: publicUrlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(filePath);
        avatarUrl = publicUrlData.publicUrl;
      }
    }

    const updates = {
      avatar_url: avatarUrl,
      first_name: profile.first_name,
      last_name: profile.last_name,
      full_name: `${profile.first_name} ${profile.last_name}`,
      bio: profile.bio,
      date_of_birth: profile.date_of_birth,
      email: profile.email,
      phone: profile.phone,
      country: profile.country,
      city: profile.city,
      instagram_url: profile.instagram_url,
      linkedin_url: profile.linkedin_url,
      portfolio_url: profile.portfolio_url,
    };

    const { error: updateError } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId);

    if (!updateError) {
      toast({ title: "Profile Updated 🎉", description: "Your profile has been saved successfully." });
      setIsEditing(false);
      refreshProfile();
    } else {
      console.error("Update error:", updateError.message);
    }

    setLoading(false);
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-10 h-10 animate-spin text-violet-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full mx-auto">
      {!isEditing ? (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow flex items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile.avatar_url || ""} />
              <AvatarFallback>
                {profile.first_name?.charAt(0)}{profile.last_name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{profile.first_name} {profile.last_name}</h2>
              <p className="text-muted-foreground">{profile.city}, {profile.country}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Personal Information</h3>
              <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                <Pencil className="w-4 h-4 mr-2" /> Edit
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div><Label className="text-xs text-muted-foreground">First Name</Label><p>{profile.first_name}</p></div>
              <div><Label className="text-xs text-muted-foreground">Last Name</Label><p>{profile.last_name}</p></div>
              <div><Label className="text-xs text-muted-foreground">Date of Birth</Label><p>{profile.date_of_birth}</p></div>
              <div><Label className="text-xs text-muted-foreground">Email</Label><p>{profile.email}</p></div>
              <div><Label className="text-xs text-muted-foreground">Phone</Label><p>{profile.phone}</p></div>
              <div><Label className="text-xs text-muted-foreground">Role</Label><p>{profile.role}</p></div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Address</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div><Label className="text-xs text-muted-foreground">Country</Label><p>{profile.country}</p></div>
              <div><Label className="text-xs text-muted-foreground">City</Label><p>{profile.city}</p></div>
              <div><Label className="text-xs text-muted-foreground">Portfolio</Label><p>{profile.portfolio_url}</p></div>
            </div>
          </div>

          {publicPosts.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold text-lg mb-4">Portfolio</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {publicPosts.map((post) => (
                  <div key={post.id} className="aspect-[9/16] rounded-md overflow-hidden border">
                    {post.media_url.endsWith(".mp4") ? (
                      <video
                        src={post.media_url}
                        muted
                        autoPlay
                        loop
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={post.media_url}
                        alt="Published post"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6 px-6">
          <div className="flex flex-col items-center gap-4">
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                className="h-20 w-20 rounded-full object-cover"
              />
            )}
            <Input type="file" className="w-40 cursor-pointer" accept="image/*" onChange={handleAvatarChange} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>First Name</Label>
              <Input name="first_name" value={profile.first_name || ""} onChange={handleInputChange} />
            </div>
            <div>
              <Label>Last Name</Label>
              <Input name="last_name" value={profile.last_name || ""} onChange={handleInputChange} />
            </div>
            <div>
              <Label>Date of Birth</Label>
              <Input name="date_of_birth" value={profile.date_of_birth || ""} onChange={handleInputChange} />
            </div>
            <div>
              <Label>Email</Label>
              <Input name="email" value={profile.email || ""} onChange={handleInputChange} />
            </div>
            <div>
              <Label>Phone</Label>
              <Input name="phone" value={profile.phone || ""} onChange={handleInputChange} />
            </div>
            <div>
              <Label>Country</Label>
              <Input name="country" value={profile.country || ""} onChange={handleInputChange} />
            </div>
            <div>
              <Label>City</Label>
              <Input name="city" value={profile.city || ""} onChange={handleInputChange} />
            </div>
            <div className="sm:col-span-2">
              <Label>Bio</Label>
              <Textarea name="bio" value={profile.bio || ""} onChange={handleInputChange} />
            </div>
            <div>
              <Label>Instagram</Label>
              <Input name="instagram_url" value={profile.instagram_url || ""} onChange={handleInputChange} />
            </div>
            <div>
              <Label>LinkedIn</Label>
              <Input name="linkedin_url" value={profile.linkedin_url || ""} onChange={handleInputChange} />
            </div>
            <div className="sm:col-span-2">
              <Label>Portfolio</Label>
              <Input name="portfolio_url" value={profile.portfolio_url || ""} onChange={handleInputChange} />
            </div>
          </div>

          <div className="flex justify-between items-center pt-5">
            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
