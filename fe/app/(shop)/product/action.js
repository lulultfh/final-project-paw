// app/(shop)/product/action.jsx
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