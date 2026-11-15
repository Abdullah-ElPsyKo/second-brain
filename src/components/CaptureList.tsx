import { useEffect, useState } from "react";
import type { Capture } from "../types/capture";
import { formatRelativeTime, removeCapture } from "../services/captureService";
import "../styles/Capture.css";

export function CaptureList() {
  const [captures, setCaptures] = useState<Capture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCaptures() {
      try {
        const response = await fetch("http://localhost:3000/api/captures", {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        setCaptures(await response.json());
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadCaptures();
    return () => controller.abort();
  }, []);

  async function handleRemove(id: string) {
    setError(null);
    setRemovingId(id);
    try {
      await removeCapture(id);
      setCaptures((current) => current.filter((capture) => capture.id !== id));
    } catch (err) {
      setError(
        err instanceof Error
          ? `Could not remove capture: ${err.message}`
          : "Could not remove capture"
      );
    } finally {
      setRemovingId(null);
    }
  }

  if (loading) return <p>Loading captures...</p>;
  if (error && captures.length === 0) return <p>Failed to load captures: {error}</p>;
  if (captures.length === 0) return <p>{error ?? "No captures yet."}</p>;

  return (
    <section className="capture-table capture-list">
      <h2>Your Captures</h2>
      {error && <p role="alert" className="capture-list-error">{error}</p>}
      <div className="capture-row capture-row-header">
        <span>Capture</span>
        <span>Tags</span>
        <span>Created</span>
        <span>Actions</span>
      </div>
      <ul>
        {captures.map((capture) => (
          <li className="capture-row" key={capture.id}>
            <span className="capture-row-content">{capture.content}</span>
            <span className="capture-row-tags">
              {(capture.tags ?? []).length
                ? capture.tags.map((tag) => (
                    <span className="capture-tag" key={tag.id}>
                      {tag.name}
                    </span>
                  ))
                : <span className="capture-no-tags">—</span>}
            </span>
            <time dateTime={capture.createdAt}>
              {formatRelativeTime(capture.createdAt)}
            </time>
            <button
              type="button"
              className="capture-remove-button"
              aria-label={`Remove capture: ${capture.content}`}
              disabled={removingId === capture.id}
              onClick={() => handleRemove(capture.id)}
            >
              {removingId === capture.id ? "Removing..." : "Remove"}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
