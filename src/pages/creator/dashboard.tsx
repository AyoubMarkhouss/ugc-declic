import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../../lib/supabaseClient";

import { SidebarMain } from "@/components/ui/sidebar-main";
import { SidebarNav } from "@/components/ui/sidebar-nav";
import { SidebarNavItem } from "@/components/ui/sidebar-nav-item";
import { Sidebar, SidebarProvider } from "@/components/ui/sidebar";

import {
  LayoutDashboard,
  User,
  Bell,
  ClipboardList,
  Image,
  BarChart,
} from "lucide-react";

import Overview from "@/components/ui/creator/sections/Overview";
import Profile from "@/components/ui/creator/sections/Profile";
import Notifications from "@/components/ui/creator/sections/Notifications";
import Missions from "@/components/ui/creator/sections/Missions";
import Posts from "@/components/ui/creator/sections/Posts";
import Stats from "@/components/ui/creator/sections/Stats";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // ✅ Import Shadcn Avatar

export default function CreatorDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState("overview");
  const [profile, setProfile] = useState<{
    first_name: string;
    last_name: string;
    bio: string;
    avatar_url: string;
  } | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error || !user) {
        router.push("/auth/login");
        return;
      }

      // Fetch profile data
      const { data: profileData } = await supabase
        .from("profiles")
        .select("first_name, last_name, bio, avatar_url")
        .eq("id", user.id)
        .single();

      setProfile(profileData || null);
      setUserEmail(user.email ?? null);
      setLoading(false);
    };

    getUser();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  const renderSection = () => {
    switch (selectedSection) {
      case "overview":
        return <Overview />;
      case "profile":
        return <Profile />;
      case "notifications":
        return <Notifications />;
      case "missions":
        return <Missions />;
      case "posts":
        return <Posts />;
      case "stats":
        return <Stats />;
      default:
        return <Overview />;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarMain>
            {/* Profile Card - NEW part */}
            {profile && (
              <div className="flex flex-col items-center p-4 space-y-2">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={profile.avatar_url} alt="Profile Picture" />
                  <AvatarFallback>
                    {profile.first_name?.charAt(0)}
                    {profile.last_name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <p className="font-bold">
                    {profile.first_name} {profile.last_name}
                  </p>
                  <p className="text-xs text-muted-foreground">{profile.bio}</p>
                </div>
              </div>
            )}

            {/* Sidebar Navigation - SAME as you had */}
            <SidebarNav>
              <SidebarNavItem
                active={selectedSection === "overview"}
                onClick={() => setSelectedSection("overview")}
              >
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Overview
              </SidebarNavItem>

              <SidebarNavItem
                active={selectedSection === "profile"}
                onClick={() => setSelectedSection("profile")}
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </SidebarNavItem>

              <SidebarNavItem
                active={selectedSection === "notifications"}
                onClick={() => setSelectedSection("notifications")}
              >
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </SidebarNavItem>

              <SidebarNavItem
                active={selectedSection === "missions"}
                onClick={() => setSelectedSection("missions")}
              >
                <ClipboardList className="h-4 w-4 mr-2" />
                Missions
              </SidebarNavItem>

              <SidebarNavItem
                active={selectedSection === "posts"}
                onClick={() => setSelectedSection("posts")}
              >
                <Image className="h-4 w-4 mr-2" />
                Posts
              </SidebarNavItem>

              <SidebarNavItem
                active={selectedSection === "stats"}
                onClick={() => setSelectedSection("stats")}
              >
                <BarChart className="h-4 w-4 mr-2" />
                Stats
              </SidebarNavItem>
            </SidebarNav>
          </SidebarMain>
        </Sidebar>

        <main className="flex-1 p-8">
          <h1 className="text-2xl font-bold mb-6">
            Welcome, {userEmail || "Creator"} 🎉
          </h1>
          {renderSection()}
        </main>
      </div>
    </SidebarProvider>
  );
}
