import React, { useState } from 'react';
// import { useAuth } from '../contexts/AuthContext'; // Not used in this component
import './PaymentModal.css';

const PaymentModal = ({ isOpen, onClose, bookingDetails, onPaymentSuccess }) => {
  // const { user } = useAuth(); // Not used in this component
  const [selectedPayment, setSelectedPayment] = useState('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('pending');

  const handlePayment = async () => {
    if (!bookingDetails) return;

    setIsProcessing(true);
    setPaymentStatus('processing');

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success alert based on selected payment method
      if (selectedPayment === 'razorpay') {
        alert('Payment Successful via Razorpay! Thank you for your booking.');
      } else if (selectedPayment === 'wallet') {
        alert('Payment Successful via Digital Wallet! Thank you for your booking.');
      } else {
        alert('Payment Successful! Thank you for your booking.');
      }
      
      // Close modal and trigger success callback
      onPaymentSuccess();
      onClose();
      setPaymentStatus('pending');
      setIsProcessing(false);
      
    } catch (error) {
      setPaymentStatus('failed');
      setIsProcessing(false);
      console.error('Payment failed:', error);
    }
  };

  const calculateTotal = () => {
    if (!bookingDetails) return 0;
    const basePrice = bookingDetails.price || 0;
    const tax = basePrice * 0.18; // 18% GST
    return basePrice + tax;
  };

  if (!isOpen) return null;

  return (
    <div className="payment-modal">
      <div className="payment-modal-content">
        <div className="payment-modal-header">
          <h3>Complete Your Booking</h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        {bookingDetails && (
          <>
            <div className="booking-details">
              <h4>Booking Details</h4>
              <p><strong>Place:</strong> {bookingDetails.name}</p>
              <p><strong>Type:</strong> {bookingDetails.type}</p>
              <p><strong>Date:</strong> {bookingDetails.date || 'Today'}</p>
              <p><strong>Duration:</strong> {bookingDetails.duration || '1 Day'}</p>
            </div>

            <div className="payment-options">
              <h4>Payment Options</h4>
              <label className={`payment-option ${selectedPayment === 'razorpay' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  value="razorpay"
                  checked={selectedPayment === 'razorpay'}
                  onChange={(e) => setSelectedPayment(e.target.value)}
                />
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBLlFEtwg5TN0kHmJ299cqrBfK4hbNd3Dhkw&s" alt="Razorpay" />
                <span>Razorpay</span>
              </label>
              
              <label className={`payment-option ${selectedPayment === 'wallet' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  value="wallet"
                  checked={selectedPayment === 'wallet'}
                  onChange={(e) => setSelectedPayment(e.target.value)}
                />
                <img src="https://static.vecteezy.com/system/resources/thumbnails/019/787/046/small_2x/wallet-icon-on-transparent-background-free-png.png" alt="Wallet" />
                <span>Digital Wallet</span>
              </label>
            </div>

            <div className="payment-summary">
              <h4>Payment Summary</h4>
              <div className="summary-row">
                <span>Base Price:</span>
                <span>₹{bookingDetails.price || 0}</span>
              </div>
              <div className="summary-row">
                <span>GST (18%):</span>
                <span>₹{(bookingDetails.price * 0.18 || 0).toFixed(2)}</span>
              </div>
              <div className="summary-row total-row">
                <span>Total Amount:</span>
                <span>₹{calculateTotal().toFixed(2)}</span>
              </div>
            </div>

            <button
              className="pay-btn"
              onClick={handlePayment}
              disabled={isProcessing || paymentStatus === 'processing'}
            >
              {paymentStatus === 'processing' && (
                <>
                  <span className="loading-spinner"></span>
                  Processing Payment...
                </>
              )}
              {paymentStatus === 'success' && (
                <>
                  <span className="success-checkmark"></span>
                  Payment Successful!
                </>
              )}
              {paymentStatus === 'failed' && 'Payment Failed - Try Again'}
              {paymentStatus === 'pending' && 'Pay ₹' + calculateTotal().toFixed(2)}
            </button>

            {paymentStatus === 'failed' && (
              <p style={{ color: '#ff4757', textAlign: 'center', marginTop: '1rem' }}>
                Payment failed. Please try again or use a different payment method.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;