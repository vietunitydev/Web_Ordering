import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import './AddItemPage.css';
import upload from '../../assets/upload.png';

const AddItemPage: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        price: '',
        image: null as File | null,
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData((prev) => ({
                ...prev,
                image: file,
            }));
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.description || !formData.category || !formData.price) {
            alert('Vui lòng nhập đầy đủ thông tin sản phẩm.');
            return;
        }
        // Logic lưu sản phẩm vào localStorage (giữ nguyên như cũ)
        const newItem = {
            id: Date.now(),
            name: formData.name,
            description: formData.description,
            category: formData.category,
            price: parseFloat(formData.price),
            image: formData.image ? URL.createObjectURL(formData.image) : null,
        };
        const items = localStorage.getItem('items');
        const itemList = items ? JSON.parse(items) : [];
        itemList.push(newItem);
        localStorage.setItem('items', JSON.stringify(itemList));
        alert('Sản phẩm đã được thêm thành công!');
        setFormData({ name: '', description: '', category: '', price: '', image: null });
        setImagePreview(null);
    };

    return (
        <AdminLayout activePage="add-item">
            <div className="add-item-page">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="image">Upload Image</label>
                        <div className="image-upload">
                            <input
                                type="file"
                                id="image"
                                name="image"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                            />
                            <label htmlFor="image" className="upload-label">
                                <img src={upload} alt="icon" />
                            </label>
                        </div>
                        {imagePreview && (
                            <div className="image-preview">
                                <img src={imagePreview} alt="Preview" />
                            </div>
                        )}
                    </div>
                    <div className="form-group">
                        <label htmlFor="name">Tên sản phẩm</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Mô tả sản phẩm</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="category">Danh mục sản phẩm</label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                            >
                                <option value="">Chọn danh mục</option>
                                <option value="Main">Món chính</option>
                                <option value="Dessert">Tráng miệng</option>
                                <option value="Drink">Đồ uống</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="price">Giá sản phẩm</label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <button type="submit" className="add-btn">
                        Thêm sản phẩm
                    </button>
                </form>
            </div>
        </AdminLayout>
    );
};

export default AddItemPage;