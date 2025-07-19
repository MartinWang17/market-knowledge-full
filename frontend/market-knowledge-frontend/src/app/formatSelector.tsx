'use client'
import { useUser } from "@/context/UserContext";

type FormatSelectorProps = {
    commentFormat: string;
    setCommentFormat: (format: string) => void;
    commentFilter: string;
    setCommentFilter: (filter: string) => void;
};

export default function RenderFormatSelector(props: FormatSelectorProps) {
    const { commentFormat, setCommentFormat, commentFilter, setCommentFilter } = props;
    const user = useUser();

    const downloadCommentsCSV = async () => {
        if (!user) {
            return;
        }

        const response = await fetch("http://localhost:8000/export-comments", {
            method: "POST",
            headers: {
                "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: user.id }),
        });
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "comments.csv";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    };
    return (
        <div className="mb-3 d-flex justify-content-between align-items-end mb-3 w-100">
            {/* Left side: selectors */}
            <div className="d-flex" style={{ gap: "1rem"}}>
                <div>
                    <label htmlFor="commentFormat" className="form-label">
                        Select Comment Format
                    </label>
                
                    <select
                        className="form-select"
                        id="commentFormat"
                        value={commentFormat}
                        onChange={(e) => setCommentFormat(e.target.value)}
                    >
                        <option value="card">Card View</option>
                        <option value="title">Title Only</option>
                        <option value="body">Body Only</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="commentFilter" className="form-label">
                        Select Comment Filter
                    </label>
                    <select
                        className="form-select"
                        id="commentFilter"
                        value={commentFilter}
                        onChange={(e) => {
                            setCommentFilter(e.target.value)
                            console.log("Comment filter changed to:", e.target.value);}}
                    >
                        <option value="relevance">Relevance</option>
                        <option value="descending">Most Upvotes</option>
                        <option value="ascending">Least Upvotes</option>
                    </select>
                </div>
            </div>
            <button
                className="btn btn-primary"
                onClick={downloadCommentsCSV}
                style={{ whiteSpace: "nowrap" }}
            >
                Export CSV
            </button>
        </div>
)}