import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { api } from "convex/_generated/api";
import { useState, useRef } from "react";
import {
  Upload02Icon,
  Delete01Icon,
  Image01Icon,
  Video01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MediaGridSkeleton } from "@/components/ui/skeleton";
import { EditorialEmptyState } from "@/components/ui/editorial-empty-state";

export const Route = createFileRoute("/admin/media")({
  loader: async (opts) => {
    await opts.context.queryClient.ensureQueryData(
      convexQuery(api.media.list, {})
    );
  },
  component: MediaPage,
});

function MediaPage() {
  const { data: media, isPending } = useQuery(
    convexQuery(api.media.list, {})
  );
  const generateUploadUrlFn = useConvexMutation(api.media.generateUploadUrl);
  const saveMediaFn = useConvexMutation(api.media.saveMedia);
  const removeMediaFn = useConvexMutation(api.media.remove);

  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      for (const file of Array.from(files)) {
        const uploadUrl = await generateUploadUrlFn({});

        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });

        const { storageId } = await result.json();

        await saveMediaFn({
          storageId,
          filename: file.name,
          mimeType: file.type,
          size: file.size,
        });
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this media?")) {
      await removeMediaFn({ id: id as any });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const isImage = (mimeType: string) => mimeType.startsWith("image/");
  const isVideo = (mimeType: string) => mimeType.startsWith("video/");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold">Media Library</h1>
          <p className="text-muted-foreground mt-1">
            Upload and manage images and videos.
          </p>
        </div>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*"
            className="hidden"
            onChange={(e) => handleUpload(e.target.files)}
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <HugeiconsIcon icon={Upload02Icon} size={18} className="mr-2" />
            {uploading ? "Uploading..." : "Upload Media"}
          </Button>
        </div>
      </div>

      {/* Drop zone */}
      <Card
        className="border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          e.currentTarget.classList.add("border-primary");
        }}
        onDragLeave={(e) => {
          e.currentTarget.classList.remove("border-primary");
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.currentTarget.classList.remove("border-primary");
          handleUpload(e.dataTransfer.files);
        }}
      >
        <CardContent className="p-8 text-center">
          <HugeiconsIcon
            icon={Upload02Icon}
            size={40}
            className="mx-auto text-muted-foreground mb-4"
          />
          <p className="text-muted-foreground">
            Drag and drop files here, or click to browse
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Supports images and videos
          </p>
        </CardContent>
      </Card>

      {/* Media grid */}
      {isPending ? (
        <MediaGridSkeleton count={12} />
      ) : !media || media.length === 0 ? (
        <EditorialEmptyState
          title="No Media Files"
          description="Upload images and videos to use in your articles."
          icon={Image01Icon}
          variant="gradient"
          action={{
            label: "Upload Media",
            onClick: () => fileInputRef.current?.click(),
          }}
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {media.map((item) => (
            <div
              key={item._id}
              className="group relative aspect-square bg-muted rounded-lg overflow-hidden"
            >
              {isImage(item.mimeType) && item.url ? (
                <img
                  src={item.url}
                  alt={item.alt || item.filename}
                  className="w-full h-full object-cover"
                />
              ) : isVideo(item.mimeType) && item.url ? (
                <video
                  src={item.url}
                  className="w-full h-full object-cover"
                  muted
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <HugeiconsIcon
                    icon={isVideo(item.mimeType) ? Video01Icon : Image01Icon}
                    size={32}
                    className="text-muted-foreground"
                  />
                </div>
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    variant="destructive"
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item._id);
                    }}
                  >
                    <HugeiconsIcon icon={Delete01Icon} size={14} />
                  </Button>
                </div>
                <div className="text-white text-xs">
                  <p className="truncate">{item.filename}</p>
                  <p className="text-white/70">{formatFileSize(item.size)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
