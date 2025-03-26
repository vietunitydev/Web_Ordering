import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import './ListItemsPage.css';

interface Item {
    id: number;
    name: string;
    description: string;
    category: string;
    price: number;
    image: string | null;
}

const ListItemsPage: React.FC = () => {
    const [items, setItems] = useState<Item[]>([]);

    useEffect(() => {
        const storedItems = localStorage.getItem('items');
        if (storedItems) {
            setItems(JSON.parse(storedItems));
        }
    }, []);

    const handleDelete = (id: number) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
            const updatedItems = items.filter((item) => item.id !== id);
            setItems(updatedItems);
            localStorage.setItem('items', JSON.stringify(updatedItems));
        }
    };

    return (
        <AdminLayout activePage="list-items">
            <div className="list-items-page">
                <h2>All Food List</h2>
                {items.length === 0 ? (
                    <p className="no-items">Chưa có sản phẩm nào.</p>
                ) : (
                    <table className="items-table">
                        <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {items.map((item) => (
                            <tr key={item.id}>
                                <td>
                                    {item.image ? (
                                        <img src={item.image} alt={item.name} className="item-image" />
                                    ) : (
                                        'No Image'
                                    )}
                                </td>
                                <td>{item.name}</td>
                                <td>{item.description}</td>
                                <td>{item.category}</td>
                                <td>${item.price.toFixed(2)}</td>
                                <td>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDelete(item.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </AdminLayout>
    );
};

export default ListItemsPage;