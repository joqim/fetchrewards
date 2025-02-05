"use client";

import { useState, useEffect, useRef } from "react";
import { Dog } from "@/types";
import DogCard from "@/components/DogCard";
import { fetchDogsDetailsByIds, fetchMatch } from "@/utils/api";
import Link from "next/link";
import { SkeletonCard } from "@/components/SkeletonCard";

const Modal = ({ dog, onClose }: { dog: Dog; onClose: () => void }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div
                ref={modalRef}
                id="modal-container"
                className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full"
            >
                <h2 className="text-xl font-semibold mb-4 ml-8">Your recommended match:</h2>
                <div className="mx-9 mt-6">
                    <DogCard dog={dog} />
                </div>
                <button
                    onClick={onClose}
                    className="mt-8 justify-center w-full bg-red-500 text-white py-2 rounded-lg"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default function FavoritesPage() {
    const [favoriteDogs, setFavoriteDogs] = useState<Dog[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [match, setMatch] = useState<Dog | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const userEmail = sessionStorage.getItem("userEmail");

        if (userEmail) {
            const favorites = JSON.parse(sessionStorage.getItem(userEmail) || "[]");

            if (favorites.length > 0) {
                const fetchDogDetails = async () => {
                    try {
                        const dogDetails = await fetchDogsDetailsByIds(favorites);
                        setFavoriteDogs(dogDetails);
                    } catch (err) {
                        console.error("Failed to fetch favorite dogs:", err);
                    } finally {
                        setLoading(false);
                    }
                };

                fetchDogDetails();
            } else {
                setLoading(false);
            }
        } else {
            setLoading(false);
            console.error("User is not logged in.");
        }
    }, []);

    const handleGenerateMatch = async () => {
        const userEmail = sessionStorage.getItem("userEmail");

        if (!userEmail) {
            alert("User is not logged in.");
            return;
        }

        const favoriteDogIds = JSON.parse(sessionStorage.getItem(userEmail) || "[]");

        if (favoriteDogIds.length === 0) {
            alert("No favorites found in sessionStorage");
            return;
        }

        try {
            const response = await fetchMatch(favoriteDogIds);
            const matchedDogId = response?.match;

            if (matchedDogId) {
                const matchedDogDetails = await fetchDogsDetailsByIds([matchedDogId]);

                if (matchedDogDetails.length > 0) {
                    setMatch(matchedDogDetails[0]);
                    setIsModalOpen(true);
                } else {
                    alert("No match details found");
                }
            } else {
                alert("No match found");
            }
        } catch (err) {
            console.error("Failed to generate match:", err);
            alert("Failed to generate match");
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setMatch(null);
    };

    return (
        <div className="mb-16">
            <div className="flex items-center justify-start w-full mb-6 mt-6">
                <Link href="/search">
                    <div className="inline-flex items-center px-4 py-2 ml-12 text-white bg-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300 transition duration-200">
                        <span className="text-xl mr-2">&#8592;</span>
                        Back to Search
                    </div>
                </Link>
                <h1 className="text-3xl font-bold absolute left-1/2 transform -translate-x-1/2">
                    Favorites
                </h1>
            </div>

            <div className="flex justify-center mb-6">
                <button
                    onClick={handleGenerateMatch}
                    className="px-4 py-4 text-white bg-green-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 transition duration-200"
                >
                    Generate Match from Favorites
                </button>
            </div>

            {isModalOpen && match && <Modal dog={match} onClose={closeModal} />}

            <div
                className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6 pl-12 ${isModalOpen ? "blur-sm pointer-events-none" : ""
                    }`}
            >
                {loading ? (
                    Array.from({ length: 12 }).map((_, index) => <SkeletonCard key={index} />)
                ) : favoriteDogs.length > 0 ? (
                    favoriteDogs.map((dog) => <DogCard key={dog.id} dog={dog} />)
                ) : (
                    <div className="text-center col-span-full">
                        <p>No favorites found</p>
                    </div>
                )}
            </div>
        </div>
    );
}
