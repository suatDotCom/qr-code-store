import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { Tag } from "@/lib/supabase/types";
import { tagService } from "@/lib/supabase/services/tagService";
import { templateService } from "@/lib/supabase/services/templateService";

export const useTags = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const removeTagFromTemplates = useCallback(async (tagId: string) => {
    try {
      const allTemplates = await templateService.getAll();
      
      const updatedTemplates = allTemplates.map(template => {
        if (template.tag_ids && template.tag_ids.includes(tagId)) {
          return {
            ...template,
            tag_ids: template.tag_ids.filter(id => id !== tagId)
          };
        }
        return template;
      });
      
      const templatesWithTagRemoved = updatedTemplates.filter(
        (template, index) => 
          template.tag_ids?.length !== allTemplates[index].tag_ids?.length
      );
      
      for (const template of templatesWithTagRemoved) {
        await templateService.save(template);
      }
      
    } catch (error) {
      console.error("Error removing tag from templates:", error);
    }
  }, []);

  const fetchTags = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await tagService.getAll();
      if (Array.isArray(data)) {
        setTags(data.sort((a, b) => a.name.localeCompare(b.name)));
      } else {
        throw new Error("Invalid data format");
      }
    } catch (err) {
      console.error("Error fetching tags:", err);
      setError("Error fetching tags");
      toast.error("Error fetching tags");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addTag = useCallback(
    async (name: string) => {
      if (!name.trim()) return null;

      setIsLoading(true);
      setError(null);

      try {
        const newTag = await tagService.create(name.trim());

        if (!newTag) {
          throw new Error("Tag could not be created");
        }

        setTags((prev) => [...prev, newTag]);
        toast.success(`"${newTag.name}" tag was successfully created`);

        return newTag;
      } catch (err) {
        console.error("Tag creation failed:", err);
        if (err instanceof Error) {
          setError(err.message);
          toast.error(err.message);
        } else {
          setError("Tag creation failed");
          toast.error("Tag creation failed");
        }
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const updateTag = useCallback(
    async (id: string, name: string) => {
      if (!id || !name.trim()) return null;

      setIsLoading(true);
      setError(null);

      try {
        const updatedTag = await tagService.update(id, name.trim());

        if (!updatedTag) {
          throw new Error("Tag could not be updated");
        }

        setTags((prev) =>
          prev.map((tag) => (tag.id === id ? updatedTag : tag))
        );

        toast.success(`"${updatedTag.name}" tag was successfully updated`);

        return updatedTag;
      } catch (err) {
        console.error("Tag update failed:", err);
        if (err instanceof Error) {
          setError(err.message);
          toast.error(err.message);
        } else {
          setError("Tag update failed");
          toast.error("Tag update failed");
        }
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const deleteTag = useCallback(
    async (id: string) => {
      if (!id) return false;

      setIsLoading(true);
      setError(null);

      try {
        await tagService.delete(id);
        await removeTagFromTemplates(id);
        
        setTags((prev) => prev.filter((tag) => tag.id !== id));
        toast.success("Tag was successfully deleted");

        return true;
      } catch (err) {
        console.error("Tag deletion failed:", err);
        setError("Tag deletion failed");
        toast.error("Tag deletion failed");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [removeTagFromTemplates]
  );

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  return {
    tags,
    isLoading,
    error,
    fetchTags,
    addTag,
    updateTag,
    deleteTag,
  };
}; 