import React, { useEffect, useState } from 'react';
import { getMyOrders } from '../../services/orderService';
import { useNavigate } from 'react-router-dom';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const data = await getMyOrders();
        console.log('Orders:', data);
        setOrders(data);
      } catch (err) {
        console.error('Error loading orders:', err);
      }
    })();
  }, []);

  const handleBackHome = () => navigate('/home'); // 🏠 Go Home

  return (
    <div style={{ padding: 20 }}>
      <h1>My Orders</h1>

      <button onClick={handleBackHome} style={{
        marginBottom: 12,
        backgroundColor: '#ddd',
        border: 'none',
        padding: '8px 14px',
        borderRadius: 6,
        cursor: 'pointer'
      }}>
        ← Back to Home
      </button>

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div>
          {orders.map(o => (
            <div key={o._id} style={{
              background: '#fff',
              marginBottom: 12,
              padding: 12,
              borderRadius: 8,
              boxShadow: '0 0 5px rgba(0,0,0,0.1)'
            }}>
              <h3>Order #{o._id}</h3>
              <p>Amount: ₹{o.totalAmount}</p>
              <p>Payment: {o.paymentMethod} / {o.paymentStatus}</p>
              <p>Status: {o.status}</p>
              <ul>
                {o.items.map(it => (
                  <li key={it.product._id}>
                    {it.product.name} × {it.quantity} — ₹{it.price}
                  </li>
                ))}
              </ul>
              <small>Placed: {new Date(o.createdAt).toLocaleString()}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
