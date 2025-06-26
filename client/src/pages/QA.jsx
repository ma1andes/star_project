import React, { useEffect, useState } from 'react';
import '../css/qastyle.css'

function QA() {
    const [comment, setComment] = useState('');
    const [status, setStatus] = useState('');
    const [qa, setQa] = useState([]);
    const role = localStorage.getItem('role');

    const loadQA = async () => {
        const response = await fetch('http://10.16.0.83:8000/api/qa/vopr', {
            headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` }
        });
        const data = await response.json();
        if (response.status === 200) {
            setQa(data.data);
        }
    };

    const onSubmitQA = async (e) => {
        e.preventDefault();
        const response = await fetch('http://10.16.0.83:8000/api/qa', {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ comment, status })
        });
        const data = await response.json();
        if (response.ok) {
            setQa(prevQa => [...prevQa, data.data]); 
            setComment(''); 
            setStatus(''); 
        }
    };

    const DeleteQA = async (id) => {
        const response = await fetch(`http://10.16.0.83:8000/api/qa/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            setQa(prev => prev.filter(el => el.id !== id));
        }
    };

    useEffect(() => {
        loadQA();
    }, []);

    return (
        <div className="qa-container">
            {role === 'qa' && (
                <form className="qa-form" onSubmit={onSubmitQA}>
                    <p>опиши ошибку <br /></p>
                    <textarea
                        className="qa-textarea"
                        value={comment}
                        placeholder='comment'
                        onChange={(el) => setComment(el.target.value)}
                    />
                    <select className="qa-select" value={status} onChange={(el) => setStatus(el.target.value)}>
                        <option value="" disabled>статус</option>
                        <option value="on_hold">on_hold</option>
                        <option value="complete">complete</option>
                        <option value="in_progress">in_progress</option>
                    </select>
                    <button className="qa-button" type="submit">Отправить на дев</button>
                </form>
            )}
            <h1 className="qa-title">ЗАДАЧИ НАХ</h1>
            {qa.map(q => (
                <div key={q.id} className="qa-task">
                    <h3>task - {q.comment}</h3>
                    <h3>status - {q.status}</h3>
                    {role === 'qa' && (
                        <button className="delete-button" onClick={() => DeleteQA(q.id)}>delete</button>
                    )}
                </div>
            ))}
        </div>
    );
}

export default QA;
