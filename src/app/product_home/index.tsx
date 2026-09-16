import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import {
  getCategories,
  getProducts,
  getProductsByCategory,
  searchProducts,
} from "@/api/productApi";
import FilterDropdown from "@/components/FilterDropdown";
import Pagination from "@/components/pagination";
import ProductList from "@/components/ProductList";
import SearchBar from "@/components/SearchBar";
import { Product, ProductResponse } from "@/types/product";
import { SafeAreaView } from "react-native-safe-area-context";

const LIMIT = 20;

export const filterByCategory = (
  products: Product[],
  category: string,
): Product[] => {
  if (category === "All") {
    return products;
  }

  return products.filter(
    (product) => product.category === category.toLowerCase(),
  );
};

export default function HomeScreen() {
  const [search, setSearch] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("All");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState<string[]>([]);

  // Load categories
  const loadCategories = async () => {
    try {
      const categories = await getCategories();
      setCategories(["All", ...categories.map((category) => category.name)]);
    } catch (error) {
      console.error(error);
    }
  };

  // Load products with search and category filters
  const loadProducts = async (pageNumber: number = 1) => {
    try {
      setLoading(true);
      setPage(pageNumber);

      const skip = (pageNumber - 1) * LIMIT;

      let response: ProductResponse;

      if (search.trim()) {
        response = await searchProducts(search.trim(), LIMIT, skip);

        const result = filterByCategory(response.products, selectedCategory);

        setProducts(result);
      } else if (selectedCategory !== "All") {
        response = await getProductsByCategory(selectedCategory, LIMIT, skip);

        setProducts(response.products);
      } else {
        response = await getProducts(LIMIT, skip);

        setProducts(response.products);
      }

      setTotal(response.total);
    } catch (error) {
      console.error(error);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // Load products when category changes
  useEffect(() => {
    loadProducts(1);
  }, [selectedCategory]);

  // Load products when search changes (debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      loadProducts(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Load categories when component mounts
  useEffect(() => {
    loadCategories();
  }, []);

  // Calculate total pages
  const totalPages = Math.ceil(total / LIMIT);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Products</Text>
        <Text style={styles.headerSubtitle}>Discover our latest products</Text>
      </View>

      <SearchBar search={search} setSearch={setSearch} />

      <FilterDropdown
        label="Category"
        value={selectedCategory}
        options={categories}
        onChange={setSelectedCategory}
      />

      <ProductList
        products={products}
        loading={loading}
        error={error}
        loadProducts={loadProducts}
      />

      <Pagination
        page={page}
        totalPages={totalPages}
        loadProducts={loadProducts}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F8",
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },

  headerTitle: {
    fontSize: 30,
    fontWeight: "700",
    color: "#111",
  },

  headerSubtitle: {
    marginTop: 5,
    fontSize: 14,
    color: "#777",
  },

  filterContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },

  filterScroll: {
    flexGrow: 0,
    flexShrink: 0,
  },
});
