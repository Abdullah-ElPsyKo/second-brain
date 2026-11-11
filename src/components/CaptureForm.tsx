import { useState } from "react";

export function CaptureForm() {
  const [content, setContent] = useState("");

  async function handleCapture() {
    const response = await fetch("http://localhost:3000/api/captures", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ content })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error capturing content:", errorData.error);
      return;
    }

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