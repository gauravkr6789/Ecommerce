import { useQuery,useMutation,useQueryClient, Mutation } from "@tanstack/react-query";
import { addToCart,getUserCart,updateCart,removeCart,clearCart } from "../../services/cart.service";
import { toast } from "react-toastify";

export const useCart=()=>{
    return useQuery({
        queryKey:["carts"],
        queryFn:()=>getUserCart()

    })
}

export const useAddcart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      toast.success("Added to cart");

      queryClient.invalidateQueries({
        queryKey: ["carts"],
      });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to add to cart");
    },
  });
};

export const useUpdatecart=()=>{
    const queryClient=useQueryClient()
    return useMutation({
        mutationFn:updateCart,
        onSuccess:queryClient.invalidateQueries({
            queryKey:["carts"]
        })

    })
}

export const useRemovecart=()=>{
     const queryClient=useQueryClient()
     return useMutation({
        mutationFn:removeCart,
        onSuccess:queryClient.invalidateQueries({
            queryKey:["carts"]
        })
     })
}

export const useClearcart=()=>{
 const queryClient=useQueryClient()
     return useMutation({
        mutationFn:clearCart,
        onSuccess:queryClient.invalidateQueries({
            queryKey:["carts"]
        })
     })
}