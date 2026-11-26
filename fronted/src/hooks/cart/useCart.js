import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  addToCart,
  getUserCart,
  updateCart,
  removeCart,
  clearCart,
} from "../../services/cart.service";

import { toast } from "react-toastify";

// ==========================
// GET CART
// ==========================

export const useCart = () => {
  return useQuery({
    queryKey: ["cart"],
    queryFn: getUserCart,
  });
};

// ==========================
// ADD TO CART
// ==========================

export const useAddcart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addToCart,

    onSuccess: () => {
      toast.success("Added to cart");

      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },

    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to add to cart");
    },
  });
};

// ==========================
// UPDATE CART
// ==========================

export const useUpdatecart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCart,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });

      toast.success("cart update successfull")
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });
};

// ==========================
// REMOVE CART ITEM
// ==========================

export const useRemovecart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeCart,

    onSuccess: () => {
      toast.success("Item removed from cart");

      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },

    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to remove item");
    },
  });
};

// ==========================
// CLEAR CART
// ==========================

export const useClearcart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearCart,

    onSuccess: () => {
      toast.success("Cart cleared");

      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },

    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to clear cart");
    },
  });
};
