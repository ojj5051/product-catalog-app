import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface PaginationProps {
  page: number;
  totalPages: number;
  search: string;
  handleSearch: (query: string, pageNumber: number) => void;
  loadProducts: (page: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  search,
  handleSearch,
  loadProducts,
}: PaginationProps) {
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
            onPress={() => {
              if (search.trim()) {
                handleSearch(search.trim(), Number(item));
              } else {
                loadProducts(Number(item));
              }
            }}
            style={[
              styles.pageButton,
              page === item && styles.activePageButton,
            ]}
          >
            <Text
              style={[styles.pageText, page === item && styles.activePageText]}
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
  );
}

const styles = StyleSheet.create({
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
