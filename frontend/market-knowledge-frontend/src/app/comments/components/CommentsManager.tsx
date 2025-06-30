import { CardCommentList, TitleCommentList, BodyCommentList } from './index';
import { Comment } from '../types';
import { Collection } from '../types';
import { useState } from 'react';

type CommentsManagerProps = {
    comments: Comment[];
    onDelete: (id: string) => void;
    collections: Collection[];
    commentFormat: string;
}

const COMMENT_LIST_COMPONENTS: Record<string, React.ComponentType<any>> = {
    card: CardCommentList,
    title: TitleCommentList,
    body: BodyCommentList,
};

export default function CommentsManager({ comments, onDelete, collections, commentFormat } : CommentsManagerProps) {
    const [showCollectionModal, setShowCollectionModal] = useState(false);
    const [activePost, setActivePost] = useState<Comment | null>(null);
    const CommentListComponents = COMMENT_LIST_COMPONENTS[commentFormat] || CardCommentList;

    return (
        <div>
            <CommentListComponents
                comments={comments}
                onDelete={onDelete} 
                collections={collections}
                showCollectionModal={showCollectionModal}
                setShowCollectionModal={setShowCollectionModal}
                activePost={activePost}
                setActivePost={setActivePost}
            />
        </div>
)}