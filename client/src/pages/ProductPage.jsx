import React, { useEffect, useState } from 'react';
import "../css/products.css";

function ProductPage() {
    const [products, setProducts] = useState([]);
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [type, setType] = useState('');
    const [price, setPrice] = useState('');
    const [filter, setFilter] = useState('');
    const [search, setSearch] = useState('');

    const role = localStorage.getItem('role');

    const deleteProduct = async (id) => {
        const response = await fetch(`http://10.16.0.83:8000/api/product/${id}`, {
            method: 'DELETE',
            headers: { "content-type": 'application/json', Authorization: `Bearer ${localStorage.getItem('auth_token')}` },
        });
        if (response.status === 200) {
            setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
        }
    };

    const updateProduct = async (id) => {
        // Ваш код для обновления продукта
    };

    const createProduct = async (e) => {
        e.preventDefault();
        const response = await fetch('http://10.16.0.83:8000/api/product', {
            method: 'POST',
            headers: { "content-type": 'application/json', Authorization: `Bearer ${localStorage.getItem('auth_token')}` },
            body: JSON.stringify({ title, desc, price, type })
        });
        if (response.status === 201) {
            const data = await response.json();
            setProducts(prev => [...prev, data]);
        }
    };

    const loadProduct = async () => {
        const response = await fetch('http://10.16.0.83:8000/api/products', {
            headers: { "content-type": 'application/json' }
        });
        if (response.status === 200) {
            const data = await response.json();
            setProducts(data.data);
        }
    };

    const SearchProduct = async (e) => {
        e.preventDefault();
        const response = await fetch(`http://10.16.0.83:8000/api/products?title=${search}`, {
            headers: { "content-type": 'application/json' }
        });
        if (response.status === 200) {
            const data = await response.json();
            setProducts(data.data);
        }
    };

    const FilterProduct = async (selectedFilter) => {
        const response = await fetch(`http://10.16.0.83:8000/api/products?type=${selectedFilter}`, {
            headers: { "content-type": 'application/json' }
        });
        if (response.status === 200) {
            const data = await response.json();
            setProducts(data.data);
        }
    };

    useEffect(() => {
        loadProduct();
    }, []);

    const handleFilterChange = (e) => {
        const selectedFilter = e.target.value;
        setFilter(selectedFilter);
        FilterProduct(selectedFilter); // Применяем фильтрацию сразу после выбора
    };

    return (
        <div>
            {role === 'admin' && (
                <div>
                    <h1>СОЗДАНИЕ ТОВАРА</h1>
                    <form onSubmit={createProduct} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <input type="text" placeholder='title' value={title} onChange={(el) => setTitle(el.target.value)} />
                        <input type="text" placeholder='desc' value={desc} onChange={(el) => setDesc(el.target.value)} />
                        <input type="number" placeholder='price' value={price} onChange={(el) => setPrice(el.target.value)} />
                        <select value={type} onChange={(el) => setType(el.target.value)}>
                            <option value="" disabled>choose type</option>
                            <option value="school">school</option>
                            <option value="dress">dress</option>
                        </select>
                        <button type="submit">create</button>
                    </form>
                </div>
            )}

            <h1>ТОВАРЫ</h1>
            <select value={filter} onChange={handleFilterChange}>
                <option value="">no filter</option>
                <option value="dress">dress</option>
                <option value="school">school</option>
            </select>
            <form onSubmit={SearchProduct}>
                <input type="text" placeholder='title' value={search} onChange={(el) => setSearch(el.target.value)} />
                <button type="submit">search</button>
            </form>
            <div className="product-container">
                {products.map(product => (
                    <div key={product.id} className='products'>
                        <p>{product.title}</p>
                        <p>{product.desc}</p>
                        <p>{product.price}</p>
                        <p>{product.type}</p>
                        {role === 'admin' || role === 'qa' || role==='user' && (
                            <>
                                <button className="button">Добавить в корзину</button>  
                            </>
                        )}
                        {role === 'admin' && (
                            <>
                                <button className="button" onClick={() => deleteProduct(product.id)}>delete</button>
                                <button className="button" onClick={() => updateProduct(product.id)}>update</button>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProductPage;
