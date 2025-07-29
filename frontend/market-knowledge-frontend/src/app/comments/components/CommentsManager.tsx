import { CardCommentList, TitleCommentList, BodyCommentList } from './index';
import { Comment } from '../types';
import { Collection } from '../types';

type CommentsManagerProps = {
    comments: Comment[];
    onDelete: (id: string) => void;
    collections: Collection[];
    commentFormat: string;
    showCollectionModal: boolean;
    setShowCollectionModal: (show: boolean) => void;
    activePost: (Comment | null);
    setActivePost: (post: Comment) => void;
}

type CommentListProps = {
    comments: Comment[];
    onDelete: (id: string) => void;
    collections: Collection[];
    showCollectionModal: boolean;
    setShowCollectionModal: (show: boolean) => void;
    activePost: (Comment | null);
    setActivePost: (post: Comment) => void;
};

//Object to store component references
const COMMENT_LIST_COMPONENTS: Record<string, React.ComponentType<CommentListProps>> = {
    card: CardCommentList,
    title: TitleCommentList,
    body: BodyCommentList,
};

export default function CommentsManager({
    comments, 
    onDelete, 
    collections, 
    commentFormat, 
    showCollectionModal,
    setShowCollectionModal,
    activePost,
    setActivePost,
    } : CommentsManagerProps) {
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