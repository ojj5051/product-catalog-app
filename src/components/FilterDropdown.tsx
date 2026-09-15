import { useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface FilterDropdownProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

export default function FilterDropdown({
  label,
  value,
  options,
  onChange,
}: FilterDropdownProps) {
  const [visible, setVisible] = useState(false);

  const handleSelect = (option: string) => {
    onChange(option);
    setVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => setVisible(true)}>
        <View>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.value}>{value}</Text>
        </View>

        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <View style={styles.menu} onStartShouldSetResponder={() => true}>
            <Text style={styles.menuTitle}>{label}</Text>

            <FlatList
              data={options}
              keyExtractor={(item) => item}
              showsVerticalScrollIndicator
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.option,
                    item === value && styles.selectedOption,
                  ]}
                  onPress={() => handleSelect(item)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      item === value && styles.selectedOptionText,
                    ]}
                  >
                    {item}
                  </Text>

                  {item === value && <Text style={styles.check}>✓</Text>}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginRight: 8,
  },

  button: {
    minWidth: 120,
    height: 52,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    backgroundColor: "#FFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  label: {
    fontSize: 11,
    color: "#888",
    marginBottom: 2,
  },

  value: {
    fontSize: 14,
    fontWeight: "600",
    color: "#222",
  },

  arrow: {
    fontSize: 10,
    color: "#666",
    marginLeft: 8,
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  menu: {
    maxHeight: 350,
    backgroundColor: "#FFF",
    borderRadius: 12,
    overflow: "hidden",
  },

  menuTitle: {
    fontSize: 18,
    fontWeight: "600",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },

  option: {
    minHeight: 48,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  selectedOption: {
    backgroundColor: "#F5F5F5",
  },

  optionText: {
    fontSize: 15,
    color: "#333",
  },

  selectedOptionText: {
    fontWeight: "600",
    color: "#111",
  },

  check: {
    fontSize: 18,
    fontWeight: "600",
  },
});
