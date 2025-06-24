type Comment = {
    id: string;
    title: string;
    body: string;
    link: string;
    upvotes: number;
    subreddit: string;
    collections: string;
}

export type { Comment };

export type CommentListProps = {
    comments: Comment[];
    onDelete: (id: string) => void;
}