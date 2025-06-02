import { useState, useMemo, useRef, useCallback, Fragment } from "react";
import { Combobox, Transition } from "@headlessui/react";

type Item = {
  id: string;
  name: string;
};

interface SearchableDropdownProps {
  items: Item[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
  id: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  hideCleanButton?: boolean;
}

const SearchableDropdown = ({
  items,
  value,
  onChange,
  placeholder,
  label,
  id,
  required = false,
  disabled = false,
  className = "",
  hideCleanButton = false,
}: SearchableDropdownProps) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filtered items
  const filteredItems = useMemo(() => {
    if (query === "") return items;
    return items.filter((item) =>
      item.name
        .toLowerCase()
        .replace(/\s+/g, "")
        .includes(query.toLowerCase().replace(/\s+/g, ""))
    );
  }, [items, query]);

  // Get unique items (prevent name duplicates)
  const uniqueItems = useMemo(() => {
    const seen = new Set();
    return filteredItems.filter((item) => {
      const normalizedName = item.name.toLowerCase().trim();
      if (seen.has(normalizedName)) {
        return false;
      }
      seen.add(normalizedName);
      return true;
    });
  }, [filteredItems]);

  const handleOpen = useCallback(() => {
    if (!disabled) setIsOpen(true);
  }, [disabled]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleClear = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onChange("");
      setQuery("");
      inputRef.current?.focus();
      setIsOpen(true);
    },
    [onChange]
  );

  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    },
    []
  );

  // When the selection changes, the action to perform
  const handleChange = useCallback(
    (newValue: string) => {
      onChange(newValue);
      setIsOpen(false);
    },
    [onChange]
  );

  return (
    <div className={`form-group ${className} w-full max-w-md`}>
      <label
        htmlFor={id}
        className="form-label block mb-1 font-medium text-gray-700"
      >
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <Combobox value={value || ""} onChange={handleChange} disabled={disabled}>
        <div className="relative">
          <div
            className={`relative w-full flex items-center cursor-pointer overflow-hidden rounded-lg bg-white text-left shadow-md border border-gray-300 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30 transition-all duration-150 ${
              disabled ? "opacity-60 pointer-events-none" : ""
            }`}
            tabIndex={0}
            aria-label={label}
            onClick={handleOpen}
            onFocus={handleOpen}
            onBlur={handleClose}
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
          >
            <Combobox.Input
              id={id}
              ref={inputRef}
              className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:outline-none bg-transparent"
              displayValue={(id: string) => {
                const found = items.find((item) => item.id === id);
                return found ? found.name : "";
              }}
              onChange={(event) => {
                setQuery(event.target.value);
                setIsOpen(true);
              }}
              onFocus={handleOpen}
              onKeyDown={handleInputKeyDown}
              placeholder={placeholder}
              required={required}
              autoComplete="off"
              aria-autocomplete="list"
              aria-controls={`${id}-listbox`}
              aria-activedescendant={
                value ? `${id}-option-${value}` : undefined
              }
              disabled={disabled}
            />
            {value && !disabled && !hideCleanButton && (
              <button
                type="button"
                aria-label="Clear selection"
                className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 focus:outline-none"
                onClick={handleClear}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 8.586l4.95-4.95a1 1 0 111.414 1.414L11.414 10l4.95 4.95a1 1 0 01-1.414 1.414L10 11.414l-4.95 4.95a1 1 0 01-1.414-1.414L8.586 10l-4.95-4.95A1 1 0 115.05 3.636L10 8.586z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
            <Combobox.Button
              className="absolute inset-y-0 right-0 flex items-center pr-2"
              aria-label="Toggle dropdown"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            show={isOpen}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery("")}
          >
            <Combobox.Options
              static
              className="absolute left-0 top-full w-full z-50 mt-1 max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm border border-gray-200 box-border"
              id={`${id}-listbox`}
            >
              {uniqueItems.length === 0 && query !== "" ? (
                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                  No results found.
                </div>
              ) : (
                uniqueItems.map((item) => (
                  <Combobox.Option
                    key={item.id}
                    className={({ active, selected }) =>
                      `relative cursor-pointer select-none py-2 pl-10 pr-4 transition-colors duration-100
                        ${
                          selected && active
                            ? "bg-primary text-white font-semibold"
                            : ""
                        }
                        ${
                          selected && !active
                            ? "bg-primary/10 text-primary font-semibold"
                            : ""
                        }
                        ${!selected && active ? "bg-primary text-white" : ""}
                        ${!selected && !active ? "text-gray-900" : ""}
                      `
                    }
                    value={item.id}
                    id={`${id}-option-${item.id}`}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? "font-semibold" : "font-normal"
                          }`}
                        >
                          {item.name}
                        </span>
                        {selected && (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? "text-white" : "text-primary"
                            }`}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </span>
                        )}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
};

export default SearchableDropdown;
