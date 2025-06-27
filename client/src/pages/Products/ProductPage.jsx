import { useEffect, useState } from "react";
import { useUser } from "../../utils/UserContext";
import { CreateProduct } from "./Form/CreateProduct";
import { UpdateProduct } from "./Form/UpdateProduct";
import "./products.css";
import { ConfirmModal } from "../../components/ConfirmModal";

export const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const { user, loading: userLoading } = useUser();

  const deleteProduct = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/product/${id}`, {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      if (response.status === 200) {
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== id)
        );
      } else {
        console.error("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const updateProduct = async (product) => {
    setEditingProduct(product);
  };

  const handleProductUpdate = (updatedProduct) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
  };

  const closeUpdateModal = () => {
    setEditingProduct(null);
  };

  const loadProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://127.0.0.1:8000/api/products", {
        headers: { "content-type": "application/json" },
      });
      if (response.status === 200) {
        const data = await response.json();
        setProducts(data.data);
      } else {
        setProducts([]);
        console.error("Failed to load products");
      }
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  const SearchProduct = async (e) => {
    e.preventDefault();
    if (!search.trim()) {
      await loadProduct();
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/products?title=${encodeURIComponent(
          search
        )}`,
        {
          headers: { "content-type": "application/json" },
        }
      );
      if (response.status === 200) {
        const data = await response.json();
        setProducts(data.data);
      } else {
        console.error("Failed to search products");
      }
    } catch (error) {
      console.error("Error searching products:", error);
    }
  };

  const FilterProduct = async (selectedFilter) => {
    if (!selectedFilter) {
      await loadProduct();
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/products?type=${encodeURIComponent(
          selectedFilter
        )}`,
        {
          headers: { "content-type": "application/json" },
        }
      );
      if (response.status === 200) {
        const data = await response.json();
        setProducts(data.data);
      } else {
        console.error("Failed to filter products");
      }
    } catch (error) {
      console.error("Error filtering products:", error);
    }
  };

  useEffect(() => {
    loadProduct();
  }, []);

  const handleFilterChange = (e) => {
    const selectedFilter = e.target.value;
    setFilter(selectedFilter);
    FilterProduct(selectedFilter);
  };

  const handleAddToCart = async (productId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/cart/${productId}`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );
      if (response.status === 201) {
        alert("Товар добавлен в корзину!");
      } else {
        console.error("Failed to add product to cart");
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  const confirmDelete = (product) => {
    setProductToDelete(product);
    setIsConfirmOpen(true);
  };

  return (
    
    <div>
      {!userLoading && user?.role === "admin" && (
        <CreateProduct onCreateProduct={loadProduct} />
      )}

      <h1>ТОВАРЫ</h1>

      {loading && <p>Загрузка товаров...</p>}

      <select value={filter} onChange={handleFilterChange}>
        <option value="">no filter</option>
        <option value="dress">dress</option>
        <option value="school">school</option>
      </select>

      <form onSubmit={SearchProduct}>
        <input
          type="text"
          placeholder="title"
          value={search}
          onChange={(el) => setSearch(el.target.value)}
        />
        <button type="submit">search</button>
      </form>

      <div className="product-container">
        {products.map((product) => (
          <div key={product.id} className="products">
            <p>{product.title}</p>
            <p>{product.desc}</p>
            <p>{product.price}</p>
            <p>{product.type}</p>
            <img
              src={`http://127.0.0.1:8000${product.img}`}
              alt="Картинка товара"
            />
            {!userLoading && user?.role !== "admin" && (
              <button
                className="button"
                onClick={() => handleAddToCart(product.id)}
              >
                Добавить в корзину
              </button>
            )}
            {!userLoading && user?.role === "admin" && (
              <>
                <button
                  className="button"
                  onClick={() => confirmDelete(product)}
                >
                  delete
                </button>
                <button
                  className="button"
                  onClick={() => updateProduct(product)}
                >
                  update
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      {editingProduct && (
        <UpdateProduct
          product={editingProduct}
          onUpdate={handleProductUpdate}
          onClose={closeUpdateModal}
        />
      )}

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => {
          setIsConfirmOpen(false);
          setProductToDelete(null);
        }}
        onConfirm={() => {
          if (productToDelete) {
            deleteProduct(productToDelete.id);
          }
        }}
        title="Удаление товара"
        message={`Вы уверены, что хотите удалить "${productToDelete?.title}"?`}
        confirmText="Удалить"
        cancelText="Отмена"
      />
    </div>
  );
};
