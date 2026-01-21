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
  UserMultipleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TableRowSkeleton } from "@/components/ui/skeleton";
import { EditorialEmptyState } from "@/components/ui/editorial-empty-state";

export const Route = createFileRoute("/admin/authors")({
  loader: async (opts) => {
    await opts.context.queryClient.ensureQueryData(
      convexQuery(api.authors.list, {})
    );
  },
  component: AuthorsPage,
});

function AuthorsPage() {
  const { data: authors, isPending } = useQuery(
    convexQuery(api.authors.list, {})
  );
  const createAuthorFn = useConvexMutation(api.authors.create);
  const updateAuthorFn = useConvexMutation(api.authors.update);
  const removeAuthorFn = useConvexMutation(api.authors.remove);

  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    role: "writer" as "admin" | "editor" | "writer",
  });

  const handleCreate = async () => {
    if (!formData.name || !formData.email) return;
    await createAuthorFn({
      name: formData.name,
      email: formData.email,
      bio: formData.bio || undefined,
      role: formData.role,
    });
    setFormData({ name: "", email: "", bio: "", role: "writer" });
    setIsCreating(false);
  };

  const handleUpdate = async (id: string) => {
    await updateAuthorFn({
      id: id as any,
      name: formData.name,
      bio: formData.bio || undefined,
      role: formData.role,
    });
    setEditingId(null);
    setFormData({ name: "", email: "", bio: "", role: "writer" });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this author?")) {
      try {
        await removeAuthorFn({ id: id as any });
      } catch (e: any) {
        alert(e.message);
      }
    }
  };

  const startEdit = (author: any) => {
    setEditingId(author._id);
    setFormData({
      name: author.name,
      email: author.email,
      bio: author.bio || "",
      role: author.role,
    });
  };

  const roleColors: Record<string, string> = {
    admin: "bg-red-500/10 text-red-600 border-red-500/20",
    editor: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    writer: "bg-green-500/10 text-green-600 border-green-500/20",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold tracking-tight">Authors</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage authors and editors for your publication.
          </p>
        </div>
        {!isCreating && (
          <Button onClick={() => setIsCreating(true)} className="rounded-xl shadow-lg shadow-primary/25">
            <HugeiconsIcon icon={PlusSignIcon} size={18} className="mr-2" />
            Add Author
          </Button>
        )}
      </div>

      <Card className="rounded-xl border-border/50 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {/* Create form */}
            {isCreating && (
              <div className="p-6 bg-accent/30 space-y-4 animate-in slide-in-from-top-2 duration-200">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="bg-background"
                  />
                  <Input
                    placeholder="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="bg-background"
                  />
                </div>
                <Input
                  placeholder="Bio (optional)"
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  className="bg-background"
                />
                <div className="flex items-center gap-3">
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        role: e.target.value as any,
                      })
                    }
                    className="flex h-10 w-32 rounded-md border border-input bg-background px-3 py-1 text-sm focus:ring-1 focus:ring-primary"
                  >
                    <option value="writer">Writer</option>
                    <option value="editor">Editor</option>
                    <option value="admin">Admin</option>
                  </select>
                  <div className="flex-1" />
                  <Button size="sm" onClick={handleCreate}>
                    <HugeiconsIcon icon={Tick01Icon} size={18} className="mr-1" />
                    Create
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setIsCreating(false);
                      setFormData({ name: "", email: "", bio: "", role: "writer" });
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
            ) : !authors || (authors.length === 0 && !isCreating) ? (
              <div className="p-12">
                <EditorialEmptyState
                  title="No Authors"
                  description="Add writers and editors to start building your team."
                  icon={UserMultipleIcon}
                  action={{
                    label: "Add your first author",
                    onClick: () => setIsCreating(true),
                  }}
                />
              </div>
            ) : (
              authors.map((author) => (
                <div
                  key={author._id}
                  className="p-4 flex items-center gap-4 hover:bg-accent/30 transition-colors group"
                >
                  {editingId === author._id ? (
                    <div className="flex-1 space-y-3 bg-accent/30 p-4 rounded-lg -m-2">
                       <div className="grid grid-cols-2 gap-3">
                        <Input
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className="bg-background"
                        />
                         <select
                          value={formData.role}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              role: e.target.value as any,
                            })
                          }
                          className="flex h-10 rounded-md border border-input bg-background px-3 py-1 text-sm"
                        >
                          <option value="writer">Writer</option>
                          <option value="editor">Editor</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                       <Input
                        placeholder="Bio"
                        value={formData.bio}
                        onChange={(e) =>
                          setFormData({ ...formData, bio: e.target.value })
                        }
                        className="bg-background"
                      />
                      <div className="flex gap-2 justify-end">
                         <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingId(null);
                            setFormData({ name: "", email: "", bio: "", role: "writer" });
                          }}
                        >
                          Cancel
                        </Button>
                        <Button size="sm" onClick={() => handleUpdate(author._id)}>
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-serif font-bold text-lg">
                        {author.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground truncate">{author.name}</p>
                        <p className="text-sm text-muted-foreground truncate font-mono">
                          {author.email}
                        </p>
                      </div>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold border ${roleColors[author.role]}`}
                      >
                        {author.role}
                      </span>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                         <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={() => startEdit(author)}
                        >
                          <HugeiconsIcon icon={Edit02Icon} size={16} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(author._id)}
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
