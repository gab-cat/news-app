import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { api } from "convex/_generated/api";
import { useState } from "react";
import {
  PlusSignIcon,
  Delete01Icon,
  Edit02Icon,
  Tick01Icon,
  Cancel01Icon,
  TagsIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TableRowSkeleton } from "@/components/ui/skeleton";
import { EditorialEmptyState } from "@/components/ui/editorial-empty-state";

export const Route = createFileRoute("/admin/categories")({
  loader: async (opts) => {
    await opts.context.queryClient.ensureQueryData(
      convexQuery(api.categories.list, {})
    );
  },
  component: CategoriesPage,
});

function CategoriesPage() {
  const { data: categories, isPending } = useQuery(
    convexQuery(api.categories.list, {})
  );
  const createCategoryFn = useConvexMutation(api.categories.create);
  const updateCategoryFn = useConvexMutation(api.categories.update);
  const removeCategoryFn = useConvexMutation(api.categories.remove);

  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", slug: "", color: "#6366f1" });

  const handleCreate = async () => {
    if (!formData.name || !formData.slug) return;
    await createCategoryFn({
      name: formData.name,
      slug: formData.slug,
      color: formData.color,
    });
    setFormData({ name: "", slug: "", color: "#6366f1" });
    setIsCreating(false);
  };

  const handleUpdate = async (id: string) => {
    await updateCategoryFn({
      id: id as any,
      name: formData.name,
      slug: formData.slug,
      color: formData.color,
    });
    setEditingId(null);
    setFormData({ name: "", slug: "", color: "#6366f1" });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        await removeCategoryFn({ id: id as any });
      } catch (e: any) {
        alert(e.message);
      }
    }
  };

  const startEdit = (category: any) => {
    setEditingId(category._id);
    setFormData({
      name: category.name,
      slug: category.slug,
      color: category.color || "#6366f1",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Organize your publication's content structure.
          </p>
        </div>
        {!isCreating && (
          <Button onClick={() => setIsCreating(true)} className="rounded-xl shadow-lg shadow-primary/25">
            <HugeiconsIcon icon={PlusSignIcon} size={18} className="mr-2" />
            New Category
          </Button>
        )}
      </div>

      <Card className="rounded-xl border-border/50 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {/* Create form */}
            {isCreating && (
              <div className="p-6 bg-accent/30 animate-in slide-in-from-top-2 duration-200">
                <div className="flex items-center gap-4">
                  <div className="relative group">
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0 overflow-hidden ring-1 ring-border shadow-sm group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <Input
                    placeholder="Category Name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        name: e.target.value,
                        slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
                      })
                    }
                    className="flex-1 bg-background"
                  />
                  <Input
                    placeholder="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-48 font-mono text-xs bg-background"
                  />
                  <Button size="sm" onClick={handleCreate}>
                    <HugeiconsIcon icon={Tick01Icon} size={18} />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setIsCreating(false);
                      setFormData({ name: "", slug: "", color: "#6366f1" });
                    }}
                  >
                    <HugeiconsIcon icon={Cancel01Icon} size={18} />
                  </Button>
                </div>
              </div>
            )}

            {/* List State Handling */}
            {isPending ? (
              <div className="p-6 space-y-4">
                <TableRowSkeleton />
                <TableRowSkeleton />
                <TableRowSkeleton />
              </div>
            ) : !categories || (categories.length === 0 && !isCreating) ? (
              <div className="p-12">
                <EditorialEmptyState
                  title="No Categories"
                  description="Define segments for your content like 'Politics', 'Culture', or 'Tech'."
                  icon={TagsIcon}
                  action={{
                    label: "Create your first category",
                    onClick: () => setIsCreating(true),
                  }}
                />
              </div>
            ) : (
              categories.map((category) => (
                <div
                  key={category._id}
                  className="p-4 flex items-center gap-4 hover:bg-accent/30 transition-colors group"
                >
                  {editingId === category._id ? (
                    <div className="flex items-center gap-4 w-full bg-accent/30 p-2 rounded-lg -m-2">
                      <input
                        type="color"
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0 ring-1 ring-border"
                      />
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="flex-1 bg-background"
                      />
                      <Input
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        className="w-48 font-mono text-xs bg-background"
                      />
                      <Button size="sm" onClick={() => handleUpdate(category._id)}>
                        <HugeiconsIcon icon={Tick01Icon} size={18} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingId(null);
                          setFormData({ name: "", slug: "", color: "#6366f1" });
                        }}
                      >
                        <HugeiconsIcon icon={Cancel01Icon} size={18} />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div
                        className="w-4 h-4 rounded-full ring-2 ring-white dark:ring-black shadow-sm"
                        style={{ backgroundColor: category.color || "#6366f1" }}
                      />
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{category.name}</p>
                        <p className="text-sm text-muted-foreground font-mono opacity-70">
                          /{category.slug}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                         <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={() => startEdit(category)}
                        >
                          <HugeiconsIcon icon={Edit02Icon} size={16} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(category._id)}
                        >
                          <HugeiconsIcon icon={Delete01Icon} size={16} />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
