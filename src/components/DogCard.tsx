import { Dog } from "@/types";
import FavoriteButton from "./FavoriteButton";

interface DogCardProps {
    dog: Dog;
}

export default function DogCard({ dog }: DogCardProps) {
    return (
        <div className="max-w-xs rounded-lg overflow-hidden shadow-lg bg-white transition-transform transform hover:scale-105 hover:shadow-2xl z-10">
            <img
                src={dog.img}
                alt={dog.name}
                className="w-full h-56 object-cover object-center"
            />
            <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800">{dog.name}</h3>
                <p className="text-sm font-semibold text-gray-600">{dog.breed}</p>
                <p className="text-sm text-gray-600">{dog.age} years old</p>
                <p className="text-sm text-gray-600">ZIP: <span className="font-semibold">{dog.zip_code}</span></p>

                <div className="mt-4 flex justify-end">
                    <FavoriteButton dogId={dog.id} isFavorite={dog.isFavorite} />
                </div>
            </div>
        </div>
    );
}
