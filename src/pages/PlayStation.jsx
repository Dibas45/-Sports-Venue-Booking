import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import supabase from "../services/supabaseClient";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";

const PlayStationGames = () => {
  const [playstationGames, setPlaystationGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaystationGames = async () => {
      try {
        const { data, error } = await supabase
          .from("sports_venues")
          .select("*")
          .eq("type", "PlayStation");

        if (error) throw error;

        setPlaystationGames(data);
      } catch (error) {
        toast.error("Error fetching PlayStation games: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaystationGames();
  }, []);

  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-8">
          PlayStation Games
        </h2>
        <p className="text-lg text-gray-300 text-center mb-12">
          Reserve a PlayStation station and play your favorite games.
        </p>

        {loading ? (
          <Spinner />
        ) : playstationGames.length === 0 ? (
          <div className="text-center text-gray-400 text-lg">
            No PlayStation games available.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {playstationGames.map((game) => (
              <div
                key={game.id}
                className="relative group overflow-hidden rounded-lg shadow-lg cursor-pointer bg-gray-800"
              >
                <img
                  src={game.image_url || "/images/playstatation.jpg"}
                  alt={game.name}
                  className="w-full h-64 object-cover transform group-hover:scale-105 transition duration-500"
                />

                {/* Content for mobile */}
                <div className="p-4 lg:hidden">
                  <h3 className="text-xl font-bold mb-1">{game.name}</h3>
                  <p className="text-gray-300 text-sm mb-1">
                    {game.description}
                  </p>
                  <p className="text-white font-semibold mb-3">
                    Price: Rs {game.price}
                  </p>
                  <Link
                    to={`/sports/${game.id}`} // or `/sports/${sport.name.toLowerCase().replace(/\s+/g, '-')}`
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition duration-300"
                  >
                    View
                  </Link>
                </div>

                {/* Hover effect content for desktop */}
                <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col justify-center items-center p-6 opacity-0 group-hover:opacity-100 transition duration-300">
                  <h3 className="text-2xl font-bold mb-2">{game.name}</h3>
                  <p className="text-gray-300 text-sm mb-2">
                    {game.description}
                  </p>
                  <p className="text-white font-semibold mb-4">
                    Price: Rs {game.price}
                  </p>
                  <Link
                        to={`/sports/${game.id}`}  
                   className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition duration-300"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PlayStationGames;
