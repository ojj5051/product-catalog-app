import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProductDetailScreen() {
  const router = useRouter();

  const { product: productParam } = useLocalSearchParams<{
    id: string;
    product: string;
  }>();

  const product = JSON.parse(productParam);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Product Details</Text>

        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.thumbnail }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{product.title}</Text>

          <View style={styles.ratingRow}>
            <Text style={styles.rating}>⭐ {product.rating}</Text>

            <Text style={styles.reviews}>Customer rating</Text>
          </View>

          <Text style={styles.price}>${product.price.toFixed(2)}</Text>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Description</Text>

          <Text style={styles.description}>{product.description}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },

  header: {
    height: 60,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  backText: {
    fontSize: 38,
    color: "#111",
    lineHeight: 40,
  },

  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#111",
  },

  imageContainer: {
    height: 330,
    margin: 20,
    borderRadius: 20,
    backgroundColor: "#F7F7F8",
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    width: "85%",
    height: "85%",
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  title: {
    fontSize: 25,
    fontWeight: "700",
    color: "#111",
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },

  rating: {
    fontSize: 14,
    color: "#555",
  },

  reviews: {
    marginLeft: 10,
    fontSize: 13,
    color: "#999",
  },

  price: {
    marginTop: 18,
    fontSize: 28,
    fontWeight: "700",
    color: "#111",
  },

  divider: {
    height: 1,
    backgroundColor: "#EEE",
    marginVertical: 24,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },

  description: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 24,
    color: "#666",
  },
});
