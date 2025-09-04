import { useEffect, useState, useContext } from "react";
// import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Loader from "../components/Loader";
import { getAllProducts } from "../api/productAction";
import { CartContext } from "../contexts/CartContext";

const ProductCard = () => {
  const [productData, setProductData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { addToCart } = useContext(CartContext);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const products = await getAllProducts();
      setProductData(products);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      // toast.error("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50">
          <Loader />
        </div>
      )}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-semibold">
                Products List
              </CardTitle>
              <CardDescription>
                View and select products available for sale, with details on
                pricing and availability to support smooth transactions.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
      <Separator />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {productData.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">
            No products found.
          </p>
        ) : (
          productData.map((product) => (
            <Card key={product.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg">{product.productName}</CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  {product.category?.name || "Unknown"}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-2">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.productName}
                    className="w-32 h-32 object-cover rounded"
                  />
                ) : (
                  <div className="w-32 h-32 flex items-center justify-center bg-gray-100 text-gray-400 rounded">
                    No Image
                  </div>
                )}
                <p className="text-sm font-medium">
                  {product.price}{" "}
                  <span style={{ fontFamily: "Hanuman, sans-serif" }}>៛</span>
                </p>

                <Button
                  onClick={() => handleAddToCart(product)}
                  className="mt-2 w-full"
                >
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </>
  );
};

export default ProductCard;
