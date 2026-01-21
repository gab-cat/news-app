import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { api } from "convex/_generated/api";
import { useState, useRef } from "react";
import {
  ArrowLeft02Icon,
  CheckmarkCircle02Icon,
  Image01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Editor } from "@/components/editor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArticleEditorSkeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/admin/articles/new")({
  loader: async (opts) => {
    await Promise.all([
      opts.context.queryClient.ensureQueryData(convexQuery(api.categories.list, {})),
      opts.context.queryClient.ensureQueryData(convexQuery(api.authors.list, {})),
    ]);
  },
  component: NewArticlePage,
});

function NewArticlePage() {
  const { data: categories, isPending: categoriesPending } = useQuery(
    convexQuery(api.categories.list, {})
  );
  const { data: authors, isPending: authorsPending } = useQuery(
    convexQuery(api.authors.list, {})
  );
  
  const createArticleFn = useConvexMutation(api.articles.create);
  const publishArticleFn = useConvexMutation(api.articles.publish);
  const generateUploadUrlFn = useConvexMutation(api.media.generateUploadUrl);
  const saveMediaFn = useConvexMutation(api.media.saveMedia);

  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    categoryId: "",
    authorId: "",
    isFeatured: false,
    tags: "",
  });
  const [featuredImage, setFeaturedImage] = useState<{
    id: string;
    url: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isLoading = categoriesPending || authorsPending;

  if (isLoading) {
    return <ArticleEditorSkeleton />;
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
      alert("Image upload failed. Please try again.");
    }
  };

  const handleSave = async (publish: boolean = false) => {
    if (!formData.title || !formData.content || !formData.categoryId || !formData.authorId) {
      alert("Please fill in all required fields");
      return;
    }

    setSaving(true);

    try {
      const articleId = await createArticleFn({
        title: formData.title,
        slug: formData.slug || undefined,
        excerpt: formData.excerpt || undefined,
        content: formData.content,
        categoryId: formData.categoryId as any,
        authorId: formData.authorId as any,
        featuredImageId: featuredImage?.id as any,
        isFeatured: formData.isFeatured,
        tags: formData.tags ? formData.tags.split(",").map((t) => t.trim()) : undefined,
      });

      if (publish) {
        await publishArticleFn({ id: articleId });
      }

      window.location.href = "/admin/articles";
    } catch (error: any) {
      alert(error.message || "Failed to save article");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a
            href="/admin/articles"
            className="p-2 rounded-lg hover:bg-accent transition-colors"
          >
            <HugeiconsIcon icon={ArrowLeft02Icon} size={20} />
          </a>
          <div>
            <h1 className="text-2xl font-serif font-bold">New Article</h1>
            <p className="text-muted-foreground">Create a new article</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => handleSave(false)} disabled={saving}>
            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} className="mr-2" />
            Save Draft
          </Button>
          <Button onClick={() => handleSave(true)} disabled={saving}>
            Publish
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <Input
            placeholder="Article title..."
            value={formData.title}
            onChange={(e) =>
              setFormData({
                ...formData,
                title: e.target.value,
                slug: e.target.value
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/(^-|-$)/g, ""),
              })
            }
            className="text-xl font-serif h-14 border-0 border-b rounded-none focus-visible:ring-0 px-0"
          />

          {/* Content */}
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
              {featuredImage ? (
                <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                  <img
                    src={featuredImage.url}
                    alt="Featured"
                    className="w-full h-full object-cover"
                  />
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
                  placeholder="article-slug"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Excerpt</label>
                <Textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Brief description..."
                  rows={2}
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Category *</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                >
                  <option value="">Select category</option>
                  {categories?.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Author *</label>
                <select
                  value={formData.authorId}
                  onChange={(e) => setFormData({ ...formData, authorId: e.target.value })}
                  className="w-full flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                >
                  <option value="">Select author</option>
                  {authors?.map((author) => (
                    <option key={author._id} value={author._id}>{author.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Tags</label>
                <Input
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="tag1, tag2, tag3"
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
