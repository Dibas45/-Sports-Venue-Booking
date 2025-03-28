import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import supabase from "../services/supabaseClient";
import Spinner from "../components/Spinner";
import Reviews from "./Reviews";

const SingleSportDetail = () => {
  const { id } = useParams();
  const [sport, setSport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Fetch sport details
  useEffect(() => {
    const fetchSport = async () => {
      const { data, error } = await supabase
        .from("sports_venues")
        .select("*")
        .eq("id", id)
        .single();

      if (!error) setSport(data);
      setLoading(false);
    };

    fetchSport();
  }, [id]);

  // Fetch logged-in user & check wishlist status
  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error) {
        setUser(data.user);
        checkWishlist(data.user.id);
      }
    };

    getUser();
  }, [id]);

  // Check if the venue is in the wishlist for the logged-in user
  const checkWishlist = async (userId) => {
    const { data, error } = await supabase
      .from("wishlist")
      .select("venue_id")
      .eq("user_id", userId)
      .eq("venue_id", id);

    if (!error && data.length > 0) {
      setIsWishlisted(true);
    }
  };

  // Add venue to wishlist
  const addToWishlist = async () => {
    if (!user) {
      alert("Please log in to add to wishlist.");
      return;
    }

    const { error } = await supabase.from("wishlist").insert([
      {
        user_id: user.id,
        venue_id: id,
      },
    ]);

    if (!error) {
      setIsWishlisted(true);
    }
  };

  // Remove venue from wishlist
  const removeFromWishlist = async () => {
    if (!user) {
      alert("Please log in to remove from wishlist.");
      return;
    }

    const { error } = await supabase
      .from("wishlist")
      .delete()
      .eq("user_id", user.id)
      .eq("venue_id", id);

    if (!error) {
      setIsWishlisted(false);
    }
  };

  if (loading) return <Spinner />;
  if (!sport) return <p className="text-red-500 text-center">Sport not found.</p>;

  return (
    <div className="bg-gray-900 min-h-screen text-white py-10">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-gray-800 rounded-2xl shadow-lg p-6">
          <img
            src={sport.image_url || "/images/snooker.jpg"}
            alt={sport.name}
            className="w-full h-96 object-cover rounded-xl mb-6"
          />
          <h2 className="text-3xl font-bold mb-4">{sport.name}</h2>
          <p className="text-gray-300 mb-4">{sport.description}</p>
          <p className="text-lg font-semibold mb-6">Price: Rs {sport.price}</p>

          {/* Buttons: Book Now + Wishlist */}
          <div className="flex gap-4">
            <Link
              to={`/book/${sport.id}`}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition-all duration-300 inline-block"
            >
              Book now
            </Link>

            {/* Wishlist Button */}
            {user && (
              <>
                {isWishlisted ? (
                  <button
                    onClick={removeFromWishlist}
                    className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-lg transition-all duration-300"
                  >
                    ❌ Remove from Wishlist
                  </button>
                ) : (
                  <button
                    onClick={addToWishlist}
                    className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-6 rounded-lg transition-all duration-300"
                  >
                    ❤️ Add to Wishlist
                  </button>
                )}
              </>
            )}
            {/* If user is not logged in */}
            {!user && (
              <p className="text-red-500 font-semibold mt-4">Please log in to add to wishlist</p>
            )}
          </div>
        </div>

        {/* Review Section */}
        <div className="mt-10">
          <Reviews venueId={id} user={user} />
        </div>
      </div>
    </div>
  );
};

export default SingleSportDetail;
