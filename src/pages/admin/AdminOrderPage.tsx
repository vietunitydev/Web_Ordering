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
                        </tr>
                        </thead>
                        <tbody>
                        {orders.map((order) => (
                            <tr key={order.id}>
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
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminOrdersPage;