import { defaultQRModel } from "@/types/qrcode";
import { supabase, TABLES } from "../config";
import { QRCodeTemplate, Tag } from "../types";
import { generateId } from "@/lib/utils";

export const templateService = {
  async getAll(): Promise<QRCodeTemplate[]> {
    const { data, error } = await supabase
      .from(TABLES.TEMPLATES)
      .select("*")
      .eq("is_template", true)
      .order("name");

    if (error) {
      console.error("Template get error:", error);
      throw error;
    }

    if (!data) return [];

    return data as QRCodeTemplate[];
  },

  async getById(id: string): Promise<QRCodeTemplate | null> {
    const { data, error } = await supabase
      .from(TABLES.TEMPLATES)
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Template get error:", error);
      throw error;
    }

    if (!data) return null;

    return data as QRCodeTemplate;
  },

  async getTagsByIds(tagIds: string[]): Promise<Tag[]> {
    if (!tagIds || tagIds.length === 0) return [];

    const { data, error } = await supabase
      .from(TABLES.TAGS)
      .select("*")
      .in("id", tagIds);

    if (error) {
      console.error("Tags get error:", error);
      return [];
    }

    return data as Tag[];
  },

  async checkIfTemplateExists(id: string): Promise<boolean> {
    if (!id) return false;
    
    const { data, error } = await supabase
      .from(TABLES.TEMPLATES)
      .select("id")
      .eq("id", id);
      
    if (error) {
      console.error("Template existence check error:", error);
      return false;
    }

    return Array.isArray(data) && data.length > 0;
  },

  async save(
    template: Omit<QRCodeTemplate, "created_at" | "updated_at">
  ): Promise<QRCodeTemplate> {
    const now = new Date().toISOString();

    try {
      const thumbnailToUse = template.thumbnail || undefined;

      let styleToUse = template.style || defaultQRModel.style;

      styleToUse = {
        ...styleToUse,
        logoImage: styleToUse.logoImage || null,
        footerImage: styleToUse.footerImage || null,
      };

      const templateId = template.id || generateId();

      const templateToSave = {
        id: templateId,
        name: template.name || "Untitled Template",
        content: template.content || "",
        type: template.type || "text",
        tag_ids: template.tag_ids || [],
        style: styleToUse,
        is_template: true,
        updated_at: now,
        thumbnail: thumbnailToUse,
      };

      const exists = templateId
        ? await this.checkIfTemplateExists(templateId)
        : false;

      if (!exists) {
        const insertData = {
          ...templateToSave,
          created_at: now,
        };

        try {
          const { data, error } = await supabase
            .from(TABLES.TEMPLATES)
            .insert(insertData)
            .select()
            .single();

          if (error) {
            console.error("Template insert error:", error);
            throw error;
          }

          return data || templateToSave;
        } catch (insertError) {
          console.error("Template insert error:", insertError);
          throw insertError;
        }
      } else {
        try {
          const { data, error } = await supabase
            .from(TABLES.TEMPLATES)
            .update({
              ...templateToSave,
            })
            .eq("id", templateId)
            .select()
            .single();

          if (error) {
            console.error("Update error:", error);
            throw error;
          }

          return data || (templateToSave as QRCodeTemplate);
        } catch (updateError: unknown) {
          const errorMessage =
            updateError instanceof Error
              ? updateError.message
              : "Unknown error";
          console.error("Template update error:", errorMessage);

          try {
            console.warn("Update failed, trying upsert as fallback...");

            const { data, error } = await supabase
              .from(TABLES.TEMPLATES)
              .upsert({
                ...templateToSave,
                created_at: now,
              })
              .select()
              .single();

            if (error) {
              console.error("Upsert error:", error);
              throw error;
            }

            return data || (templateToSave as QRCodeTemplate);
          } catch (upsertError) {
            console.error("All save operations failed:", upsertError);
            throw upsertError;
          }
        }
      }
    } catch (e) {
      console.error("Template save error:", e);
      throw e;
    }
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from(TABLES.TEMPLATES)
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Template delete error:", error);
      throw error;
    }
  },
};
