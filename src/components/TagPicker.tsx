import { useEffect, useState } from "react";

type TagPickerProps = {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
};

export function TagPicker({ selectedTags, onChange }: TagPickerProps) {
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;
    fetch("http://localhost:3000/api/tags", { method: "GET" })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch tags");
        return response.json() as Promise<unknown>;
      })
      .then((data) => {
        if (!cancelled && Array.isArray(data)) {
          const names = data.flatMap((tag) =>
            tag && typeof tag === "object" && "name" in tag && typeof tag.name === "string"
              ? [tag.name]
              : []
          );
          setAvailableTags([...new Set(names)]);
        }
      })
      .catch((error) => console.error("Could not load tags:", error));

    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  const normalizedQuery = query.trim().toLowerCase();
  const matchingTags = availableTags.filter((tag) =>
    tag.toLowerCase().includes(normalizedQuery)
  );
  const existingTag = availableTags.find(
    (tag) => tag.toLowerCase() === normalizedQuery
  );

  function toggleTag(tag: string) {
    onChange(
      selectedTags.includes(tag)
        ? selectedTags.filter((selected) => selected !== tag)
        : [...selectedTags, tag]
    );
  }

  function addTag(name: string) {
    const tag = name.trim();
    if (!tag) return;

    const tagToAdd = availableTags.find(
      (available) => available.toLowerCase() === tag.toLowerCase()
    ) ?? tag;

    if (!availableTags.includes(tagToAdd)) {
      setAvailableTags([...availableTags, tagToAdd]);
    }
    if (!selectedTags.includes(tagToAdd)) {
      onChange([...selectedTags, tagToAdd]);
    }
    setQuery("");
  }

  return (
    <div className="tag-picker">
      <div className="tag-selected">
        {selectedTags.map((tag) => (
          <span key={tag} className="tag-chip">
            {tag}
            <button
              type="button"
              aria-label={`Remove tag ${tag}`}
              onClick={() => toggleTag(tag)}
            >
              &times;
            </button>
          </span>
        ))}
        <button
          type="button"
          className="tag-add-button"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "Done" : selectedTags.length ? "+ Add another" : "+ Add tag"}
        </button>
      </div>

      {isOpen && (
        <div className="tag-dropdown">
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addTag(existingTag ?? query);
              }
              if (event.key === "Escape") setIsOpen(false);
            }}
            placeholder="Search or create a tag..."
          />
          <ul>
            {matchingTags.map((tag) => (
              <li key={tag}>
                <button
                  type="button"
                  className={selectedTags.includes(tag) ? "active" : ""}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </button>
              </li>
            ))}
            {normalizedQuery && !existingTag && (
              <li>
                <button
                  type="button"
                  className="create-option"
                  onClick={() => addTag(query)}
                >
                  + Create "{query.trim()}"
                </button>
              </li>
            )}
            {!matchingTags.length && !normalizedQuery && (
              <li className="empty">No tags yet</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
