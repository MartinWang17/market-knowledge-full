import { useEffect, useState } from 'react'
import { Collection } from './comments/types';

console.log("Running in getCollections")
export default function GetCollections(): { 
    collections: Collection[];
    setCollections: React.Dispatch<React.SetStateAction<Collection[]>>;
    refreshCollections: () => Promise<void>;
    } {
    const [collections, setCollections] = useState<Collection[]>([])
    useEffect(() => {
        fetch(`http://localhost:8000/collections`)
            .then(res => res.json())
            .then(data => {
                //data.collections is the array of collections from supabase
                console.log("Fetched collections:", data.collections);
                setCollections(data.collections);
            })
            .catch(error => {
                console.error("Error fetching comments:", error)
            })
    }, [])

    const refreshCollections = async (): Promise<void> => {
        return fetch("http://localhost:8000/collections")
                    .then(res => res.json())
                    .then(data => {
                        console.log("comments in refresh:", data.collections)
                        setCollections(data.collections)
                    })
    };
    return { collections, setCollections, refreshCollections };
}