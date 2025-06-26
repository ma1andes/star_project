import React, { useEffect, useState } from 'react';
import "../css/products.css";

function ProductPage() {
    const [products, setProducts] = useState([]);
    const [filter, setFilter] = useState('');
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newProduct, setNewProduct] = useState({
        title: '',
        desc: '',
        price: '',
        type: ''
    });

    const user = localStorage.getItem('user');
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('auth_token');

    const loadProduct = async () => {
        const response = await fetch('http://10.16.0.83:8000/api/products', {
            headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: `Bearer ${token}` })
            },
            mode: 'cors'
        });
        if (response.status === 200) {
            const data = await response.json();
            setProducts(data.data);
        }
    };

    const deleteProduct = async (id) => {
        const response = await fetch(`http://10.16.0.83:8000/api/product/${id}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            mode: 'cors'
        });
        if (response.status === 200) {
            setProducts(prev => prev.filter(p => p.id !== id));
        }
    };

    const updateProduct = async (id) => {
        const productToUpdate = products.find(p => p.id === id);

        const newTitle = prompt("Введите новое название", productToUpdate.title);
        const newDesc = prompt("Введите описание", productToUpdate.desc);
        const newPrice = prompt("Введите цену", productToUpdate.price);
        const newType = prompt("Введите тип (dress/school)", productToUpdate.type);

        const updatedData = {
            title: newTitle,
            desc: newDesc,
            price: parseFloat(newPrice),
            type: newType
        };

        const response = await fetch(`http://10.16.0.83:8000/api/product/${id}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(updatedData),
            mode: 'cors'
        });

        if (response.status === 200) {
            loadProduct();
        } else {
            alert("Ошибка при обновлении");
        }
    };

    const SearchProduct = async (e) => {
        e.preventDefault();
        const response = await fetch(`http://10.16.0.83:8000/api/products?title=${search}`, {
            headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: `Bearer ${token}` })
            },
            mode: 'cors'
        });
        if (response.status === 200) {
            const data = await response.json();
            setProducts(data.data);
        }
    };

    const FilterProduct = async (selectedFilter) => {
        const url = selectedFilter ? `http://10.16.0.83:8000/api/products?type=${selectedFilter}` : 'http://10.16.0.83:8000/api/products';
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: `Bearer ${token}` })
            },
            mode: 'cors'
        });
        if (response.status === 200) {
            const data = await response.json();
            setProducts(data.data);
        }
    };

    const handleFilterChange = (e) => {
        const selectedFilter = e.target.value;
        setFilter(selectedFilter);
        FilterProduct(selectedFilter);
    };

    const createProduct = async () => {
        const response = await fetch('http://10.16.0.83:8000/api/product/create', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                ...newProduct,
                price: parseFloat(newProduct.price)
            }),
            mode: 'cors'
        });

        if (response.status === 201) {
            loadProduct();
            setNewProduct({ title: '', desc: '', price: '', type: '' });
            setIsModalOpen(false);
        } 
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setNewProduct({ title: '', desc: '', price: '', type: '' });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewProduct((prev) => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        loadProduct();
    }, []);

    return (
        <div>
            {role === 'admin' && (
                <button onClick={openModal} className="button">Создать товар</button>
            )}

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Создание товара</h2>
                        <input
                            name="title"
                            placeholder="Название"
                            value={newProduct.title}
                            onChange={handleChange}
                        />
                        <input
                            name="desc"
                            placeholder="Описание"
                            value={newProduct.desc}
                            onChange={handleChange}
                        />
                        <input
                            name="price"
                            placeholder="Цена"
                            value={newProduct.price}
                            onChange={handleChange}
                        />
                        <select
                            name="type"
                            value={newProduct.type}
                            onChange={handleChange}
                        >
                            <option value="">Выберите тип</option>
                            <option value="dress">dress</option>
                            <option value="school">school</option>
                        </select>
                        <div className='buuton-modal'>
                            <button onClick={createProduct}>Создать</button>
                            <button onClick={closeModal}>Отменить</button>
                        </div>
                    </div>
                </div>
            )}

            <h1>ТОВАРЫ</h1>

            <select value={filter} onChange={handleFilterChange}>
                <option value="">no filter</option>
                <option value="dress">dress</option>
                <option value="school">school</option>
            </select>

            <form onSubmit={SearchProduct}>
                <input
                    type="text"
                    placeholder='Поиск по названию'
                    value={search}
                    onChange={(el) => setSearch(el.target.value)}
                />
                <button type="submit">Найти</button>
            </form>

            <div className="product-container">
                {products.map(product => (
                    <div key={product.id} className='products'>
                        <p><strong>Название:</strong> {product.title}</p>
                        <p><strong>Описание:</strong> {product.desc}</p>
                        <p><strong>Цена:</strong> {product.price}</p>
                        <p><strong>Тип:</strong> {product.type}</p>

                        {role === 'admin' && (
                            <>
                                <button className="button" onClick={() => deleteProduct(product.id)}>Удалить</button>
                                <button className="button" onClick={() => updateProduct(product.id)}>Обновить</button>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProductPage;