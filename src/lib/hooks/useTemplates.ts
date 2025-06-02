import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { QRCodeTemplate } from "@/lib/supabase/types";
import { templateService } from "@/lib/supabase/services";
import { tagService } from "@/lib/supabase/services/tagService";

export const useTemplates = () => {
  const [templates, setTemplates] = useState<QRCodeTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cleanupDeletedTags = useCallback(
    async (templatesData: QRCodeTemplate[]) => {
      try {
        const allTags = await tagService.getAll();
        const tagIds = allTags.map((tag) => tag.id);

        const cleanedTemplates = templatesData.map((template) => {
          if (!template.tag_ids || template.tag_ids.length === 0)
            return template;

          const validTagIds = template.tag_ids.filter((tagId) =>
            tagIds.includes(tagId)
          );

          if (validTagIds.length !== template.tag_ids.length) {
            return {
              ...template,
              tag_ids: validTagIds,
            };
          }

          return template;
        });

        const changedTemplates = cleanedTemplates.filter(
          (template, index) =>
            template.tag_ids?.length !== templatesData[index].tag_ids?.length
        );

        for (const template of changedTemplates) {
          await templateService.save(template);
        }

        return cleanedTemplates;
      } catch (error) {
        console.error("Error cleaning up deleted tags from templates:", error);
        return templatesData;
      }
    },
    []
  );

  const fetchTemplates = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await templateService.getAll();

      const cleanedData = await cleanupDeletedTags(data);
      setTemplates(cleanedData);
    } catch (err) {
      console.error("Templates could not be fetched:", err);
      setError("Templates could not be fetched.");
      toast.error("Templates could not be fetched.");
    } finally {
      setIsLoading(false);
    }
  }, [cleanupDeletedTags]);

  const getTemplateById = useCallback(async (id: string) => {
    if (!id) return null;

    setIsLoading(true);
    setError(null);

    try {
      const template = await templateService.getById(id);
      return template;
    } catch (err) {
      console.error("Template could not be fetched:", err);
      setError("Template could not be fetched.");
      toast.error("Template could not be fetched.");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveTemplate = useCallback(
    async (template: Omit<QRCodeTemplate, "created_at" | "updated_at">) => {
      setIsLoading(true);
      setError(null);

      try {
        const savedTemplate = await templateService.save(template);

        if (savedTemplate) {
          setTemplates((prev) => {
            const exists = prev.some((t) => t.id === savedTemplate.id);
            if (exists) {
              return prev.map((t) =>
                t.id === savedTemplate.id ? savedTemplate : t
              );
            }
            return [...prev, savedTemplate];
          });

          toast.success("Template saved successfully.");
          return savedTemplate;
        }
        throw new Error("Template could not be saved");
      } catch (err) {
        console.error("Template could not be saved:", err);
        setError("Template could not be saved.");
        toast.error("Template could not be saved.");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const deleteTemplate = useCallback(async (id: string) => {
    if (!id) return;

    setIsLoading(true);
    setError(null);

    try {
      await templateService.delete(id);
      setTemplates((prev) => prev.filter((template) => template.id !== id));
      toast.success("Template deleted successfully.");
      return true;
    } catch (err) {
      console.error("Template could not be deleted:", err);
      setError("Template could not be deleted.");
      toast.error("Template could not be deleted.");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  return {
    templates,
    isLoading,
    error,
    fetchTemplates,
    getTemplateById,
    saveTemplate,
    deleteTemplate,
  };
};
