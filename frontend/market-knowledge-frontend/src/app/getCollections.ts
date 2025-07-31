import { useEffect, useState, useCallback } from 'react'
import { Collection } from './comments/types';
import { useUser } from '@/context/UserContext';

console.log("Running in getCollections")
export default function GetCollections(): { 
    collections: Collection[];
    setCollections: React.Dispatch<React.SetStateAction<Collection[]>>;
    refreshCollections: () => Promise<void>;
    } {
    const user = useUser();
    const [collections, setCollections] = useState<Collection[]>([])
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    useEffect(() => {
        fetch(`${API_URL}/collections`)
            .then(res => res.json())
            .then(data => {
                //data.collections is the array of collections from supabase
                // Check if user is logged in
                if (!user) {
                    console.log("User not logged in, no collections to fetch")
                    return;
                }
                // Filter collections by user ID if user is logged in
                const userCollections = data.collections.filter((collection: Collection) => collection.user_id === user.id);
                setCollections(userCollections);
            })
            .catch(error => {
                console.error("Error fetching comments:", error)
            })
    }, [user])

    const refreshCollections = useCallback(async (): Promise<void> => {
        return fetch(`${API_URL}/collections`)
                    .then(res => res.json())
                    .then(data => {
                        const userCollections = data.collections.filter((collection: Collection) => collection.user_id === user?.id);
                        console.log("comments in refresh:", data.userCollections);
                        setCollections(userCollections);
                    });
    }, [user]);
    return { collections, setCollections, refreshCollections };
}