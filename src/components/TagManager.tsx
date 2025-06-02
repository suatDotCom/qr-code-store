import { useState, FormEvent, ChangeEvent, useMemo, useCallback } from "react";
import { useTags } from "@/lib/hooks/useTags";
import { Tag } from "@/lib/supabase/types";
import LoadingQR from "./LoadingQR";
import useConfirm from "@/lib/hooks/useConfirm";
import { getTagColor } from "@/lib/utils/tagColor";

const TagManager = () => {
  const {
    tags,
    isLoading: isLoadingTags,
    addTag,
    updateTag,
    deleteTag,
  } = useTags();
  const { confirm, ConfirmComponent } = useConfirm();

  const [newTagName, setNewTagName] = useState("");
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [editingTagName, setEditingTagName] = useState("");

  const handleAddTag = async (e: FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;

    try {
      const result = await addTag(newTagName);
      if (result) {
        setNewTagName("");
      }
    } catch (error) {
      console.error("Error adding tag:", error);
    }
  };

  const startEditingTag = (tag: Tag) => {
    setEditingTagId(tag.id);
    setEditingTagName(tag.name);
  };

  const saveTagEdit = async () => {
    if (!editingTagId || !editingTagName.trim()) return;

    try {
      const result = await updateTag(editingTagId, editingTagName);
      if (result) {
        cancelTagEdit();
      }
    } catch (error) {
      console.error("Error updating tag:", error);
    }
  };

  const cancelTagEdit = () => {
    setEditingTagId(null);
    setEditingTagName("");
  };

  const handleDeleteTag = async (tagId: string, tagName: string) => {
    const isConfirmed = await confirm({
      title: "Delete Tag",
      message: `Are you sure you want to delete the tag "${tagName}"?`,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      variant: "danger",
    });

    if (isConfirmed) {
      try {
        await deleteTag(tagId);
      } catch (error) {
        console.error("Error deleting tag:", error);
      }
    }
  };

  // Group tags by first letter
  const groupedTags = useMemo(() => {
    const groups: { [key: string]: Tag[] } = {};
    tags.forEach((tag) => {
      const firstLetter = tag.name.charAt(0).toUpperCase();
      if (!groups[firstLetter]) {
        groups[firstLetter] = [];
      }
      groups[firstLetter].push(tag);
    });
    // Sort alphabetically
    return Object.keys(groups)
      .sort()
      .map((letter) => ({ letter, tags: groups[letter] }));
  }, [tags]);

  const handleEditInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        saveTagEdit();
      } else if (e.key === "Escape") {
        e.preventDefault();
        cancelTagEdit();
      }
    },
    [saveTagEdit, cancelTagEdit]
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <ConfirmComponent />
      
      <section
        className="bg-white rounded-2xl shadow-lg p-8 min-h-[400px] border-0 transition-all"
        aria-label="Tag Management"
      >
        <header className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Tags</h3>
        </header>
        <form
          onSubmit={handleAddTag}
          className="flex gap-2 mb-6"
          aria-label="Add tag"
        >
          <input
            type="text"
            className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/40 focus:border-primary focus:outline-none text-gray-800"
            placeholder="New tag name"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            required
            aria-label="New tag name"
          />
          <button
            type="submit"
            className="btn btn-primary"
            aria-label="Add tag"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddTag(e);
            }}
          >
            Add
          </button>
        </form>
        <div className="flex-1">
          {isLoadingTags ? (
            <div className="flex justify-center">
              <LoadingQR size="md" />
            </div>
          ) : tags.length === 0 ? (
            <div className="text-center py-12 text-gray-400">No tags found</div>
          ) : (
            <div className="space-y-8">
              {groupedTags.map((group) => (
                <div key={group.letter}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg font-bold text-gray-700">{group.letter}</span>
                    <div className="flex-1 h-px bg-gray-200" role="separator" aria-orientation="horizontal" />
                  </div>
                  <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 w-full">
                    {group.tags.map((tag: Tag, index: number) => (
                      <li
                        key={tag.id ? `${tag.id}` : `tag-${index}`}
                        className="flex mr-4 items-center justify-between px-3 py-2 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition-all group min-h-[44px]"
                      >
                        {editingTagId === tag.id ? (
                          <div className="flex flex-1 items-center">
                            <input
                              type="text"
                              className="flex-1 px-2 py-1 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/40 focus:border-primary focus:outline-none text-gray-800 bg-white text-sm"
                              value={editingTagName}
                              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setEditingTagName(e.target.value)
                              }
                              autoFocus
                              aria-label="Edit tag name"
                              onKeyDown={handleEditInputKeyDown}
                            />
                            <button
                              className="p-1 rounded hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary"
                              onClick={saveTagEdit}
                              aria-label="Save changes"
                              tabIndex={0}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") saveTagEdit();
                              }}
                              type="button"
                            >
                              {/* Heroicons: Check (20x20) */}
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-primary">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                              </svg>
                            </button>
                            <button
                              className="p-1 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                              onClick={cancelTagEdit}
                              aria-label="Cancel"
                              tabIndex={0}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") cancelTagEdit();
                              }}
                              type="button"
                            >
                              {/* Heroicons: X Mark (20x20) */}
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-500">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <span className="inline-block h-2 w-2 rounded-full bg-primary" style={{backgroundColor: getTagColor(tag.id, tag.name)}}></span>
                              <span className="font-medium text-gray-800 text-sm truncate" title={tag.name}>
                                {tag.name}
                              </span>
                            </div>
                            <div className="flex gap-1">
                              <button
                                className="p-1 rounded hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary"
                                onClick={() => startEditingTag(tag)}
                                aria-label="Edit"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") startEditingTag(tag);
                                }}
                                type="button"
                              >
                                {/* Heroicons: Pencil Square (20x20) */}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-primary">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 3.487a2.1 2.1 0 1 1 2.97 2.97L7.5 18.79l-4 1 1-4 12.362-12.303z" />
                                </svg>
                              </button>
                              <button
                                className="p-1 rounded hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-400"
                                onClick={() => handleDeleteTag(tag.id, tag.name)}
                                aria-label="Delete"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") handleDeleteTag(tag.id, tag.name);
                                }}
                                type="button"
                              >
                                {/* Heroicons: Trash (20x20) */}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-red-500">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default TagManager;
