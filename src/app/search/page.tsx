"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchDogs, fetchDogsDetailsByIds, fetchNextDogs, fetchPrevDogs, fetchBreeds, logoutUser } from "@/utils/api";
import DogCard from "@/components/DogCard";
import { Dog } from "@/types";
import { SkeletonCard } from "@/components/SkeletonCard";

const ITEMS_PER_PAGE = 12;

export default function SearchPage() {
    const [dogs, setDogs] = useState<Dog[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [nextUrl, setNextUrl] = useState<string | null>(null);
    const [prevUrl, setPrevUrl] = useState<string | null>(null);
    const [filters, setFilters] = useState<Record<string, string[]>>({});  // Specified type for filters
    const [sortField, setSortField] = useState<string>("breed");
    const [sortDirection, setSortDirection] = useState<string>("asc");
    const [breeds, setBreeds] = useState<string[]>([]);

    // Logout state
    const [logoutLoading, setLogoutLoading] = useState<boolean>(false);

    useEffect(() => {
        const loadDogs = async () => {
            setLoading(true);
            try {
                const { next, prev, resultIds } = await fetchDogs({
                    ...filters,
                    page: 1,
                    size: ITEMS_PER_PAGE,
                    sort: `${sortField}:${sortDirection}`,
                });

                setNextUrl(next || null);
                setPrevUrl(prev || null);
                const dogDetails = await fetchDogsDetailsByIds(resultIds);
                setDogs(dogDetails);
            } catch {
                // Handle errors silently since error state is removed
            } finally {
                setLoading(false);
            }
        };

        loadDogs();
    }, [filters, sortField, sortDirection]);

    const handleNextPage = async () => {
        if (!nextUrl) return;
        setLoading(true);
        try {
            const { next, prev, resultIds } = await fetchNextDogs(nextUrl, filters);

            setNextUrl(next || null);
            setPrevUrl(prev || null);
            const dogDetails = await fetchDogsDetailsByIds(resultIds);
            setDogs(dogDetails);
        } catch {
            // Handle errors silently since error state is removed
        } finally {
            setLoading(false);
        }
    };

    const handlePrevPage = async () => {
        if (!prevUrl) return;
        setLoading(true);
        try {
            const { next, prev, resultIds } = await fetchPrevDogs(prevUrl, filters);

            setNextUrl(next || null);
            setPrevUrl(prev || null);
            const dogDetails = await fetchDogsDetailsByIds(resultIds);
            setDogs(dogDetails);
        } catch {
            // Handle errors silently since error state is removed
        } finally {
            setLoading(false);
        }
    };

    const handleSortChange = (field: string) => {
        setSortField(field);
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");

        if (field === "breed") {
            setFilters((prevFilters) => ({
                ...prevFilters,
                breeds: [],
            }));

            const breedDropdown = document.querySelector("select");
            if (breedDropdown) {
                breedDropdown.value = "";
            }
        }
    };

    const handleBreedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedBreeds = Array.from(e.target.selectedOptions, option => option.value);

        if (selectedBreeds.includes("")) {
            setFilters((prevFilters) => ({
                ...prevFilters,
                breeds: [],
            }));
        } else {
            setFilters((prevFilters) => ({
                ...prevFilters,
                breeds: selectedBreeds,
            }));
        }

        setNextUrl(null);
        setPrevUrl(null);
    };

    useEffect(() => {
        const loadBreeds = async () => {
            try {
                const breedList = await fetchBreeds();
                setBreeds(breedList);
            } catch {
                // Handle errors silently since error state is removed
            }
        };

        loadBreeds();
    }, []);

    const handleLogout = async () => {
        setLogoutLoading(true);
        try {
            await logoutUser();
            document.cookie = "fetch-access-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; // Clear the token cookie

            window.location.href = "/";
        } catch {
            // Handle logout errors silently
        } finally {
            setLogoutLoading(false);
        }
    };

    return (
        <div>
            {/* Top Bar with Logout Button */}
            <div className="flex justify-between items-center mb-6 mt-6 px-4">
                <div className="flex justify-center items-center">
                    <h1 className="text-3xl font-bold text-center mr-4 ml-8">Search</h1>
                    <Link href="/favorites">
                        <div className="inline-flex items-center px-4 py-2 text-white bg-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300 transition duration-200">
                            Go to Favorites
                            <span className="ml-2">→</span>
                        </div>
                    </Link>
                </div>
                <button
                    onClick={handleLogout}
                    disabled={logoutLoading}
                    className="px-4 py-2 mr-8 text-white bg-red-500 rounded-lg disabled:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-red-300 transition duration-200"
                >
                    {logoutLoading ? "Logging out..." : "Logout"}
                </button>
            </div>

            {/* Filters and Dogs List */}
            <div className="flex justify-between items-center mb-4 mr-12 flex-wrap">
                {/* Left: Filters and Sort */}
                <div className="flex space-x-4 flex-wrap mb-4">
                    <div className="flex items-start">
                        <label className="text-lg font-medium text-gray-800 ml-12 mr-2">Filter by Breed:</label>
                        <select
                            onChange={handleBreedChange}
                            multiple
                            className="px-2 py-1 text-gray-800 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
                        >
                            <option value="">All Breeds</option>
                            {breeds.map((breed) => (
                                <option key={breed} value={breed}>
                                    {breed}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex space-x-4">
                        <button
                            onClick={handleSortChange.bind(null, "breed")}
                            className="inline-flex items-center px-4 py-2 text-gray-800 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        >
                            Sort by Breed
                            {sortField === "breed" && (sortDirection === "asc" ? " ↑" : " ↓")}
                        </button>
                        <button
                            onClick={handleSortChange.bind(null, "name")}
                            className="inline-flex items-center px-4 py-2 ml-2 text-gray-800 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        >
                            Sort by Name
                            {sortField === "name" && (sortDirection === "asc" ? " ↑" : " ↓")}
                        </button>
                        <button
                            onClick={handleSortChange.bind(null, "age")}
                            className="inline-flex items-center px-4 py-2 ml-2 text-gray-800 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        >
                            Sort by Age
                            {sortField === "age" && (sortDirection === "asc" ? " ↑" : " ↓")}
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6 pl-12">
                {loading ? (
                    Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                        <SkeletonCard key={index} />
                    ))
                ) : dogs.length > 0 ? (
                    dogs.map((dog) => <DogCard key={dog.id} dog={dog} />)
                ) : (
                    <div className="text-center col-span-full">
                        <p>No dogs found</p>
                    </div>
                )}
            </div>

            <div className="flex justify-between items-center my-6 mx-12">
                <button
                    onClick={handlePrevPage}
                    disabled={!prevUrl}
                    className="px-6 py-3 text-white bg-blue-500 rounded-lg disabled:bg-gray-300"
                >
                    Previous
                </button>
                <button
                    onClick={handleNextPage}
                    disabled={!nextUrl}
                    className="px-6 py-3 text-white bg-blue-500 rounded-lg disabled:bg-gray-300"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
