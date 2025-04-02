import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import './AdminOrdersPage.css';

interface OrderItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

interface Order {
    id: number;
    date: string;
    items: OrderItem[];
    subtotal: number;
    deliveryFee: number;
    total: number;
    status: string;
    deliveryInfo: {
        firstName: string;
        lastName: string;
        email: string;
        address: string;
        phone: string;
    };
}

const AdminOrdersPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

    useEffect(() => {
        const orderHistory = localStorage.getItem('orderHistory');
        if (orderHistory) {
            setOrders(JSON.parse(orderHistory));
        }
    }, []);

    const handleUpdateStatus = (id: number, newStatus: string) => {
        const updatedOrders = orders.map((order) =>
            order.id === id ? { ...order, status: newStatus } : order
        );
        setOrders(updatedOrders);
        localStorage.setItem('orderHistory', JSON.stringify(updatedOrders));
    };

    const toggleOrderDetails = (id: number) => {
        setExpandedOrderId(expandedOrderId === id ? null : id);
    };

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
                            <React.Fragment key={order.id}>
                                <tr>
                                    <td>#{order.id}</td>
                                    <td>{order.date}</td>
                                    <td>{order.deliveryInfo.firstName} {order.deliveryInfo.lastName}</td>
                                    <td>${order.total.toFixed(2)}</td>
                                    <td>{order.status}</td>
                                    <td>
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                                        >
                                            <option value="Đang xử lý">Đang xử lý</option>
                                            <option value="Đang giao">Đang giao</option>
                                            <option value="Hoàn thành">Hoàn thành</option>
                                        </select>
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => toggleOrderDetails(order.id)}
                                            className="details-btn"
                                        >
                                            {expandedOrderId === order.id ? 'Ẩn chi tiết' : 'Xem chi tiết'}
                                        </button>
                                    </td>
                                </tr>
                                {expandedOrderId === order.id && (
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
                                                        <tr key={item.id}>
                                                            <td>{item.name}</td>
                                                            <td>${item.price.toFixed(2)}</td>
                                                            <td>{item.quantity}</td>
                                                            <td>${(item.price * item.quantity).toFixed(2)}</td>
                                                        </tr>
                                                    ))}
                                                    </tbody>
                                                </table>
                                                <div className="delivery-info">
                                                    <h4>Thông tin giao hàng</h4>
                                                    <p>Email: {order.deliveryInfo.email}</p>
                                                    <p>Địa chỉ: {order.deliveryInfo.address}</p>
                                                    <p>Số điện thoại: {order.deliveryInfo.phone}</p>
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