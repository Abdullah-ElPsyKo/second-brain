import { useState } from "react";
import { TagPicker } from "./TagPicker";
import {
  KnowledgeDomainPicker,
  type DomainSelection,
} from "./KnowledgeDomainPicker";

type CaptureType = "note" | "task" | "idea" | "link";

const captureTypes: { value: CaptureType; label: string }[] = [
  { value: "note", label: "Note" },
  { value: "task", label: "Task" },
  { value: "idea", label: "Idea" },
  { value: "link", label: "Link" }
];

export function CaptureForm() {
  const [content, setContent] = useState("");
  const [type, setType] = useState<CaptureType>("note");
  const [tags, setTags] = useState<string[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<DomainSelection | null>(
    null,
  );

  async function handleCapture() {
    const domainFields =
      selectedDomain?.kind === "existing"
        ? { domainId: selectedDomain.id }
        : selectedDomain?.kind === "new"
          ? { newDomainName: selectedDomain.name }
          : {};

    const response = await fetch("http://localhost:3000/api/captures", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ content, type, tags, ...domainFields })
    });

    const result: unknown = await response.json().catch(() => null);
    if (!response.ok) {
      const message =
        result && typeof result === "object" && "error" in result
          ? result.error
          : "Failed to capture content";
      console.error("Error capturing content:", message);
      return;
    }

    setContent("");
    setTags([]);
    if (
      selectedDomain?.kind === "new" &&
      result !== null &&
      typeof result === "object" &&
      "domain" in result &&
      result.domain !== null &&
      typeof result.domain === "object" &&
      "id" in result.domain &&
      typeof result.domain.id === "string" &&
      "name" in result.domain &&
      typeof result.domain.name === "string"
    ) {
      setSelectedDomain({
        kind: "existing",
        id: result.domain.id,
        name: result.domain.name,
      });
    }
  }

  return (
    <div className="capture-form">
      <div className="capture-type-selector">
        {captureTypes.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            className={type === value ? "active" : ""}
            onClick={() => setType(value)}
          >
            {label}
          </button>
        ))}
      </div>

      <textarea
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <div className="capture-actions">
        <TagPicker selectedTags={tags} onChange={setTags} />
        <KnowledgeDomainPicker
          selectedDomain={selectedDomain}
          onChange={setSelectedDomain}
        />
        <button className="capture-submit" onClick={handleCapture}>
          Capture
        </button>
      </div>
    </div>
  );
}
