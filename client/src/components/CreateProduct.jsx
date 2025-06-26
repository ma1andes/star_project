import React, { useState } from 'react'

function CreateProduct() {
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [type, setType] = useState('');
    const [price, setPrice] = useState('');

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

  return (
    <div>
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
                        <div>
                            <button onClick={createProduct}>Создать</button>
                            <button onClick={closeModal}>Отменить</button>
                        </div>
                    </div>
                </div>
            )}
    </div>
  )
}

export default CreateProduct