"use client";

import { useState, useEffect } from "react";

interface FavoriteButtonProps {
    dogId: string;
    isFavorite: boolean;
}

export default function FavoriteButton({ dogId, isFavorite }: FavoriteButtonProps) {
    const [favorite, setFavorite] = useState(isFavorite);

    // Check if the dog is already in favorites for the logged-in user on component mount
    useEffect(() => {
        const userEmail = sessionStorage.getItem("userEmail");
        if (userEmail) {
            const favorites = JSON.parse(sessionStorage.getItem(userEmail) || '{"favorites": []}');
            // Ensure favorites is always an array
            const favoriteList = Array.isArray(favorites) ? favorites : [];
            setFavorite(favoriteList.includes(dogId));
        }
    }, [dogId]);

    const handleFavorite = async () => {
        const userEmail = sessionStorage.getItem("userEmail");
        if (userEmail) {
            let favorites = JSON.parse(sessionStorage.getItem(userEmail) || '{"favorites": []}');
            // Ensure favorites is always an array
            favorites = Array.isArray(favorites) ? favorites : [];

            // Toggle favorite status
            if (favorites.includes(dogId)) {
                // Remove from favorites
                sessionStorage.setItem(
                    userEmail,
                    JSON.stringify(favorites.filter((id: string) => id !== dogId))
                );
                setFavorite(false);
            } else {
                // Add to favorites
                sessionStorage.setItem(userEmail, JSON.stringify([...favorites, dogId]));
                setFavorite(true);
            }
        } else {
            console.error("User email not found in session storage.");
        }
    };

    return (
        <button onClick={handleFavorite}>
            {favorite ? "❤️ Favorited" : "🤍 Favorite"}
        </button>
    );
}
