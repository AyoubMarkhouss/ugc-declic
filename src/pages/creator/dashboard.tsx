import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../../lib/supabaseClient";
import { Loader2 } from "lucide-react";
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
import { Button } from "@/components/ui/button";

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
    if (router.isReady) {
      const sectionFromQuery = router.query.section as string;
      if (sectionFromQuery) {
        setSelectedSection(sectionFromQuery);
      }
    }
  }, [router.isReady, router.query.section]);

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
        <Loader2 className="w-10 h-10 animate-spin text-violet-600" />
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
      <div className="flex min-h-screen w-screen">
        <Sidebar className="">
          <SidebarMain className="px-3 flex flex-col justify-between h-full">
            <div>
              {/* Profile Card */}
              {profile && (
                <div className="flex flex-col items-center py-7 space-y-2">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={profile.avatar_url}
                      alt="Profile Picture"
                    />
                    <AvatarFallback>
                      {profile.first_name?.charAt(0)}
                      {profile.last_name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <p className="font-bold">
                      {profile.first_name} {profile.last_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {profile.bio}
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation */}
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
            </div>

            {/* Logout Button */}
            <Button
              className="w-full bg-red-600 mb-3"
              onClick={async () => {
                await supabase.auth.signOut();
                router.push("/auth/login");
              }}
            >
              Log out
            </Button>
          </SidebarMain>
        </Sidebar>

        <main className="flex-1 p-5  w-full min-h-screen overflow-x-hidden">
          {/* <div>
            <h1 className="text-2xl bg-gray-800 font-bold mb-6">
              Welcome back, {profile?.first_name || "Creator"} 🎉
            </h1>
          </div> */}
          <div className="grid grid-cols-2 border rounded-3xl bg-gray-50 h-14 mb-5">
            <div></div>
            <div className="flex items-center justify-end">
              <Bell className="h-5 w-5 mr-5 " />
            </div>
          </div>

          {renderSection()}
        </main>
      </div>
    </SidebarProvider>
  );
}
