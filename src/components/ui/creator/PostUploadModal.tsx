"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabaseClient";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Check } from "lucide-react";

interface PostUploadModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onPostCreated?: () => void;
}

export default function PostUploadModal({
  open,
  setOpen,
  onPostCreated,
}: PostUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("draft");
  const [loading, setLoading] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [userFiles, setUserFiles] = useState<string[]>([]);
  const [selectedFromLibrary, setSelectedFromLibrary] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (isLibraryOpen) fetchUserFiles();
  }, [isLibraryOpen]);

  const fetchUserFiles = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) return;

    const folder = `user-${session.user.id}`;

    const { data, error } = await supabase.storage.from("posts").list(folder);
    if (error) {
      console.error("Failed to fetch files:", error.message);
      return;
    }

    const urls = data.map(
      (f) =>
        supabase.storage.from("posts").getPublicUrl(`${folder}/${f.name}`).data
          .publicUrl
    );
    setUserFiles(urls);
  };

  const handleUpload = async () => {
    setLoading(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) return;

    const userId = session.user.id;
    let mediaUrl: string | null = null;

    if (file) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `user-${userId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("posts")
        .upload(filePath, file);

      if (uploadError) {
        toast({ title: "Upload failed", description: uploadError.message });
        setLoading(false);
        return;
      }

      mediaUrl = supabase.storage.from("posts").getPublicUrl(filePath)
        .data.publicUrl;
    } else if (selectedFromLibrary) {
      mediaUrl = selectedFromLibrary;
    } else {
      toast({ title: "No media selected" });
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from("posts").insert({
      creator_id: userId,
      media_url: mediaUrl,
      title,
      caption,
      category,
      status,
    });

    if (insertError) {
      toast({ title: "Post save failed", description: insertError.message });
      setLoading(false);
      return;
    }

    toast({ title: "Post uploaded 🎉" });
    setCaption("");
    setCategory("");
    setTitle("");
    setFile(null);
    setPreviewUrl(null);
    setSelectedFromLibrary(null);
    setOpen(false);
    setLoading(false);
    onPostCreated?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl ">
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
        </DialogHeader>
        <div className="flex gap-x-5">
          <div>
            {previewUrl &&
              (file?.type?.includes("video") ? (
                <video src={previewUrl} controls className="w-96 rounded-md" />
              ) : (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-96 rounded-md"
                />
              ))}
            <div className="flex gap-x-5 w-full pt-5">
              <Input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => {
                  const selected = e.target.files?.[0] || null;
                  setFile(selected);
                  setSelectedFromLibrary(null);
                  if (selected) setPreviewUrl(URL.createObjectURL(selected));
                }}
                className="w-40"
              />

              <Button onClick={() => setIsLibraryOpen(true)}>
                Select from Library
              </Button>
            </div>
          </div>
          <div className="space-y-4 w-full">
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <Textarea
              placeholder="Add a caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />

            <Input
              placeholder="Category (optional)"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border rounded px-3 py-2 w-full"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        <DialogFooter className="pt-4">
          <Button
            className="bg-green-600"
            onClick={handleUpload}
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload"}
          </Button>
        </DialogFooter>

        {/* Library Dialog */}
        <Dialog open={isLibraryOpen} onOpenChange={setIsLibraryOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Select from your library</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-3 gap-4 max-h-[400px] overflow-y-auto">
              {userFiles.map((url) => (
                <div
                  key={url}
                  onClick={() => {
                    setSelectedFromLibrary(url);
                    setPreviewUrl(url);
                    setFile(null);
                  }}
                  className={`relative border rounded-lg p-1 cursor-pointer transition hover:shadow-md ${
                    selectedFromLibrary === url
                      ? "border-primary ring-2 ring-primary"
                      : "border-muted"
                  }`}
                >
                  {url.includes(".mp4") ? (
                    <video
                      src={url}
                      className="w-full h-32 object-cover rounded-md"
                    />
                  ) : (
                    <img
                      src={url}
                      className="w-full h-32 object-cover rounded-md"
                    />
                  )}
                  {selectedFromLibrary === url && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-md">
                      <Check className="h-6 w-6 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <DialogFooter className="pt-4">
              <Button
                onClick={() => {
                  if (selectedFromLibrary) setIsLibraryOpen(false);
                }}
                disabled={!selectedFromLibrary}
              >
                Use Selected
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
}
