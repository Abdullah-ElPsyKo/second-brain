
import { useEffect, useState } from "react";
import type { Capture } from "../types/capture";

export function RecentCaptures() {
    const [captures, setCaptures] = useState<Capture[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        async function loadRecentCaptures() {
            try {
                const response = await fetch(
                    "http://localhost:3000/api/captures/recent",
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
                        : "Failed to fetch captures"
                );
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        loadRecentCaptures();

        return () => controller.abort();
    }, []);

    if (loading) return <p>Loading recent captures...</p>;
    if (error) return <p>Error: {error}</p>;
    if (captures.length === 0) return <p>No recent captures.</p>;

    return (
        <div className="recent-captures">
            <ul>
                {captures.map((capture) => (
                    <li key={capture.id}>
                        {capture.content}
                    </li>
                ))}
            </ul>
        </div>
    );
}
