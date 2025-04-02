import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import axios from 'axios';
import './ListItemsPage.css';

interface Item {
    _id: string;
    title: string;
    description: string;
    imageURL: string;
    price: number;
    type: string;
}

const ListItemsPage: React.FC = () => {
    const [items, setItems] = useState<Item[]>([]);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get('http://localhost:4999/api/foodItems');
                setItems(response.data);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách sản phẩm:', error);
            }
        };
        fetchItems();
    }, []);

    const handleDelete = async (id: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
            try {
                await axios.delete(`http://localhost:4999/api/foodItems/${id}`);
                setItems((prevItems) => prevItems.filter((item) => item._id !== id));
                alert('Sản phẩm đã được xóa!');
            } catch (error) {
                console.error('Lỗi khi xóa sản phẩm:', error);
                alert('Lỗi khi xóa sản phẩm!');
            }
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
                            <tr key={item._id}>
                                <td>
                                    {item.imageURL ? (
                                        <img src={`http://localhost:4999${item.imageURL}`} alt={item.title} className="item-image" />
                                    ) : (
                                        'No Image'
                                    )}
                                </td>
                                <td>{item.title}</td>
                                <td>{item.description}</td>
                                <td>{item.type}</td>
                                <td>${item.price.toFixed(2)}</td>
                                <td>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDelete(item._id)}
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