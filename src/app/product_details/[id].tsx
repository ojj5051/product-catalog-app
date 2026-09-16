import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
} from "react-native";

const { width } = Dimensions.get("window");

type ProductType = {
  id: number;
  title: string;
  price: number;
  rating: number;
  thumbnail: string;
  description: string;
  images: string[];
};

export default function ProductDetails() {
  const { product } = useLocalSearchParams<{
    id: string;
    product: string;
  }>();

  const [productData, setProductData] = useState<ProductType | null>(null);
  const [currentImage, setCurrentImage] = useState(0);

  const imageListRef = useRef<FlatList<string>>(null);

  useEffect(() => {
    if (!product) {
      return;
    }

    try {
      setProductData(JSON.parse(product));
    } catch (error) {
      console.error("Failed to parse product:", error);
    }
  }, [product]);

  const images = productData?.images?.length
    ? productData.images
    : productData
      ? [productData.thumbnail]
      : [];

  // Slide image every 3 seconds
  useEffect(() => {
    if (images.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentImage((previous) => {
        const nextIndex = (previous + 1) % images.length;

        imageListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });

        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  // Handle slide image with finger/swipe navigation
  const handleViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setCurrentImage(viewableItems[0].index);
      }
    },
  ).current;

  if (!productData) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.imageContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>

        <FlatList
          ref={imageListRef}
          data={images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => `${item}-${index}`}
          renderItem={({ item }) => (
            <View style={styles.imageSlide}>
              <Image
                source={{ uri: item }}
                style={styles.image}
                resizeMode="contain"
              />
            </View>
          )}
          onViewableItemsChanged={handleViewableItemsChanged}
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
        />

        {images.length > 1 && (
          <View style={styles.indicators}>
            {images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  index === currentImage && styles.activeIndicator,
                ]}
              />
            ))}
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{productData.title}</Text>

        <Text style={styles.rating}>⭐ {productData.rating}</Text>

        <Text style={styles.price}>${productData.price.toFixed(2)}</Text>

        <Text style={styles.descriptionTitle}>Description</Text>

        <Text style={styles.description}>{productData.description}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },

  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  backButtonText: {
    fontSize: 32,
    lineHeight: 34,
    color: "#222",
    marginTop: -3,
  },

  imageContainer: {
    height: 350,
    backgroundColor: "#F4F4F4",
    position: "relative",
  },

  imageSlide: {
    width,
    height: 350,
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  indicators: {
    position: "absolute",
    bottom: 15,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },

  indicator: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#CCC",
  },

  activeIndicator: {
    width: 20,
    backgroundColor: "#222",
  },

  content: {
    padding: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#222",
  },

  rating: {
    marginTop: 10,
    fontSize: 15,
    color: "#666",
  },

  price: {
    marginTop: 12,
    fontSize: 24,
    fontWeight: "700",
    color: "#111",
  },

  descriptionTitle: {
    marginTop: 24,
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
  },

  description: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 23,
    color: "#666",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
