import { useMemo, useState } from "react";
import { formatDate, generateId } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { useTemplates } from "@/lib/hooks";
import { useTags } from "@/lib/hooks/useTags";
import TagSelector from "./TagSelector";
import NotFound from "./NotFound";
import LoadingQR from "./LoadingQR";
import { QRCodeTemplate } from "@/lib/supabase/types";
import useConfirm from "@/lib/hooks/useConfirm";
import { getTagColor as tagColorUtils } from "@/lib/utils/tagColor";

const handleDownload = (dataUrl: string, name: string) => {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = `${name}.png`;
  link.click();
};

const TemplateList = () => {
  const { templates, isLoading, deleteTemplate, saveTemplate, fetchTemplates } =
    useTemplates();
  const { tags } = useTags();
  const { confirm, ConfirmComponent } = useConfirm();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"date" | "name">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const duplicateTemplate = async (template: QRCodeTemplate) => {
    try {
      // Create a new template copy
      const duplicatedTemplate = {
        id: generateId(), // Generate new ID
        name: `${template.name} (Copy)`,
        content: template.content,
        type: template.type,
        tag_ids: template.tag_ids,
        style: template.style,
        is_template: true,
        thumbnail: template.thumbnail,
      };

      const result = await saveTemplate(duplicatedTemplate);

      if (result) {
        await fetchTemplates();
      }
    } catch (error) {
      console.error("Error duplicating template:", error);
    }
  };

  const handleDeleteTemplate = async (template: QRCodeTemplate) => {
    const isConfirmed = await confirm({
      title: "Delete Template",
      message: `Are you sure you want to delete the template "${template.name}"?`,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      variant: "danger",
    });

    if (isConfirmed) {
      deleteTemplate(template.id);
    }
  };

  const filteredTemplates = useMemo(() => {
    return templates
      .filter((template) => {
        // Filter for text search
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          return (
            template.name.toLowerCase().includes(searchLower) ||
            template.content.toLowerCase().includes(searchLower)
          );
        }
        return true;
      })
      .filter((template) => {
        // Tag filter
        if (selectedTagIds.length === 0) {
          return true; // Show all templates if no tags are selected
        }

        // Don't show template if it doesn't have tags but filter is set
        if (!template.tag_ids || template.tag_ids.length === 0) {
          return false;
        }

        // Show templates that contain at least one of the selected tags
        return selectedTagIds.some(
          (tagId) => template.tag_ids && template.tag_ids.includes(tagId)
        );
      })
      .sort((a, b) => {
        if (sortBy === "date") {
          const dateA = new Date(a.updated_at ?? a.created_at ?? "").getTime();
          const dateB = new Date(b.updated_at ?? b.created_at ?? "").getTime();
          return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
        } else {
          const nameA = a.name.toLowerCase();
          const nameB = b.name.toLowerCase();
          return sortOrder === "asc"
            ? nameA.localeCompare(nameB)
            : nameB.localeCompare(nameA);
        }
      });
  }, [templates, searchTerm, selectedTagIds, sortBy, sortOrder]);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedTagIds([]);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div className="space-y-8">
      {/* Render the ConfirmComponent */}
      <ConfirmComponent />

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Filter and Sort
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Search Filter */}
          <div>
            <label
              htmlFor="searchTerm"
              className="text-gray-600 font-medium mb-1 block"
            >
              Search
            </label>
            <input
              id="searchTerm"
              type="text"
              className="input w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/40 focus:border-primary"
              placeholder="Name, content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Sorting */}
          <div>
            <label
              htmlFor="sortBy"
              className="text-gray-600 font-medium mb-1 block"
            >
              Sort
            </label>
            <div className="flex items-center gap-2">
              <select
                id="sortBy"
                className="input w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/40 focus:border-primary"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "date" | "name")}
              >
                <option value="date">Date</option>
                <option value="name">Name</option>
              </select>
              <button
                type="button"
                className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 bg-white hover:bg-gray-100 text-gray-700 transition focus:outline-none focus:ring-1 focus:ring-primary-300"
                onClick={toggleSortOrder}
                title="Sort Order"
              >
                {sortOrder === "asc" ? (
                  <svg
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 5v14M5 12l7 7 7-7" />
                  </svg>
                ) : (
                  <svg
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 19V5M5 12l7-7 7 7" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Tag Filter */}
        <div className="mt-5">
          <label
            htmlFor="tagFilter"
            className="text-gray-600 font-medium mb-1 block"
          >
            Filter by Tags
          </label>
          <TagSelector
            selectedTags={selectedTagIds}
            onChange={setSelectedTagIds}
            placeholder="Filter by tags..."
          />
        </div>

        <div className="flex justify-end mt-5">
          <button
            type="button"
            className="btn btn-outline focus:outline-none focus:ring-1 focus:ring-primary-300"
            onClick={resetFilters}
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Template List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <LoadingQR size="lg" />
        </div>
      ) : filteredTemplates.length === 0 ? (
        <NotFound
          title="No templates found"
          message="No templates match your search criteria."
          icon="document"
          action={
            templates.length > 0 && (
              <button
                className="btn btn-primary px-6 py-2 rounded-full"
                onClick={resetFilters}
              >
                Show All Templates
              </button>
            )
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-xl shadow-lg p-0 flex flex-col overflow-visible group transition-all relative hover:shadow-xl"
            >
              {/* Action Buttons - Vertical on right side */}
              <div className="absolute top-8 -right-4 flex flex-col gap-2 z-10">
                <Link
                  href={`/create?template=${template.id}`}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-lg hover:shadow-xl hover:bg-gray-100 text-primary transition-all"
                  title="Edit"
                >
                  <svg
                    width="15"
                    height="15"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z" />
                  </svg>
                </Link>

                <button
                  className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-lg hover:shadow-xl hover:bg-gray-100 text-blue-600 transition-all"
                  onClick={() => duplicateTemplate(template)}
                  aria-label="Duplicate"
                  title="Duplicate"
                >
                  <svg
                    width="15"
                    height="15"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                  >
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                </button>

                <button
                  className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-lg hover:shadow-xl hover:bg-gray-100 text-destructive transition-all"
                  onClick={() => handleDeleteTemplate(template)}
                  aria-label="Delete"
                  title="Delete"
                >
                  <svg
                    width="15"
                    height="15"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>

              {/* Thumbnail */}
              {template.thumbnail && (
                <div
                  className="w-full bg-gray-50 flex items-center justify-center p-4"
                  style={{ minHeight: "160px" }}
                >
                  <Image
                    src={template.thumbnail}
                    alt={template.name + " QR template preview"}
                    width={240}
                    height={160}
                    className="w-full max-h-40 object-contain rounded-t-xl"
                  />
                </div>
              )}

              {/* Card Content */}
              <div className="flex-1 flex flex-col p-4 gap-2">
                <h3
                  className="font-medium text-sm truncate"
                  title={template.name}
                >
                  {template.name}
                </h3>

                {/* Tag information */}
                {template.tag_ids && template.tag_ids.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {template.tag_ids
                      .filter((tagId) => tags.some((tag) => tag.id === tagId))
                      .map((tagId) => {
                        const tag = tags.find((t) => t.id === tagId);
                        return (
                          tag && (
                            <span
                              key={tagId}
                              className="inline-block px-2 py-1 text-primary-foreground text-xs rounded-full"
                              style={{ backgroundColor: tagColorUtils(tagId, tag?.name) }}
                            >
                              {tag.name}
                            </span>
                          )
                        );
                      })}
                  </div>
                )}

                <div className="text-xs text-muted-foreground mt-auto pt-2 text-right">
                  Updated: {formatDate(new Date(template.updated_at || ""))}
                </div>

                {/* Download Button */}
                {template.thumbnail && (
                  <button
                    className="btn btn-primary w-full mt-2"
                    onClick={() =>
                      handleDownload(template.thumbnail!, template.name)
                    }
                  >
                    Download
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TemplateList;
