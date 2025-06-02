import { supabase, TABLES } from "../config";
import { Tag } from "../types";
import { generateId } from "@/lib/utils";

export const tagService = {
  async getAll(): Promise<Tag[]> {
    const { data, error } = await supabase
      .from(TABLES.TAGS)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("An error occurred while fetching tags:", error);
      throw error;
    }

    return data || [];
  },

  async create(name: string): Promise<Tag> {
    const { data: existingTag } = await supabase
      .from(TABLES.TAGS)
      .select("*")
      .ilike("name", name)
      .limit(1);

    if (existingTag && existingTag.length > 0) {
      throw new Error("Already exists");
    }

    const newTag: Tag = {
      id: generateId(),
      name,
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from(TABLES.TAGS)
      .insert(newTag)
      .select()
      .single();

    if (error) {
      console.error("An error occurred while creating the tag:", error);
      throw error;
    }

    return newTag;
  },

  async update(id: string, name: string): Promise<Tag> {
    const { data: existingTag } = await supabase
      .from(TABLES.TAGS)
      .select("*")
      .eq("id", id)
      .single();

    if (!existingTag) {
      throw new Error("Tag not found");
    }

    const { data: duplicateTag } = await supabase
      .from(TABLES.TAGS)
      .select("*")
      .neq("id", id)
      .ilike("name", name)
      .limit(1);

    if (duplicateTag && duplicateTag.length > 0) {
      throw new Error("Another tag with this name already exists");
    }

    const updatedTag: Tag = {
      ...existingTag,
      name,
    };

    const { error } = await supabase
      .from(TABLES.TAGS)
      .update({ name })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("An error occurred while updating the tag:", error);
      throw error;
    }

    return updatedTag;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from(TABLES.TAGS)
      .delete()
      .eq("id", id);

    if (error) {
      console.error("An error occurred while deleting the tag:", error);
      throw error;
    }
  },
}; 