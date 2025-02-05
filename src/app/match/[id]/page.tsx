"use client";

import { useEffect, useState } from "react";
import { fetchDogs } from "@/utils/api";
import { useParams } from "next/navigation";
import { Dog } from "@/types";

export default function MatchPage() {
    const { id } = useParams();
    const [dog, setDog] = useState<Dog | null>(null);

    useEffect(() => {
        const loadDog = async () => {
            const data: Dog[] = await fetchDogs({});
            const matchedDog = data.find((d) => d.id === id);
            setDog(matchedDog || null);
        };
        loadDog();
    }, [id]);

    if (!dog) return <p>Loading...</p>;

    return (
        <div>
            <h1>Congratulations! You matched with {dog.name}</h1>
            <img src={dog.img} alt={dog.name} />
        </div>
    );
}
