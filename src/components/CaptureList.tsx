
import { useEffect, useState } from "react";
import type { Capture } from "../types/capture";

export function CaptureList() {
    const [captures, setCaptures] = useState<Capture[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        async function loadCaptures() {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(
                    "http://localhost:3000/api/captures",
                    { signal: controller.signal }
                );

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const data: Capture[] = await response.json();
                setCaptures(data);

            } catch (err) {
                if (controller.signal.aborted) return;

                setError(
                    err instanceof Error
                        ? err.message
                        : "Unknown error"
                );
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        loadCaptures();

        return () => controller.abort();
    }, []);

    if (loading) {
        return <p>Loading captures...</p>;
    }

    if (error) {
        return <p>Failed to load captures: {error}</p>;
    }

    if (captures.length === 0) {
        return <p>No captures yet.</p>;
    }

    return (
        <div className="capture-list">
            <h2>Your Captures</h2>

            {captures.map((capture) => (
                <div key={capture.id}>
                    {capture.content}
                </div>
            ))}
        </div>
    );
}
