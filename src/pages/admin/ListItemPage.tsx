import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import axios from 'axios';
import './ListItemsPage.css';
import { useAppContext } from '../../components/AppContext/AppContext.tsx';

interface Item {
    _id: string;
    title: string;
    description: string;
    imageURL: string;
    price: number;
    type: string;
}

const ListItemsPage: React.FC = () => {
    const { state } = useAppContext();
    const [items, setItems] = useState<Item[]>([]);
    const [searchTerms, setSearchTerms] = useState({
        title: '',
        description: '',
        type: '',
    });
    const [editItemId, setEditItemId] = useState<string | null>(null);
    const [editData, setEditData] = useState<Partial<Item>>({});

    useEffect(() => {
        const fetchItems = async () => {
            if (state.role !== 'admin') return;
            try {
                const response = await axios.get('http://localhost:4999/api/foodItems', {
                    headers: { Authorization: `Bearer ${state.token}` }
                });
                setItems(response.data);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách sản phẩm:', error);
            }
        };
        if (state.token && state.role === 'admin') fetchItems();
    }, [state.token, state.role]);

    const handleDelete = async (id: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
            try {
                await axios.delete(`http://localhost:4999/api/foodItems/${id}`, {
                    headers: { Authorization: `Bearer ${state.token}` }
                });
                setItems((prevItems) => prevItems.filter((item) => item._id !== id));
                alert('Sản phẩm đã được xóa!');
            } catch (error) {
                console.error('Lỗi khi xóa sản phẩm:', error);
                alert('Lỗi khi xóa sản phẩm!');
            }
        }
    };

    const handleEdit = (item: Item) => {
        setEditItemId(item._id);
        setEditData({ ...item });
    };

    const handleEditChange = (field: string, value: string | number) => {
        setEditData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = async (id: string) => {
        try {
            const response = await axios.put(
                `http://localhost:4999/api/foodItems/${id}`,
                editData,
                { headers: { Authorization: `Bearer ${state.token}` } }
            );
            const updatedItems = items.map((item) =>
                item._id === id ? response.data : item
            );
            setItems(updatedItems);
            setEditItemId(null);
            alert('Sản phẩm đã được cập nhật!');
        } catch (error) {
            console.error('Error updating food item:', error);
            alert('Lỗi khi cập nhật sản phẩm!');
        }
    };

    const handleSearchChange = (field: string, value: string) => {
        setSearchTerms((prev) => ({ ...prev, [field]: value }));
    };

    const filteredItems = items.filter((item) =>
        item.title.toLowerCase().includes(searchTerms.title.toLowerCase()) &&
        item.description.toLowerCase().includes(searchTerms.description.toLowerCase()) &&
        item.type.toLowerCase().includes(searchTerms.type.toLowerCase())
    );

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
                        <tr>
                            <th></th>
                            <th>
                                <input
                                    type="text"
                                    placeholder="Tìm tên"
                                    value={searchTerms.title}
                                    onChange={(e) => handleSearchChange('title', e.target.value)}
                                    className="search-input"
                                />
                            </th>
                            <th>
                                <input
                                    type="text"
                                    placeholder="Tìm mô tả"
                                    value={searchTerms.description}
                                    onChange={(e) => handleSearchChange('description', e.target.value)}
                                    className="search-input"
                                />
                            </th>
                            <th>
                                <input
                                    type="text"
                                    placeholder="Tìm danh mục"
                                    value={searchTerms.type}
                                    onChange={(e) => handleSearchChange('type', e.target.value)}
                                    className="search-input"
                                />
                            </th>
                            <th></th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredItems.map((item) => (
                            <tr key={item._id}>
                                <td>
                                    {item.imageURL ? (
                                        <img src={`http://localhost:4999${item.imageURL}`} alt={item.title} className="item-image" />
                                    ) : (
                                        'No Image'
                                    )}
                                </td>
                                <td>
                                    {editItemId === item._id ? (
                                        <input
                                            type="text"
                                            value={editData.title || ''}
                                            onChange={(e) => handleEditChange('title', e.target.value)}
                                        />
                                    ) : (
                                        item.title
                                    )}
                                </td>
                                <td>
                                    {editItemId === item._id ? (
                                        <input
                                            type="text"
                                            value={editData.description || ''}
                                            onChange={(e) => handleEditChange('description', e.target.value)}
                                        />
                                    ) : (
                                        item.description
                                    )}
                                </td>
                                <td>
                                    {editItemId === item._id ? (
                                        <input
                                            type="text"
                                            value={editData.type || ''}
                                            onChange={(e) => handleEditChange('type', e.target.value)}
                                        />
                                    ) : (
                                        item.type
                                    )}
                                </td>
                                <td>
                                    {editItemId === item._id ? (
                                        <input
                                            type="number"
                                            value={editData.price || 0}
                                            onChange={(e) => handleEditChange('price', parseFloat(e.target.value))}
                                        />
                                    ) : (
                                        `$${item.price.toFixed(2)}`
                                    )}
                                </td>
                                <td>
                                    {editItemId === item._id ? (
                                        <button onClick={() => handleSave(item._id)} className="save-btn">
                                            Save
                                        </button>
                                    ) : (
                                        <button onClick={() => handleEdit(item)} className="update-btn">
                                            Update
                                        </button>
                                    )}
                                    <button className="delete-btn" onClick={() => handleDelete(item._id)}>
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