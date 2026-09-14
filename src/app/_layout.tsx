import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="product_home" />
      <Stack.Screen name="product_details/[id]" />
    </Stack>
  );
}
