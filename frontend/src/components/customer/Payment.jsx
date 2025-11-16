import React, { useEffect, useState } from 'react';
import { placeOrder } from '../../services/orderService';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../styles/customer.css';
import api from '../../services/api';

export default function Payment() {
  const loc = useLocation();
  const navigate = useNavigate();
  const { items = [], totalAmount = 0 } = loc.state || {};
  const [method, setMethod] = useState('Card');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    try {
      await api.post('/payments/process', { items, paymentMethod: method, totalAmount });
      const order = await placeOrder({ items, paymentMethod: method });
      setSuccess(true);

      setTimeout(() => navigate('/orders'), 1800);
    } catch (err) {
      console.error(err);
      alert('Payment failed');
    } finally { setLoading(false); }
  };

  // ⭐ Go back home button
  const handleGoHome = () => {
    navigate('/home');
  };

  // ⭐ SUCCESS SCREEN UI
  if (success) {
    return (
      <div style={{ padding: 20 }}>
        <div className="payment-success">
          <div className="tick">✓</div>
          <h2>Payment Successful</h2>
          <p>Your order has been placed.</p>

          {/* ⭐ Go Home button on success */}
          <button
            onClick={handleGoHome}
            style={{
              marginTop: 20,
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              padding: '10px 18px',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 15,
            }}
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  // ⭐ NORMAL PAYMENT SCREEN UI
  return (
    <div style={{ padding: 20 }}>
      {/* ⭐ Go home button on top */}
      <button
        onClick={handleGoHome}
        style={{
          marginBottom: 15,
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: 6,
          cursor: 'pointer',
          fontSize: 15,
        }}
      >
        ← Back to Home
      </button>

      <h1>Payment</h1>
      <p>
        Amount: <strong>₹{totalAmount}</strong>
      </p>

      <div>
        <label>Select payment method:</label>
        <select value={method} onChange={(e) => setMethod(e.target.value)}>
          <option value="Card">Card</option>
          <option value="UPI">UPI</option>
          <option value="COD">COD</option>
        </select>
      </div>

      <div style={{ marginTop: 12 }}>
        <button onClick={handlePay} disabled={loading}>
          {loading ? 'Processing...' : 'Pay Now'}
        </button>
      </div>
    </div>
  );
}
