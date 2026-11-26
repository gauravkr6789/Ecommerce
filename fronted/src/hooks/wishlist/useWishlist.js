
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  clearWishlist,
} from "../../services/wishlist.service.js"

const WISHLIST_KEY = ["wishlist"];

const useWishlist = () => {
  const queryClient = useQueryClient();

  // GET WISHLIST
  const wishlistQuery = useQuery({
    queryKey: WISHLIST_KEY,
    queryFn: getWishlist,
  });

  // ADD TO WISHLIST
  const addMutation = useMutation({
    mutationFn: addToWishlist,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: WISHLIST_KEY,
      });
    },
  });

  // REMOVE FROM WISHLIST
  const removeMutation = useMutation({
    mutationFn: removeFromWishlist,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: WISHLIST_KEY,
      });
    },
  });

  // CLEAR WISHLIST
  const clearMutation = useMutation({
    mutationFn: clearWishlist,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: WISHLIST_KEY,
      });
    },
  });

  return {
    wishlist: wishlistQuery.data || [],
    isLoading: wishlistQuery.isLoading,
    isError: wishlistQuery.isError,
    error: wishlistQuery.error,
    refetchWishlist: wishlistQuery.refetch,

    addWishlist: addMutation.mutate,
    isAdding: addMutation.isPending,

    removeWishlist: removeMutation.mutate,
    isRemoving: removeMutation.isPending,

    clearWishlist: clearMutation.mutate,
    isClearing: clearMutation.isPending,
  };
};

export default useWishlist;
