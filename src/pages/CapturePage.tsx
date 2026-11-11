import { CaptureForm } from "../components/CaptureForm";
import { RecentCaptures } from "../components/RecentCaptures";
import "../styles/Capture.css";

export function CapturePage() {
  return (
    <div className="capture-page">

      <header className="capture-header">
        <h1 className="capture-title">Capture</h1>
        <p>Capture your thoughts, ideas and notes.</p>
      </header>

      <section className="capture-form-section">
        <CaptureForm />
      </section>

      <section className="recent-captures-section">
        <h2 className="recent-captures-title">
          Recent Captures
        </h2>
        <RecentCaptures />
      </section>

    </div>
  );
}