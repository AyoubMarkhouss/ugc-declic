"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../../../lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader2, MoreVertical } from "lucide-react";
import PostUploadModal from "@/components/ui/creator/PostUploadModal";
import EditPostModal from "@/components/ui/creator/EditPostModal";
import { toast } from "@/hooks/use-toast";

interface Post {
  id: string;
  media_url: string;
  title?: string;
  caption: string;
  category: string;
  status?: string;
  created_at: string;
}

export default function Posts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "draft" | "published"
  >("all");
  const [search, setSearch] = useState("");

  const fetchPosts = async () => {
    setLoading(true);
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) return;

    const { data, error } = await supabase
      .from("posts")
      .select("id, media_url, title, caption, category, status, created_at")
      .eq("creator_id", session.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Fetch failed", description: error.message });
    } else {
      setPosts(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (postId: string) => {
    const { error } = await supabase.from("posts").delete().eq("id", postId);
    if (error) {
      toast({ title: "Delete failed", description: error.message });
    } else {
      toast({ title: "Post deleted" });
      fetchPosts();
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter((post) => {
    const matchesStatus =
      statusFilter === "all" || post.status === statusFilter;
    const matchesSearch =
      post.caption.toLowerCase().includes(search.toLowerCase()) ||
      post.title?.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Your Posts</h2>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex gap-2 flex-wrap">
            {["all", "draft", "published"].map((status) => {
              const isActive = statusFilter === status;
              const colorClasses =
                status === "published"
                  ? isActive
                    ? "bg-green-600 text-white"
                    : "border-green-600 text-green-600"
                  : status === "draft"
                  ? isActive
                    ? "bg-yellow-500 text-white"
                    : "border-yellow-500 text-yellow-500"
                  : isActive
                  ? "bg-gray-900 text-white"
                  : "border-gray-300 text-gray-700";

              return (
                <Button
                  key={status}
                  onClick={() =>
                    setStatusFilter(status as "all" | "draft" | "published")
                  }
                  className={`border capitalize ${colorClasses}`}
                  variant="outline"
                >
                  {status}
                </Button>
              );
            })}
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Input
              placeholder="Search posts..."
              className="h-10 flex-grow"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button
              className="bg-green-600 whitespace-nowrap"
              onClick={() => setModalOpen(true)}
            >
              ➕ New Post
            </Button>
          </div>
        </div>
      </div>

      <PostUploadModal
        open={modalOpen}
        setOpen={setModalOpen}
        onPostCreated={fetchPosts}
      />

      {editingPost && (
        <EditPostModal
          open={editOpen}
          setOpen={setEditOpen}
          postId={editingPost.id}
          currentCaption={editingPost.caption}
          currentCategory={editingPost.category}
          currentStatus={editingPost.status || "draft"}
          currentMediaUrl={editingPost.media_url}
          onPostUpdated={fetchPosts}
        />
      )}

      {loading ? (
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-10 h-10 animate-spin text-violet-600" />
        </div>
      ) : filteredPosts.length === 0 ? (
        <p className="text-muted-foreground">No posts found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 w-full">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="border rounded-xl shadow-md overflow-hidden flex flex-col bg-white w-60 mx-auto"
            >
              <div className="relative h-72 w-full">
                {post.media_url.endsWith(".mp4") ? (
                  <video
                    src={post.media_url}
                    controls
                    autoPlay
                    muted
                    loop
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={post.media_url}
                    onError={(e) =>
                      (e.currentTarget.src =
                        "https://via.placeholder.com/360x640?text=No+Preview")
                    }
                    alt="Post"
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute top-2 right-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-5 w-5 rotate-90 stroke-white" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white">
                      <DropdownMenuItem
                        className="cursor-pointer hover:bg-slate-500"
                        onClick={() => {
                          setEditingPost(post);
                          setEditOpen(true);
                        }}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer  text-red-500"
                        onClick={() => handleDelete(post.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <div className="p-3 space-y-1 text-sm relative">
                <div className="flex justify-between items-center">
                  <p className="text-muted-foreground line-clamp-1 text-gray-400">
                    {post.category}
                  </p>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      post.status === "published"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {post.status || "draft"}
                  </span>
                </div>
                {post.title && (
                  <p className="font-bold line-clamp-1">{post.title}</p>
                )}
                <p className="line-clamp-2 text-sm">{post.caption}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
