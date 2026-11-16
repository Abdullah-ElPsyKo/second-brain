import { useEffect, useState } from "react";
import type { Capture } from "../types/capture";
import { formatRelativeTime, getInboxCaptures } from "../services/captureService";
import { CaptureAssignmentEditor } from "./CaptureAssignmentEditor";
import "../styles/Capture.css";

export function InboxCaptureList() {
  const [captures, setCaptures] = useState<Capture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCapture, setEditingCapture] = useState<Capture | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    getInboxCaptures(controller.signal)
      .then(setCaptures)
      .catch((err: unknown) => {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : "Could not load inbox");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, []);

  if (loading) return <p>Loading Inbox...</p>;
  if (error && captures.length === 0) {
    return <p role="alert">Could not load Inbox: {error}</p>;
  }

  return (
    <section className="capture-table capture-list">
      <h2>Needs assignment</h2>
      {error && <p role="alert" className="capture-list-error">{error}</p>}
      {captures.length === 0 ? (
        <p>Your Inbox is clear.</p>
      ) : (
        <>
          <div className="capture-row capture-row-header inbox-capture-row">
            <span>Capture</span>
            <span>Tags</span>
            <span>Created</span>
            <span>Action</span>
          </div>
          <ul>
            {captures.map((capture) => (
              <li className="capture-row inbox-capture-row" key={capture.id}>
                <span className="capture-row-content">
                  {capture.title && <strong>{capture.title}: </strong>}
                  {capture.content}
                </span>
                <span className="capture-row-tags">
                  {capture.tags.length ? (
                    capture.tags.map((tag) => (
                      <span className="capture-tag" key={tag.id}>{tag.name}</span>
                    ))
                  ) : (
                    <span className="capture-no-tags">—</span>
                  )}
                </span>
                <time dateTime={capture.createdAt}>
                  {formatRelativeTime(capture.createdAt)}
                </time>
                <button
                  type="button"
                  className="capture-assign-button"
                  onClick={() => setEditingCapture(capture)}
                >
                  Assign
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {editingCapture && (
        <div className="capture-assignment-backdrop" role="presentation">
          <CaptureAssignmentEditor
            capture={editingCapture}
            onCancel={() => setEditingCapture(null)}
            onAssigned={(updatedCapture) => {
              setCaptures((current) =>
                current.filter((capture) => capture.id !== updatedCapture.id),
              );
              setEditingCapture(null);
            }}
          />
        </div>
      )}
    </section>
  );
}
