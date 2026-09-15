import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface SearchBarProps {
  search: string;
  setSearch: (search: string) => void;
}

export default function SearchBar({ search, setSearch }: SearchBarProps) {
  return (
    <View style={styles.searchContainer}>
      <Text style={styles.searchIcon}>⌕</Text>

      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Search products..."
        placeholderTextColor="#999"
        style={styles.searchInput}
      />

      {search.length > 0 && (
        <TouchableOpacity onPress={() => setSearch("")}>
          <Text style={styles.clearButton}>×</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F8",
  },
  searchContainer: {
    height: 48,
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "#FFF",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },

  searchIcon: {
    fontSize: 25,
    color: "#777",
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#111",
  },

  clearButton: {
    fontSize: 26,
    color: "#999",
  },
});
