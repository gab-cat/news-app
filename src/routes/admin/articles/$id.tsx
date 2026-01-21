import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { api } from "convex/_generated/api";
import { useState, useRef, useEffect } from "react";
import {
  ArrowLeft02Icon,
  CheckmarkCircle02Icon,
  Image01Icon,
  Delete01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Editor } from "@/components/editor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArticleEditorSkeleton } from "@/components/ui/skeleton";
import { EditorialEmptyState } from "@/components/ui/editorial-empty-state";
import type { Id } from "convex/_generated/dataModel";
import Prism from "prismjs";


export const Route = createFileRoute("/admin/articles/$id")({
  loader: async (opts) => {
    const { id } = opts.params;
    await Promise.all([
      opts.context.queryClient.ensureQueryData(
        convexQuery(api.articles.getById, { id: id as Id<"articles"> })
      ),
      opts.context.queryClient.ensureQueryData(convexQuery(api.categories.list, {})),
    ]);
  },
  component: EditArticlePage,
});

// Ensure Prism is available on the window object for Lexical's code highlighting plugin.
// This is wrapped in a check to prevent SSR errors during TanStack Start's rendering.
if (typeof window !== "undefined") {
    window.Prism = Prism;
}

function EditArticlePage() {
  const { id } = Route.useParams();
  const { data: article, isPending: articlePending } = useQuery(
    convexQuery(api.articles.getById, { id: id as Id<"articles"> })
  );
  const { data: categories, isPending: categoriesPending } = useQuery(
    convexQuery(api.categories.list, {})
  );
  
  const updateArticleFn = useConvexMutation(api.articles.update);
  const publishArticleFn = useConvexMutation(api.articles.publish);
  const unpublishArticleFn = useConvexMutation(api.articles.unpublish);
  const removeArticleFn = useConvexMutation(api.articles.remove);
  const generateUploadUrlFn = useConvexMutation(api.media.generateUploadUrl);
  const saveMediaFn = useConvexMutation(api.media.saveMedia);

  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    categoryId: "",
    isFeatured: false,
    tags: "",
  });
  const [featuredImage, setFeaturedImage] = useState<{
    id: string;
    url: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize form when article loads
  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt || "",
        content: article.content,
        categoryId: article.categoryId,
        isFeatured: article.isFeatured,
        tags: article.tags?.join(", ") || "",
      });
      if (article.featuredImage) {
        setFeaturedImage({
          id: article.featuredImageId as string,
          url: article.featuredImage.url || "",
        });
      }
    }
  }, [article]);

  const isLoading = articlePending || categoriesPending;

  if (isLoading) {
    return <ArticleEditorSkeleton />;
  }

  if (article === null) {
    return (
      <EditorialEmptyState
        title="Article Not Found"
        description="This article doesn't exist or has been removed."
        variant="gradient"
        action={{
          label: "Back to Articles",
          href: "/admin/articles",
        }}
      />
    );
  }

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    try {
      const uploadUrl = await generateUploadUrlFn({});
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await result.json();

      const mediaId = await saveMediaFn({
        storageId,
        filename: file.name,
        mimeType: file.type,
        size: file.size,
      });

      setFeaturedImage({
        id: mediaId,
        url: URL.createObjectURL(file),
      });
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Image upload failed.");
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.content || !formData.categoryId) {
      alert("Please fill in required fields");
      return;
    }

    setSaving(true);

    try {
      await updateArticleFn({
        id: id as Id<"articles">,
        title: formData.title,
        slug: formData.slug || undefined,
        excerpt: formData.excerpt || undefined,
        content: formData.content,
        categoryId: formData.categoryId as Id<"categories">,
        featuredImageId: featuredImage?.id as Id<"media"> | undefined,
        isFeatured: formData.isFeatured,
        tags: formData.tags ? formData.tags.split(",").map((t) => t.trim()) : undefined,
      });
      alert("Saved!");
    } catch (error: any) {
      alert(error.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    await handleSave();
    await publishArticleFn({ id: id as Id<"articles"> });
    window.location.reload();
  };

  const handleUnpublish = async () => {
    await unpublishArticleFn({ id: id as Id<"articles"> });
    window.location.reload();
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this article?")) {
      await removeArticleFn({ id: id as Id<"articles"> });
      window.location.href = "/admin/articles";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/admin/articles"
            className="p-2 rounded-lg hover:bg-accent transition-colors"
          >
            <HugeiconsIcon icon={ArrowLeft02Icon} size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-serif font-bold">Edit Article</h1>
            <p className="text-muted-foreground">
              Status: <span className={article?.status === "published" ? "text-emerald-500" : "text-amber-500"}>
                {article?.status}
              </span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            className="text-destructive"
            onClick={handleDelete}
          >
            <HugeiconsIcon icon={Delete01Icon} size={18} className="mr-2" />
            Delete
          </Button>
          <Button variant="outline" onClick={handleSave} disabled={saving}>
            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} className="mr-2" />
            Save
          </Button>
          {article?.status === "published" ? (
            <Button variant="secondary" onClick={handleUnpublish}>
              Unpublish
            </Button>
          ) : (
            <Button onClick={handlePublish}>
              Publish
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <Input
            placeholder="Article title..."
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="text-xl font-serif h-14 border-0 border-b rounded-none focus-visible:ring-0 px-0"
          />
          <div>
            <label className="text-sm font-medium mb-2 block">Content</label>
            <Editor
              className="bg-card"
              initialValue={formData.content}
              onChange={(html) =>
                setFormData((prev) => ({ ...prev, content: html }))
              }
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Featured Image */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Featured Image</CardTitle>
            </CardHeader>
            <CardContent>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload(e.target.files)}
              />
              {featuredImage?.url ? (
                <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                  <img src={featuredImage.url} alt="Featured" className="w-full h-full object-cover" />
                  <button
                    onClick={() => setFeaturedImage(null)}
                    className="absolute top-2 right-2 p-1 bg-black/50 rounded text-white text-xs"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full aspect-video rounded-lg border-2 border-dashed border-border hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground"
                >
                  <HugeiconsIcon icon={Image01Icon} size={32} />
                  <span className="text-sm">Click to upload</span>
                </button>
              )}
            </CardContent>
          </Card>

          {/* Meta */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Article Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Slug</label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Excerpt</label>
                <Textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={2}
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Category</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                >
                  {categories?.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Tags</label>
                <Input
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="tag1, tag2"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm">Featured article</span>
              </label>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
