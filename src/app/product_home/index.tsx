import { useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { getProducts, searchProducts } from "@/api/productApi";
import FilterDropdown from "@/components/FilterDropdown";
import Pagination from "@/components/pagination";
import ProductList from "@/components/ProductList";
import SearchBar from "@/components/SearchBar";
import { Product } from "@/types/product";
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

  const loadProducts = async (pageNumber: number) => {
    try {
      setLoading(true);
      setPage(pageNumber);

      const skip = (pageNumber - 1) * LIMIT;

      const response = await getProducts(LIMIT, skip);

      setProducts(response.products);
      setTotal(response.total);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string, pageNumber = 1) => {
    try {
      setLoading(true);
      setPage(pageNumber);

      const skip = (pageNumber - 1) * LIMIT;

      const response = await searchProducts(query, LIMIT, skip);

      setProducts(response.products);
      setTotal(response.total);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.trim()) {
        handleSearch(search.trim());
      } else {
        loadProducts(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const totalPages = Math.ceil(total / LIMIT);

  const categories = useMemo(() => {
    return ["All", ...new Set(products.map((product) => product.category))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;

      const matchesPrice =
        selectedPrice === "All" ||
        (selectedPrice === "Under $20" && product.price < 20) ||
        (selectedPrice === "$20 - $100" &&
          product.price >= 20 &&
          product.price <= 100) ||
        (selectedPrice === "$100 - $500" &&
          product.price > 100 &&
          product.price <= 500) ||
        (selectedPrice === "Over $500" && product.price > 500);

      const matchesRating =
        selectedRating === "All" ||
        (selectedRating === "4.5+" && product.rating >= 4.5) ||
        (selectedRating === "4.0+" && product.rating >= 4.0) ||
        (selectedRating === "3.0+" && product.rating >= 3.0);

      return matchesCategory && matchesPrice && matchesRating;
    });
  }, [products, selectedCategory, selectedPrice, selectedRating]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Products</Text>
        <Text style={styles.headerSubtitle}>Discover our latest products</Text>
      </View>

      <SearchBar search={search} setSearch={setSearch} />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterContainer}
        style={styles.filterScroll}
      >
        <FilterDropdown
          label="Category"
          value={selectedCategory}
          options={categories}
          onChange={setSelectedCategory}
        />

        <FilterDropdown
          label="Price"
          value={selectedPrice}
          options={priceOptions}
          onChange={setSelectedPrice}
        />

        <FilterDropdown
          label="Rating"
          value={selectedRating}
          options={ratingOptions}
          onChange={setSelectedRating}
        />
      </ScrollView>

      <ProductList products={filteredProducts} loading={loading} />

      <Pagination
        page={page}
        totalPages={totalPages}
        search={search}
        handleSearch={handleSearch}
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
