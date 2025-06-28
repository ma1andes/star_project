import { useEffect, useState } from "react";
import { useUser, apiFetch, ConfirmModal, Card, CardContainer } from "../../shared";
import { CreateProduct } from "./Form/CreateForm/CreateForm";
import { UpdateProduct } from "./Form/UpdateForm/UpdateForm";
import "./products.css";

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
      await apiFetch(`/product/${id}`, {
        method: "DELETE",
        requireAuth: true,
      });
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== id)
      );
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
      const data = await apiFetch("/products", {
        method: "GET",
        requireAuth: false,
      });
      setProducts(data.data);
    } catch (error) {
      console.error("Error loading products:", error);
      setProducts([]);
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
      const data = await apiFetch(`/products?title=${encodeURIComponent(search)}`, {
        method: "GET",
        requireAuth: false,
      });
      setProducts(data.data);
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
      const data = await apiFetch(`/products?type=${encodeURIComponent(selectedFilter)}`, {
        method: "GET",
        requireAuth: false,
      });
      setProducts(data.data);
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
      await apiFetch(`/cart/add/${productId}`, {
        method: "POST",
        requireAuth: true,
      });
      alert("Товар добавлен в корзину!");
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
        <option value="dress">Платья</option>
        <option value="school">Школа</option>
      </select>

      <form onSubmit={SearchProduct}>
        <input
          type="text"
          placeholder="Название"
          value={search}
          onChange={(el) => setSearch(el.target.value)}
        />
        <button type="submit">Поиск</button>
      </form>

      <CardContainer>
        {products.map((product) => (
          <Card key={product.id}>
            <img
              src={`http://127.0.0.1:8000${product.img}`}
              alt={product.title}
            />
            <h2>{product.title}</h2>
            <h3>{product.desc}</h3>
            <p>{product.price}</p>
            <p>{product.type}</p>

            <div className="button-group">
              <button
                onClick={() => handleAddToCart(product.id)}
              >
                Добавить в корзину
              </button>
              {!userLoading && user?.role === "admin" && (
                <>
                  <button
                    className="delete-btn"
                    onClick={() => confirmDelete(product)}
                  >
                    Удалить
                  </button>
                  <button
                    className="update-btn"
                    onClick={() => updateProduct(product)}
                  >
                    Изменить
                  </button>
                </>
              )}
            </div>
          </Card>
        ))}
      </CardContainer>

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
