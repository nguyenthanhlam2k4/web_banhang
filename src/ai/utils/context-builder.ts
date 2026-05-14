import dbConnect from "@/lib/db";
import Product from "@/models/Product";

export const getProductContext = async (query: any = {}) => {
  try {
    await dbConnect();
    // Fetch relevant products (limited to 20 for token optimization)
    const products = await Product.find(query)
      .limit(20)
      .populate('category', 'name')
      .lean();

    if (!products || products.length === 0) {
      return "No products found in the database.";
    }

    const formattedProducts = products.map(p => ({
      id: p._id,
      name: p.name,
      description: p.description.substring(0, 150) + "...",
      price: p.price,
      category: (p.category as any)?.name || "Uncategorized",
      brand: p.brand,
      stock: p.stock > 0 ? "In Stock" : "Out of Stock",
      rating: p.rating,
      tags: p.tags?.join(", ") || "",
    }));

    return JSON.stringify(formattedProducts, null, 2);
  } catch (error) {
    console.error("Context Builder Error:", error);
    return "Error fetching product context.";
  }
};

export const getSingleProductContext = async (productId: string) => {
  try {
    await dbConnect();
    const product = await Product.findById(productId).populate('category', 'name').lean();
    if (!product) return "Product not found.";

    return JSON.stringify({
      name: product.name,
      description: product.description,
      price: product.price,
      specifications: product.specifications,
      brand: product.brand,
      rating: product.rating,
      stock: product.stock
    }, null, 2);
  } catch (error) {
    return "Error fetching product details.";
  }
};
