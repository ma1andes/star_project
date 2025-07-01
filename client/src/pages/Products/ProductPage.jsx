import { useEffect, useState } from "react";
import {
  useUser,
  apiFetch,
  ConfirmModal,
  Card,
  CardContainer,
} from "../../shared";
import { CreateProduct } from "./Form/CreateForm/CreateForm";
import { UpdateProduct } from "./Form/UpdateForm/UpdateForm";
import "./products.css";

export const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
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
      setProducts(prev => prev.filter(product => product.id !== id));
      setDisplayedProducts(prev => prev.filter(product => product.id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const updateProduct = async (product) => {
    setEditingProduct(product);
  };

  const handleProductUpdate = (updatedProduct) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    setDisplayedProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
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
      setDisplayedProducts(data.data.map(p => ({ ...p, fadeState: 'visible' })));
    } catch (error) {
      console.error("Error loading products:", error);
      setProducts([]);
      setDisplayedProducts([]);
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
      setIsFiltering(true);
      // Анимация исчезновения
      setDisplayedProducts(prev => prev.map(p => ({ ...p, fadeState: 'fade-out' })));
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const data = await apiFetch(`/products?title=${encodeURIComponent(search)}`, {
        method: "GET",
        requireAuth: false,
      });
      
      setProducts(data.data);
      setDisplayedProducts(data.data.map(p => ({ ...p, fadeState: 'fade-in' })));
      
      setTimeout(() => {
        setDisplayedProducts(data.data.map(p => ({ ...p, fadeState: 'visible' })));
      }, 50);
    } catch (error) {
      console.error("Error searching products:", error);
    } finally {
      setIsFiltering(false);
    }
  };

  const FilterProduct = async (selectedFilter) => {
    if (!selectedFilter) {
      await loadProduct();
      return;
    }

    try {
      setIsFiltering(true);
      // Анимация исчезновения
      setDisplayedProducts(prev => prev.map(p => ({ ...p, fadeState: 'fade-out' })));
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const data = await apiFetch(`/products?type=${encodeURIComponent(selectedFilter)}`, {
        method: "GET",
        requireAuth: false,
      });
      
      setProducts(data.data);
      setDisplayedProducts(data.data.map(p => ({ ...p, fadeState: 'fade-in' })));
      
      setTimeout(() => {
        setDisplayedProducts(data.data.map(p => ({ ...p, fadeState: 'visible' })));
      }, 50);
    } catch (error) {
      console.error("Error filtering products:", error);
    } finally {
      setIsFiltering(false);
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
      await apiFetch(`/cart/${productId}`, {
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
    <div className="products-page">
      {!userLoading && user?.role === "admin" && (
        <CreateProduct onCreateProduct={loadProduct} />
      )}

      <h1>ТОВАРЫ</h1>

      {loading && <div className="loading-overlay">Загрузка товаров...</div>}

      <form onSubmit={SearchProduct} className="products-filter-form">
        <div className="form-row">
          <input
            type="text"
            placeholder="Поиск по названию"
            value={search}
            onChange={(el) => setSearch(el.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="form-row">
          <div className="select-wrapper">
            <select 
              value={filter} 
              onChange={handleFilterChange}
              className="category-select"
            >
              <option value="">Все категории</option>
              <option value="dress">Платья</option>
              <option value="school">Школа</option>
            </select>
          </div>
          
          <button type="submit" className="search-button">
            Найти
          </button>
        </div>
      </form>

      <CardContainer>
        {isFiltering && <div className="filter-loading-indicator"></div>}
        
        {displayedProducts.map((product) => (
          <Card 
            key={product.id} 
            className={`product-card ${product.fadeState}`}
          >
            <div className="product-image-container">
              <img
                src={`http://127.0.0.1:8000${product.img}`}
                alt={product.title}
                className="product-image"
              />
            </div>
            <div className="product-info">
              <h2 className="product-title">{product.title}</h2>
              <p className="product-price">{product.price} ₽</p>
              <p className="product-type">{product.type}</p>
            </div>

            <div className="product-actions">
              <button 
                onClick={() => handleAddToCart(product.id)}
                className="add-to-cart-button"
              >
                Добавить в корзину
              </button>
              {!userLoading && user?.role === "admin" && (
                <div className="admin-actions">
                  <button
                    className="delete-button"
                    onClick={() => confirmDelete(product)}
                  >
                    Удалить
                  </button>
                  <button
                    className="edit-button"
                    onClick={() => updateProduct(product)}
                  >
                    Изменить
                  </button>
                </div>
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