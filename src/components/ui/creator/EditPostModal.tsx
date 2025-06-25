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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditPostModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  postId: string;
  currentCaption: string;
  currentCategory: string;
  currentStatus: string;
  currentMediaUrl: string;
  onPostUpdated?: () => void;
}

export default function EditPostModal({
  open,
  setOpen,
  postId,
  currentCaption,
  currentCategory,
  currentStatus,
  currentMediaUrl,
  onPostUpdated,
}: EditPostModalProps) {
  const [caption, setCaption] = useState(currentCaption);
  const [category, setCategory] = useState(currentCategory);
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCaption(currentCaption);
    setCategory(currentCategory);
    setStatus(currentStatus);
  }, [currentCaption, currentCategory, currentStatus]);

  const handleUpdate = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("posts")
      .update({ caption, category, status })
      .eq("id", postId);

    if (error) {
      toast({ title: "Update failed", description: error.message });
    } else {
      toast({ title: "Post updated ✅" });
      setOpen(false);
      onPostUpdated?.();
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Post</DialogTitle>
        </DialogHeader>

        {/* Preview */}
        <div className="mb-4">
          {currentMediaUrl.endsWith(".mp4") ? (
            <video
              src={currentMediaUrl}
              controls
              className="w-full rounded-lg max-h-64 object-cover"
            />
          ) : (
            <img
              src={currentMediaUrl}
              alt="Preview"
              className="w-full rounded-lg max-h-64 object-cover"
            />
          )}
        </div>

        <div className="space-y-4">
          <div>
            <Label>Caption</Label>
            <Textarea
              placeholder="Update your caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>

          <div>
            <Label>Category</Label>
            <Input
              placeholder="Update category..."
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          <div>
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="pt-4">
          <Button onClick={handleUpdate} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
