import { Product, ProductResponse } from "../types/product";
import axiosInstance from "./axios";

export const getProducts = async (
  limit = 20,
  skip = 0,
): Promise<ProductResponse> => {
  const response = await axiosInstance.get<ProductResponse>("/products", {
    params: {
      limit,
      skip,
    },
  });

  return response.data;
};

export const getProductById = async (id: number): Promise<Product> => {
  const response = await axiosInstance.get<Product>(`/products/${id}`);

  return response.data;
};

export const getProductsByCategory = async (
  category: string,
  limit = 20,
  skip = 0,
): Promise<ProductResponse> => {
  const response = await axiosInstance.get<ProductResponse>(
    `/products/category/${category}`,
    {
      params: {
        limit,
        skip,
      },
    },
  );

  return response.data;
};

export const getCategories = async (): Promise<string[]> => {
  const response = await axiosInstance.get<string[]>("/products/categories");

  return response.data;
};

export const searchProducts = async (
  query: string,
  limit = 20,
  skip = 0,
): Promise<ProductResponse> => {
  const response = await axiosInstance.get<ProductResponse>(
    "/products/search",
    {
      params: {
        q: query,
        limit,
        skip,
      },
    },
  );

  return response.data;
};
