import { fireEvent, render, screen } from "@testing-library/react-native";
import { router } from "expo-router";
import ProductList from "../ProductList";

jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
}));

describe("ProductList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("navigates to the product details page when a product is pressed", async () => {
    const product = {
      id: 1,
      title: "iPhone 15",
      price: 799,
      rating: 4.8,
      thumbnail: "https://example.com/iphone.jpg",
      description: "Apple smartphone",
    };

    await render(
      <ProductList
        products={[product]}
        loading={false}
        loadProducts={jest.fn()}
      />,
    );

    fireEvent.press(screen.getByText("iPhone 15"));

    expect(router.push).toHaveBeenCalledWith({
      pathname: "/product_details/[id]",
      params: {
        id: "1",
        product: JSON.stringify(product),
      },
    });
  });
});
