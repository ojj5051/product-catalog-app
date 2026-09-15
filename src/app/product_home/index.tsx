import { useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { getProducts } from "@/api/productApi";
import FilterDropdown from "@/components/FilterDropdown";
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

  useEffect(() => {
    loadProducts(1);
  }, []);

  const totalPages = Math.ceil(total / LIMIT);

  const categories = useMemo(() => {
    return ["All", ...new Set(products.map((product) => product.category))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.title
        .toLowerCase()
        .includes(search.toLowerCase());

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

      return matchesSearch && matchesCategory && matchesPrice && matchesRating;
    });
  }, [search, selectedCategory, selectedPrice, selectedRating, products]);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    pages.push(1);

    if (page > 3) {
      pages.push("...");
    }

    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (page < totalPages - 2) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  };

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

      <View style={styles.pagination}>
        <TouchableOpacity
          disabled={page === 1}
          onPress={() => loadProducts(page - 1)}
          style={styles.pageButton}
        >
          <Text>‹</Text>
        </TouchableOpacity>

        {getPageNumbers().map((item, index) => {
          if (item === "...") {
            return (
              <View key={`dots-${index}`} style={styles.dots}>
                <Text>...</Text>
              </View>
            );
          }

          return (
            <TouchableOpacity
              key={item}
              onPress={() => loadProducts(Number(item))}
              style={[
                styles.pageButton,
                page === item && styles.activePageButton,
              ]}
            >
              <Text
                style={[
                  styles.pageText,
                  page === item && styles.activePageText,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity
          disabled={page === totalPages}
          onPress={() => loadProducts(page + 1)}
          style={styles.pageButton}
        >
          <Text>›</Text>
        </TouchableOpacity>
      </View>
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

  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
    paddingVertical: 16,
  },

  pageButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },

  activePageButton: {
    backgroundColor: "#000",
    borderColor: "#000",
  },

  pageText: {
    fontSize: 13,
    color: "#333",
  },

  activePageText: {
    color: "#fff",
  },

  dots: {
    width: 24,
    alignItems: "center",
  },
});
