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

const priceOptions = [
  "All",
  "Under $20",
  "$20 - $100",
  "$100 - $500",
  "Over $500",
];

const ratingOptions = ["All", "4.5+", "4.0+", "3.0+"];

const LIMIT = 20;

export default function HomeScreen() {
  const [search, setSearch] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPrice, setSelectedPrice] = useState("All");
  const [selectedRating, setSelectedRating] = useState("All");

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState<string[]>([]);

  const loadCategories = async () => {
    try {
      const categories = await getCategories();
      setCategories(["All", ...categories.map((category) => category.name)]);
    } catch (error) {
      console.error(error);
    }
  };

  const loadProducts = async (pageNumber: number = 1) => {
    try {
      setLoading(true);
      setPage(pageNumber);

      const skip = (pageNumber - 1) * LIMIT;

      let response: ProductResponse;

      if (search.trim()) {
        response = await searchProducts(search.trim(), LIMIT, skip);
      } else if (selectedCategory !== "All") {
        response = await getProductsByCategory(selectedCategory, LIMIT, skip);
      } else {
        response = await getProducts(LIMIT, skip);
      }

      setProducts(response.products);
      setTotal(response.total);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts(1);
  }, [selectedCategory]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadProducts(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    loadCategories();
  }, []);

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

      <ProductList products={products} loading={loading} />

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
