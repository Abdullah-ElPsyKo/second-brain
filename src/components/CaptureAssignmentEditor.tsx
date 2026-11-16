import { useState, type FormEvent } from "react";
import { assignCapture } from "../services/captureService";
import type { Capture } from "../types/capture";
import { KnowledgeDomainPicker, type DomainSelection } from "./KnowledgeDomainPicker";
import { TagPicker } from "./TagPicker";
import "../styles/Capture.css";

type CaptureAssignmentEditorProps = {
  capture: Capture;
  onCancel: () => void;
  onAssigned: (capture: Capture) => void;
};

export function CaptureAssignmentEditor({
  capture,
  onCancel,
  onAssigned,
}: CaptureAssignmentEditorProps) {
  const [title, setTitle] = useState(capture.title ?? "");
  const [tags, setTags] = useState(capture.tags.map((tag) => tag.name));
  const [selectedDomain, setSelectedDomain] = useState<DomainSelection | null>(
    capture.domain && capture.domain.name.toLowerCase() !== "inbox"
      ? {
          kind: "existing",
          id: capture.domain.id,
          name: capture.domain.name,
        }
      : null,
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedDomain) return;

    setSaving(true);
    setError(null);

    try {
      const domainFields =
        selectedDomain.kind === "existing"
          ? { domainId: selectedDomain.id }
          : { newDomainName: selectedDomain.name };
      const updatedCapture = await assignCapture(capture.id, {
        title,
        tags,
        ...domainFields,
      });
      onAssigned(updatedCapture);
    } catch (err) {
      setError(
        err instanceof Error ? `Could not assign capture: ${err.message}` : "Could not assign capture",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="capture-assignment-editor" onSubmit={handleSubmit}>
      <h3>Assign capture</h3>
      <label>
        Title
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Add a title..."
        />
      </label>
      <div>
        <span className="assignment-field-label">Tags</span>
        <TagPicker selectedTags={tags} onChange={setTags} />
      </div>
      <div>
        <span className="assignment-field-label">Knowledge domain</span>
        <KnowledgeDomainPicker
          selectedDomain={selectedDomain}
          onChange={setSelectedDomain}
        />
      </div>
      {error && <p role="alert" className="capture-list-error">{error}</p>}
      <div className="capture-assignment-actions">
        <button type="button" onClick={onCancel} disabled={saving}>
          Cancel
        </button>
        <button type="submit" disabled={saving || !selectedDomain}>
          {saving ? "Assigning..." : "Assign"}
        </button>
      </div>
    </form>
  );
}
