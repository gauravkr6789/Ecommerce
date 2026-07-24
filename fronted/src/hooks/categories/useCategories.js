import { useQuery } from "@tanstack/react-query";
import { getAllCategories } from "../../services/category.service";

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  });
};