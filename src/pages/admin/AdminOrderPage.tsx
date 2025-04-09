import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import './AdminOrdersPage.css';
import {OrderItem} from "../../shared/types.ts";

const AdminOrdersPage: React.FC = () => {
    const [orders, setOrders] = useState<OrderItem[]>([]);
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrderHistory = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Không có token. Vui lòng đăng nhập lại.');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch('http://localhost:4999/api/orders/all', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch orders');
                }

                const data = await response.json();
                console.log(data);
                const formattedOrders: OrderItem[] = data.orders.map((order: any) => ({
                    _id: order._id.toString(),
                    userId: order.userId.toString(),
                    name: order.name,
                    address: order.address,
                    email: order.email,
                    phone: order.phone,
                    status: order.status,
                    shippingFee: order.shippingFee,
                    totalAmount: order.totalAmount,
                    payment: order.payment,
                    paymentMethod: order.paymentMethod,
                    discount: order.discount,
                    items: order.items.map((item: any) => ({
                        foodItem: item.foodItemId,
                        quantity: item.quantity,
                    })),
                    createdAt: new Date(order.createdAt),
                    updatedAt: new Date(order.updatedAt),
                }));

                setOrders(formattedOrders);
            } catch (err) {
                console.error('Error fetching order history:', err);
                setError('Không thể tải lịch sử đơn hàng. Vui lòng thử lại.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrderHistory();
    }, []);

    const handleUpdateStatus = (id: string, newStatus: string) => {
        const updatedOrders = orders.map((order) =>
            order._id === id ? { ...order, status: newStatus as OrderItem['status'] } : order
        );
        setOrders(updatedOrders);
        // Gọi API để cập nhật status trên server (nếu cần)
        // Ví dụ: await axios.put(`http://localhost:4999/api/orders/${id}/status`, { status: newStatus }, { headers: { Authorization: `Bearer ${token}` } });
    };

    const toggleOrderDetails = (id: string) => {
        setExpandedOrderId(expandedOrderId === id ? null : id);
    };

    if (loading) {
        return (
            <AdminLayout activePage="orders">
                <div className="admin-orders-page">Đang tải...</div>
            </AdminLayout>
        );
    }

    if (error) {
        return (
            <AdminLayout activePage="orders">
                <div className="admin-orders-page">
                    <p className="error-message">{error}</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout activePage="orders">
            <div className="admin-orders-page">
                <h2>Order Page</h2>
                {orders.length === 0 ? (
                    <p className="no-orders">Chưa có đơn hàng nào.</p>
                ) : (
                    <table className="orders-table">
                        <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Date</th>
                            <th>Customer</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Action</th>
                            <th>Details</th>
                        </tr>
                        </thead>
                        <tbody>
                        {orders.map((order) => (
                            <React.Fragment key={order._id}>
                                <tr>
                                    <td>#{order._id}</td>
                                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td>{order.name}</td>
                                    <td>${order.payment.toFixed(2)}</td>
                                    <td>{order.status}</td>
                                    <td>
                                        <select value={order.status} onChange={(e) => handleUpdateStatus(order._id, e.target.value)}>
                                            <option value="pending">Đang chờ</option>
                                            <option value="processing">Đang xử lý</option>
                                            <option value="shipped">Đang giao</option>
                                            <option value="delivered">Hoàn thành</option>
                                            <option value="cancelled">Đã hủy</option>
                                        </select>
                                    </td>
                                    <td>
                                        <button onClick={() => toggleOrderDetails(order._id)} className="details-btn">
                                            {expandedOrderId === order._id ? 'Ẩn chi tiết' : 'Xem chi tiết'}
                                        </button>
                                    </td>
                                </tr>
                                {expandedOrderId === order._id && (
                                    <tr className="order-details-row">
                                        <td colSpan={7}>
                                            <div className="order-details">
                                                <h4>Chi tiết đơn hàng</h4>
                                                <table className="order-items-table">
                                                    <thead>
                                                    <tr>
                                                        <th>Tên sản phẩm</th>
                                                        <th>Giá</th>
                                                        <th>Số lượng</th>
                                                        <th>Tổng</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {order.items.map((item) => (
                                                        <tr key={item.foodItem._id}>
                                                            <td>{item.foodItem.title || 'Unknown'}</td>
                                                            <td>${item.foodItem.price?.toFixed(2) || '0.00'}</td>
                                                            <td>{item.quantity}</td>
                                                            <td>${((item.foodItem.price || 0) * item.quantity).toFixed(2)}</td>
                                                        </tr>
                                                    ))}
                                                    </tbody>
                                                </table>
                                                <div className="delivery-info">
                                                    <h4>Thông tin giao hàng</h4>
                                                    <p>Email: {order.email || 'N/A'}</p>
                                                    <p>Địa chỉ: {order.address}</p>
                                                    <p>Số điện thoại: {order.phone || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminOrdersPage;