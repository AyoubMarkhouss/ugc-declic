"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../../lib/supabaseClient";

import { SidebarMain } from "@/components/ui/sidebar-main";
import { SidebarNav } from "@/components/ui/sidebar-nav";
import { SidebarNavItem } from "@/components/ui/sidebar-nav-item";
import { Sidebar, SidebarProvider } from "@/components/ui/sidebar";

import { LayoutDashboard, User, Bell, ClipboardList } from "lucide-react";

import Overview from "@/components/ui/brand/sections/Overview";
import Profile from "@/components/ui/brand/sections/Profile";
import Notifications from "@/components/ui/brand/sections/Notifications";
import Briefs from "@/components/ui/brand/sections/Briefs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function BrandDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
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

      const { data: brandProfile } = await supabase
        .from("brands")
        .select("first_name, last_name, bio, avatar_url")
        .eq("id", user.id)
        .single();

      setProfile(brandProfile || null);
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
      case "briefs":
        return <Briefs />;
      default:
        return <Overview />;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-screen">
        <Sidebar>
          <SidebarMain className="px-3">
            {profile && (
              <div className="flex flex-col items-center py-7 space-y-2">
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
                active={selectedSection === "briefs"}
                onClick={() => setSelectedSection("briefs")}
              >
                <ClipboardList className="h-4 w-4 mr-2" />
                Briefs
              </SidebarNavItem>
              
            </SidebarNav>
          </SidebarMain>
        </Sidebar>

        <main className="flex-1 p-8 w-full min-h-screen overflow-x-hidden">
          <h1 className="text-2xl font-bold mb-6">
            Welcome back, {profile?.first_name || "Brand"} 🎯
          </h1>
          {renderSection()}
        </main>
      </div>
    </SidebarProvider>
  );
}
