import { useState } from "react";

export function CaptureForm() {
  const [content, setContent] = useState("");

  function handleCapture() {
    console.log(content);
    setContent("");
  }

  return (
    <div className="capture-form">
      <textarea
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button onClick={handleCapture}>
        Capture
      </button>
    </div>
  );
}