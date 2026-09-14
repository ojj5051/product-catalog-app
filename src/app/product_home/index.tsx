import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import FilterDropdown from "../../../components/FilterDropdown";
import ProductList from "../../../components/ProductList";
import SearchBar from "../../../components/SearchBar";

const products = [
  {
    id: 1,
    title: "Essence Mascara Lash Princess",
    price: 9.99,
    rating: 4.94,
    category: "Beauty",
    thumbnail:
      "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
    description:
      "The Essence Mascara Lash Princess is a popular mascara designed to provide volume and length.",
  },
  {
    id: 2,
    title: "Eyeshadow Palette with Mirror",
    price: 19.99,
    rating: 3.28,
    category: "Beauty",
    thumbnail:
      "https://cdn.dummyjson.com/product-images/beauty/eyeshadow-palette-with-mirror/thumbnail.webp",
    description:
      "A versatile eyeshadow palette with multiple shades and a built-in mirror.",
  },
  {
    id: 3,
    title: "Powder Canister",
    price: 14.99,
    rating: 3.82,
    category: "Beauty",
    thumbnail:
      "https://cdn.dummyjson.com/product-images/beauty/powder-canister/thumbnail.webp",
    description:
      "A compact powder canister suitable for everyday makeup application.",
  },
  {
    id: 4,
    title: "Red Lipstick",
    price: 12.99,
    rating: 4.36,
    category: "Beauty",
    thumbnail:
      "https://cdn.dummyjson.com/product-images/beauty/red-lipstick/thumbnail.webp",
    description:
      "A vibrant red lipstick with a smooth and long-lasting finish.",
  },
  {
    id: 7,
    title: "Wireless Headphones",
    price: 89.99,
    rating: 4.41,
    category: "Electronics",
    thumbnail:
      "https://cdn.dummyjson.com/product-images/mobile-accessories/amazon-echo-plus/thumbnail.webp",
    description:
      "Comfortable wireless headphones with clear sound and long battery life.",
  },
  {
    id: 8,
    title: "Annibale Colombo Bed",
    price: 1899.99,
    rating: 4.77,
    category: "Furniture",
    thumbnail:
      "https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-bed/thumbnail.webp",
    description:
      "The Annibale Colombo Bed is a luxurious and elegant bed frame, crafted with high-quality materials for a comfortable and stylish bedroom.",
  },
  {
    id: 9,
    title: "Annibale Colombo Sofa",
    price: 2499.99,
    rating: 3.92,
    category: "Furniture",
    thumbnail:
      "https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-sofa/thumbnail.webp",
    description:
      "The Annibale Colombo Sofa is a sophisticated and comfortable seating option, featuring exquisite design and premium upholstery for your living room.",
  },
  {
    id: 10,
    title: "Fresh Apples",
    price: 4.99,
    rating: 4.65,
    category: "Groceries",
    thumbnail:
      "https://cdn.dummyjson.com/product-images/groceries/apple/thumbnail.webp",
    description:
      "Fresh and delicious apples suitable for snacks and everyday meals.",
  },
];

const priceOptions = [
  "All",
  "Under $20",
  "$20 - $100",
  "$100 - $500",
  "Over $500",
];

const ratingOptions = ["All", "4.5+", "4.0+", "3.0+"];

export default function HomeScreen() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPrice, setSelectedPrice] = useState("All");
  const [selectedRating, setSelectedRating] = useState("All");
  const [loading, setLoading] = useState(false);

  const categories = [
    "All",
    ...new Set(products.map((product) => product.category)),
  ];

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
  }, [search, selectedCategory, selectedPrice, selectedRating]);

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
