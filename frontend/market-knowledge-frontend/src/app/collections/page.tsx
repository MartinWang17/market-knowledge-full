"use client";
import { FaExternalLinkAlt } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import LoadingSpinner from '../loadingSpinner'
import GetCollections from '../getCollections'

export default function Collections() {

    const { collections } = GetCollections();

 return ( 
    <div className="container my-5">
        <ul className="list-group text-center">
            {collections.map((collection) => (
                <li
                    key={collection.id}
                    className="list-group-item text-center mb-2 fs-3"
                    style={{ 
                            backgroundColor: "#1E555C",
                            color: "#fff",
                            border: "none",
                            }}
                >
                <Link href={`/collections/${collection.collection_names}`}>{collection.collection_names}</Link>
                </li>
            ))}
        </ul>
    </div>
 )};