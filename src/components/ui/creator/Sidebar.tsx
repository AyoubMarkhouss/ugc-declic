"use client";

import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  User,
  Bell,
  ClipboardList,
  Image,
  BarChart,
} from "lucide-react";

type SidebarProps = {
  selected: string;
  onSelect: (section: string) => void;
};

export default function Sidebar({ selected, onSelect }: SidebarProps) {
  const items = [
    { label: "Overview", icon: LayoutDashboard, value: "overview" },
    { label: "Profile", icon: User, value: "profile" },
    { label: "Notifications", icon: Bell, value: "notifications" },
    { label: "Missions", icon: ClipboardList, value: "missions" },
    { label: "Posts", icon: Image, value: "posts" },
    { label: "Stats", icon: BarChart, value: "stats" },
  ];

  return (
    <aside className="w-64 min-h-screen bg-gray-100 p-6 flex flex-col space-y-4 border-r">
      <h2 className="text-2xl font-bold mb-8">Creator Panel</h2>
      {items.map((item) => (
        <Button
          key={item.value}
          variant={selected === item.value ? "default" : "ghost"}
          onClick={() => onSelect(item.value)}
          className="justify-start"
        >
          <item.icon className="mr-2 h-5 w-5" />
          {item.label}
        </Button>
      ))}
    </aside>
  );
}
