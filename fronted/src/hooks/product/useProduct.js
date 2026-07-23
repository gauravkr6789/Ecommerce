// hooks/product/useProducts.js

import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "../../services/product.service";

export const useProducts = (params = {}) => {

   return useQuery({

      queryKey: ["products", params],

      queryFn: () => getAllProducts(params),

      staleTime: 1000 * 60 * 5,

   });

};