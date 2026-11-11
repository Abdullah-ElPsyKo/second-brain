import { useEffect, useState } from "react";

type Capture = {
    id: number;
    content: string;
    createdAt: string;
};

export function RecentCaptures() {
    const [captures, setCaptures] = useState<Capture[]>([]);

    useEffect(() => {
        fetch("http://localhost:3000/api/captures")
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP ${res.status}`);
                }
                return res.json();
            })
            .then((data: Capture[]) => {
                setCaptures(data);
            })
            .catch((error) => {
                console.error("Error fetching captures:", error);
            });
    }, []);

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