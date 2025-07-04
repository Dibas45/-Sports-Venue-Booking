import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleSport, sportsVenueActions } from "../store/slice/sportsvenue";
import {
  fetchWishlist,
  addToWishlist,
  removeFromWishlist,
  wishlistActions,
} from "../store/slice/wishlist";
import Spinner from "../components/Spinner";
import Reviews from "./Reviews";
import { toast } from "react-toastify";


const SingleSportDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const {
    wishlist = [],
    fetchStatus: wishlistFetchStatus,
    addStatus,
    removeStatus,
  } = useSelector((state) => state.wishlist);

  const { singleSport, singleStatus } = useSelector(
    (state) => state.sportsVenue
  );

  const user = useSelector((state) => state.user.profile);

  const [processing, setProcessing] = useState(false);

// Fetch single sport
useEffect(() => {
  dispatch(sportsVenueActions.clearSingleSport());
  dispatch(fetchSingleSport(id));

  return () => {
    dispatch(sportsVenueActions.clearSingleSport());
  };
}, [id, dispatch]);

// Fetch wishlist separately when user becomes available
useEffect(() => {
  if (user && user.id) {
    dispatch(fetchWishlist());
  }
}, [user, dispatch]);

  const wishlistDataLoaded = useMemo(() => {
    if (!user) return true;
    return wishlistFetchStatus === "succeeded" || wishlistFetchStatus === "failed";
  }, [user, wishlistFetchStatus]);

  const isWishlisted =
    wishlistDataLoaded &&
    Array.isArray(wishlist) &&
    wishlist.some((item) => item.sportVenueId?._id?.toString() === id?.toString());

  const handleWishlistToggle = () => {
    if (!user) {
      toast.warn("Please log in to modify wishlist");
      return;
    }

    if (!wishlistDataLoaded) {
      toast.error("Wishlist data is still loading. Please wait.");
      return;
    }

    setProcessing(true);

    if (isWishlisted) {
      dispatch(removeFromWishlist(id));
    } else {
      dispatch(addToWishlist(id));
    }
  };

  useEffect(() => {
    if (addStatus === "succeeded") {
      toast.success("Added to wishlist");
      dispatch(wishlistActions.resetAddStatus());
      setProcessing(false);
    } else if (addStatus === "failed") {
      toast.error("Failed to add to wishlist");
      dispatch(wishlistActions.resetAddStatus());
      setProcessing(false);
    }
  }, [addStatus, dispatch]);

  useEffect(() => {
    if (removeStatus === "succeeded") {
      toast.info("Removed from wishlist");
      dispatch(wishlistActions.resetRemoveStatus());
      setProcessing(false);
    } else if (removeStatus === "failed") {
      toast.error("Failed to remove from wishlist");
      dispatch(wishlistActions.resetRemoveStatus());
      setProcessing(false);
    }
  }, [removeStatus, dispatch]);

  if (
    singleStatus === "loading" ||
    (user?.id && wishlistFetchStatus === "loading")
  ) {
    return <Spinner />;
  }

  if (!singleSport || singleStatus === "failed") {
    return <p className="text-red-500 text-center">Sport not found.</p>;
  }

  return (
    <div className="bg-gray-900 min-h-screen text-white py-10">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-gray-800 rounded-2xl shadow-lg p-6">
          <img
            src={singleSport.imageUrl || "/images/snooker.jpg"}
            alt={singleSport.name}
            className="w-full h-96 object-cover rounded-xl mb-6"
          />
          <h2 className="text-3xl font-bold mb-4">{singleSport.name}</h2>
          <p className="text-gray-300 mb-4">{singleSport.description}</p>
          <p className="text-lg font-semibold mb-6">
            Price: Rs {singleSport.price}
          </p>

          <div className="flex gap-4">
            <Link
              to={`/book/${singleSport._id}`}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition-all duration-300 inline-block"
            >
              Book now
            </Link>

            {/* Wishlist Button: only render when data is ready */}
            {user ? (
              wishlistDataLoaded ? (
                <button
                  onClick={handleWishlistToggle}
                  disabled={processing}
                  className={`${
                    isWishlisted
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-gray-600 hover:bg-gray-700"
                  } text-white py-2 px-6 rounded-lg transition-all duration-300`}
                >
                  {processing
                    ? "Processing..."
                    : isWishlisted
                    ? "❌ Remove from Wishlist"
                    : "❤️ Add to Wishlist"}
                </button>
              ) : (
                <p className="text-gray-400 font-semibold mt-4">
                  Loading wishlist...
                </p>
              )
            ) : (
              <p className="text-gray-400 font-semibold mt-4">
                Please log in to add to wishlist
              </p>
            )}
          </div>
        </div>

        <div className="mt-10">
          <Reviews venueId={id} user={user} />
        </div>
      </div>
    </div>
  );
};

export default SingleSportDetail;