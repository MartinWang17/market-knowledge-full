type FormatSelectorProps = {
    commentFormat: string;
    setCommentFormat: (format: string) => void;
    commentFilter: string;
    setCommentFilter: (filter: string) => void;
};

export default function RenderFormatSelector(props: FormatSelectorProps) {
    const { commentFormat, setCommentFormat, commentFilter, setCommentFilter } = props;
    return (
        <div className="mb-3 d-flex">
            <div className="me-2 w-50">
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
                <div className="ms-2 w-50">
                    <label htmlFor="commentFormat" className="form-label">
                        Select Comment Filter
                    </label>
                    <select
                        className="form-select"
                        id="commentFormat"
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
)}