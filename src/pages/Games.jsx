import React from "react";
import { Link } from "react-router-dom";

const games = [
  {
    title: "Outdoor Games",
    image: "images/basket.jpg",
    description: "Book football, basketball, tennis courts, and more.",
    route: "/games/outdoor",
  },
  {
    title: "Indoor Games",
    image: "images/tennis.jpg",
    description: "Enjoy chess, table tennis, snooker, and other indoor games.",
    route: "/games/indoor",
  },
  {
    title: "PlayStation Gaming Station",
    image: "images/playstatation.jpg",
    description: "Reserve a PlayStation station and play your favorite games.",
    route: "/games/playstation",
  },
];

const Games = () => {
  return (
    <section className="py-12 min-h-screen bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6">Explore Our Games</h2>
        <p className="text-base sm:text-lg text-gray-300 mb-10 sm:mb-12">
          Choose from a variety of outdoor, indoor, and PlayStation gaming experiences.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {games.map((game, index) => (
            <Link key={index} to={game.route}>
              <div className="relative group overflow-hidden rounded-xl shadow-lg cursor-pointer bg-gray-800">
                {/* Image Section */}
                <img
                  src={game.image}
                  alt={game.title}
                  className="w-full h-56 sm:h-60 object-cover transform group-hover:scale-105 transition duration-300"
                />

                {/* Content for mobile view (shown always on mobile) */}
                <div className="block sm:hidden p-4">
                  <h3 className="text-lg font-bold">{game.title}</h3>
                  <p className="text-gray-300 text-sm mt-1">{game.description}</p>
                </div>

                {/* Hover Content for desktop view (only on hover) */}
                <div className="hidden sm:group-hover:flex absolute inset-0 bg-black bg-opacity-60 justify-center items-center flex-col p-6 transition duration-300">
                  <h3 className="text-lg sm:text-xl font-bold">{game.title}</h3>
                  <p className="text-gray-300 text-sm sm:text-base mt-2 text-center">{game.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Games;
