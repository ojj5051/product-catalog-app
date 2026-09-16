import { Product } from "../../../types/product";
import { filterByCategory } from "../index";

const products: Product[] = [
  {
    id: 1,
    title: "iPhone 15",
    description: "Apple smartphone",
    price: 799,
    rating: 4.8,
    thumbnail: "",
    images: [],
    category: "smartphones",
  },
  {
    id: 2,
    title: "Samsung Galaxy",
    description: "Android smartphone",
    price: 599,
    rating: 4.5,
    thumbnail: "",
    images: [],
    category: "smartphones",
  },
  {
    id: 3,
    title: "Red Lipstick",
    description: "Red lipstick",
    price: 15,
    rating: 4.2,
    thumbnail: "",
    images: [],
    category: "beauty",
  },
];

jest.mock("../../../api/productApi", () => ({
  getProducts: jest.fn(),
  searchProducts: jest.fn(),
  getProductsByCategory: jest.fn(),
}));

describe("filterByCategory", () => {
  it("returns all products when category is All", () => {
    const result = filterByCategory(products, "All");

    expect(result).toHaveLength(3);
  });

  it("filters products by category", () => {
    const result = filterByCategory(products, "smartphones");

    expect(result).toHaveLength(2);

    expect(result.every((product) => product.category === "smartphones")).toBe(
      true,
    );
  });

  it("returns an empty array when no products match", () => {
    const result = filterByCategory(products, "beauty");

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Red Lipstick");
  });
});
