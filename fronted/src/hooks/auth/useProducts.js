import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "../../Api/product.api.js"
import { getProductById } from "../../Api/product.api.js";

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
    staleTime: 1000 * 60 * 5, // 5 min cache (PRO LEVEL)
  });
};



export const useProduct = (id) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    enabled: !!id,
  });
};