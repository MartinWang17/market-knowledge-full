type Comment = {
    id: string;
    title: string;
    body: string;
    link: string;
    upvotes: number;
    subreddit: string;
    collections: string[];
    user_id: string;
}

export type { Comment };

type Collection = {
    id: string;
    collection_names: string;
    slug: string;
    user_id: string;
}

export type { Collection };

export type CommentListProps = {
    comments: Comment[];
    onDelete: (id: string) => void;
    collections: Collection[];
    showCollectionModal: boolean;
    setShowCollectionModal: (show: boolean) => void;
    activePost: (Comment | null);
    setActivePost: (post: Comment) => void;
}
