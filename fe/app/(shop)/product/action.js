export async function getDataById(id) {
  const res = await fetch(`http://localhost:3001/api/product/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch product by id");
  }
  return res.json();
}

export async function getAllProducts() {
  const res = await fetch("http://localhost:3001/api/product", {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }
  return res.json();
}

// ... createMenu tetap sama
export async function createMenu(formData) {
  const headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };

  const rawData = {
    name: formData.get("name"),
    price: formData.get("price"),
    thumbnail: formData.get("thumbnail"),
  };

  if (!rawData.name || !rawData.price) {
    return {
      message: "Server validation failed.",
      errors: {
        nameField: !rawData.name ? "Field name is required." : undefined,
        priceField: !rawData.price ? "Field price is required." : undefined,
      },
    };
  }

  const bodyContent = JSON.stringify({ ...rawData, reviews: [] });

  const res = await fetch("http://localhost:3001/api/product", {
    method: "POST",
    body: bodyContent,
    headers: headersList,
  });

  return res.json();
}

// Fungsi untuk membuat pesanan sementara
export async function createSessionOrder() {
  try {
    const res = await fetch("http://localhost:3001/api/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "pending" }), // Mengirim status yang diperlukan
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to create session order: ${errorText}`);
    }

    const data = await res.json();
    return data.id; // API Anda mengembalikan 'id' sebagai nomor pesanan
  } catch (error) {
    console.error("Error creating session order:", error);
    return null;
  }
}

// Fungsi yang sekarang menambahkan produk ke pesanan
export async function addToCart(product, orderId) {
  try {
    const quantity = 1;
    const subtotal = product.price * quantity;
    
    const res = await fetch("http://localhost:3001/api/order-item", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order_id: orderId,
        product_id: product.id,
        qty: quantity,
        subtotal: subtotal,
      }),
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to add product to cart: ${errorText}`);
    }
    
    return res.json();
  } catch (error) {
    console.error("Error adding to cart:", error);
    return { error: true, message: "Gagal menambahkan produk ke keranjang." };
  }
}