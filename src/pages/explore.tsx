"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Post {
  id: string;
  media_url: string;
  title?: string;
  caption: string;
  category: string;
  created_at: string;
  creator: {
    first_name: string;
    last_name: string;
    avatar_url: string;
  };
}

export default function ExplorePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("posts")
        .select(
          `id, media_url, title, caption, category, created_at, creator:profiles (first_name, last_name, avatar_url)`
        )
        .eq("status", "published")
        .order("created_at", { ascending: false });

      if (!error && data) {
        const normalized = (data as any[])
          .filter((post) => post.creator)
          .map((post) => ({
            ...post,
            creator: Array.isArray(post.creator)
              ? post.creator[0]
              : post.creator,
          })) as Post[];

        setPosts(normalized);
      }
      setLoading(false);
    };

    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(
    (post) =>
      post.caption.toLowerCase().includes(search.toLowerCase()) ||
      post.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Explore Creators</h1>
        <Input
          placeholder="Search posts..."
          className="max-w-xs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <p>Loading posts...</p>
      ) : filteredPosts.length === 0 ? (
        <p className="text-muted-foreground">No posts found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="border rounded-xl shadow-sm overflow-hidden bg-white flex flex-col"
            >
              <div className="h-64 w-full">
                {post.media_url.endsWith(".mp4") ? (
                  <video
                    src={post.media_url}
                    controls
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={post.media_url}
                    alt="Post"
                    onError={(e) =>
                      (e.currentTarget.src =
                        "https://via.placeholder.com/360x640?text=No+Preview")
                    }
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={post.creator?.avatar_url || ""} />
                    <AvatarFallback>
                      {post.creator?.first_name?.charAt(0)}
                      {post.creator?.last_name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-sm font-medium">
                    {post.creator.first_name} {post.creator.last_name}
                  </p>
                </div>
                {post.title && (
                  <p className="font-bold line-clamp-1">{post.title}</p>
                )}
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {post.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
