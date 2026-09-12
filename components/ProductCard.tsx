import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type ProductType = {
  id: number;
  title: string;
  price: number;
  rating: number;
  thumbnail: string;
  description: string;
};

interface ProductCardProps {
  products: ProductType[];
  loading: boolean;
}

export default function ProductCard({ products, loading }: ProductCardProps) {
  const renderProduct = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => ""}
    >
      <Image
        source={{ uri: item.thumbnail }}
        style={styles.thumbnail}
        resizeMode="contain"
      />

      <View style={styles.productInfo}>
        <Text style={styles.productTitle} numberOfLines={2}>
          {item.title}
        </Text>

        <Text style={styles.rating}>⭐ {item.rating}</Text>

        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <Text style={styles.stateText}>Loading products...</Text>
        </View>
      ) : products.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyTitle}>No products found</Text>
          <Text style={styles.stateText}>
            Try searching for something else.
          </Text>
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
  },
  thumbnail: {
    width: 105,
    height: 105,
    borderRadius: 12,
    backgroundColor: "#F4F4F4",
  },
  productInfo: {
    flex: 1,
    paddingLeft: 14,
    justifyContent: "center",
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    lineHeight: 22,
  },
  rating: {
    marginTop: 8,
    fontSize: 13,
    color: "#777",
  },
  price: {
    marginTop: 8,
    fontSize: 19,
    fontWeight: "700",
    color: "#111",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  stateText: {
    marginTop: 10,
    fontSize: 14,
    color: "#888",
  },
  emptyIcon: {
    fontSize: 45,
  },
  emptyTitle: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
  },
});
