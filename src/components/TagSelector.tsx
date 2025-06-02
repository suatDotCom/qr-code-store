import { useState, useEffect, useRef } from "react";
import { useTags } from "@/lib/hooks/useTags";
import { Tag } from "@/lib/supabase/types";
import NotFound from "./NotFound";
import { getTagColor } from "@/lib/utils/tagColor";

type TagSelectorProps = {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
};

const TagSelector = ({
  selectedTags,
  onChange,
  placeholder = "Search tags...",
}: TagSelectorProps) => {
  const { tags } = useTags();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Memoized value used to access selected tag objects
  const selectedTagObjects: Tag[] = tags.filter((tag) =>
    selectedTags.includes(tag.id)
  );

  // Filter tags according to search filter and sort by name
  const filteredTags = tags
    .filter(
      (tag) =>
        !selectedTags.includes(tag.id) &&
        tag.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  // Select a tag
  const handleSelectTag = (tagId: string) => {
    onChange([...selectedTags, tagId]);
    setSearchQuery("");
    setIsDropdownOpen(false);
  };

  // Remove a tag
  const handleRemoveTag = (tagId: string) => {
    onChange(selectedTags.filter((id) => id !== tagId));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="w-full relative" ref={dropdownRef}>
      {/* Selected tags */}
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedTagObjects.map((tag) => {
          const bgColor = getTagColor(tag.id, tag.name);
          return (
            <div
              key={tag.id}
              className="inline-block text-sm rounded-full pl-4 pr-1 py-1 text-primary-foreground"
              style={{ backgroundColor: bgColor }}
            >
              <span>{tag.name}</span>
              <button
                type="button"
                onClick={() => handleRemoveTag(tag.id)}
                className="inline-block px-1 py-1 text-xs rounded-full"
                aria-label={`Remove: ${tag.name}`}
                style={{ background: "transparent" }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          );
        })}
      </div>

      {/* Search input field */}
      <div className="relative">
        <input
          type="text"
          className="input w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/40 focus:border-primary"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsDropdownOpen(true);
          }}
          onFocus={() => setIsDropdownOpen(true)}
          aria-label="Search tags"
        />
      </div>

      {/* Dropdown */}
      {isDropdownOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredTags.length === 0 ? (
            <div className="p-2">
              <NotFound
                title="No tags found"
                message="Try a different search term."
                icon="tag"
              />
            </div>
          ) : (
            <ul>
              {filteredTags.map((tag) => {
                return (
                  <li
                    key={tag.id}
                    className="px-4 py-2 hover:bg-primary/5 cursor-pointer flex items-center gap-2 transition-colors duration-150 rounded-full"
                    onClick={() => handleSelectTag(tag.id)}
                  >
                    <span
                      className="inline-block h-2 w-2 rounded-full"
                      style={{ backgroundColor: getTagColor(tag.id, tag.name) }}
                    ></span>
                    <span className="text-sm">{tag.name}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default TagSelector;
