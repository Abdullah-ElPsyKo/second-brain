import { useEffect, useState } from "react";

type Domain = {
  id: string;
  name: string;
};

export type DomainSelection =
  | { kind: "existing"; id: string; name: string }
  | { kind: "new"; name: string };

type KnowledgeDomainPickerProps = {
  selectedDomain: DomainSelection | null;
  onChange: (domain: DomainSelection) => void;
};

export function KnowledgeDomainPicker({
  selectedDomain,
  onChange,
}: KnowledgeDomainPickerProps) {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;

    fetch("http://localhost:3000/api/domain")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch domains");
        return response.json() as Promise<unknown>;
      })
      .then((data) => {
        if (cancelled || !Array.isArray(data)) return;

        const fetchedDomains = data.filter(
          (domain): domain is Domain =>
            domain !== null &&
            typeof domain === "object" &&
            "id" in domain &&
            typeof domain.id === "string" &&
            "name" in domain &&
            typeof domain.name === "string",
        );
        setDomains(fetchedDomains);
        setLoadError("");

        const inbox = fetchedDomains.find(
          (domain) => domain.name.toLowerCase() === "inbox",
        );
        if (inbox && !selectedDomain) {
          onChange({ kind: "existing", id: inbox.id, name: inbox.name });
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setLoadError("Could not load domains");
          console.error("Could not load domains:", error);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [onChange]);

  useEffect(() => {
    if (
      selectedDomain?.kind === "existing" &&
      !domains.some((domain) => domain.id === selectedDomain.id)
    ) {
      setDomains((current) =>
        current.some((domain) => domain.id === selectedDomain.id)
          ? current
          : [...current, { id: selectedDomain.id, name: selectedDomain.name }],
      );
    }
  }, [domains, selectedDomain]);

  const normalizedQuery = query.trim().toLowerCase();
  const matchingDomains = domains.filter((domain) =>
    domain.name.toLowerCase().includes(normalizedQuery),
  );
  const exactDomain = domains.find(
    (domain) => domain.name.toLowerCase() === normalizedQuery,
  );

  function selectDomain(domain: Domain) {
    onChange({ kind: "existing", id: domain.id, name: domain.name });
    setQuery("");
    setIsOpen(false);
  }

  function selectOrCreateDomain() {
    const name = query.trim();
    if (!name) return;

    const existing = domains.find(
      (domain) => domain.name.toLowerCase() === name.toLowerCase(),
    );
    onChange(
      existing
        ? { kind: "existing", id: existing.id, name: existing.name }
        : { kind: "new", name },
    );
    setQuery("");
    setIsOpen(false);
  }

  return (
    <div className="domain-picker">
      <button
        type="button"
        className="domain-picker-trigger"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="domain-picker-icon" aria-hidden="true">▱</span>
        <span className="domain-picker-label">
          {selectedDomain?.name ?? "Inbox"}
        </span>
        <span className="domain-picker-chevron" aria-hidden="true">⌄</span>
      </button>

      {isOpen && (
        <div className="tag-dropdown">
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                selectOrCreateDomain();
              }
              if (event.key === "Escape") setIsOpen(false);
            }}
            placeholder="Search or create a domain..."
          />
          <ul>
            {matchingDomains.map((domain) => (
              <li key={domain.id}>
                <button
                  type="button"
                  className={
                    selectedDomain?.kind === "existing" &&
                    selectedDomain.id === domain.id
                      ? "active"
                      : ""
                  }
                  onClick={() => selectDomain(domain)}
                  role="option"
                  aria-selected={
                    selectedDomain?.kind === "existing" &&
                    selectedDomain.id === domain.id
                  }
                >
                  {domain.name}
                </button>
              </li>
            ))}
            {normalizedQuery && !exactDomain && (
              <li>
                <button
                  type="button"
                  className="create-option"
                  onClick={selectOrCreateDomain}
                >
                  + Create "{query.trim()}"
                </button>
              </li>
            )}
            {loadError && <li className="empty">{loadError}</li>}
            {!loadError && !matchingDomains.length && !normalizedQuery && (
              <li className="empty">No domains available</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
