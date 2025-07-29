import React, { useState } from 'react';
import './Donate.css';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const DonationPage = () => {
  const [donationType, setDonationType] = useState('one-time');
  const [amount, setAmount] = useState('25');
  const [customAmount, setCustomAmount] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('visa');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  const handleAmountClick = (value) => {
    setAmount(value);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e) => {
    setCustomAmount(e.target.value);
    setAmount('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const donationData = {
      type: donationType,
      amount: amount || customAmount,
      isAnonymous,
      paymentMethod,
      ...formData
    };
    console.log('Donation submitted:', donationData);
    // Add your donation processing logic here
  };

  return (
    <>
    <Navbar />

    <div className="donate-container">
      <div className="donate-card">
        <div className="donate-header">
          <h1>Make a Donation</h1>
          <p className="donate-subtitle">
            Support Girls Sanitary Health Initiative and help girls stay in school
          </p>
        </div>

        <form className="donate-form" onSubmit={handleSubmit}>
          {/* Donation Type */}
          <div className="donate-section">
            <h2 className="section-title">Donation Type</h2>
            <div className="type-toggle">
              <button
                type="button"
                className={`toggle-option ${donationType === 'one-time' ? 'active' : ''}`}
                onClick={() => setDonationType('one-time')}
              >
                One-time
              </button>
              <button
                type="button"
                className={`toggle-option ${donationType === 'monthly' ? 'active' : ''}`}
                onClick={() => setDonationType('monthly')}
              >
                Monthly
              </button>
            </div>
          </div>

          {/* Donation Amount */}
          <div className="donate-section">
            <h2 className="section-title">Donation Amount</h2>
            <div className="amount-grid">
              {[10, 25, 50, 100, 250].map((value) => (
                <button
                  key={value}
                  type="button"
                  className={`amount-option ${amount === value.toString() ? 'active' : ''}`}
                  onClick={() => handleAmountClick(value.toString())}
                >
                  ${value}
                </button>
              ))}
              <div className="custom-amount">
                <input
                  type="number"
                  placeholder="Other amount"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  onFocus={() => setAmount('')}
                />
              </div>
            </div>
          </div>

          {/* Impact Section */}
          <div className="impact-section">
            <h3>Your Impact</h3>
            <p className="impact-text">${amount || 25} can provide:</p>
            <ul className="impact-list">
              <li>Sanitary products for {Math.floor((amount || 25)/25) || 1} girl(s) for {Math.floor((amount || 25)/8.33) || 3} months</li>
              <li>Menstrual health education for {Math.floor((amount || 25)/2.5) || 10} girls</li>
            </ul>
          </div>

          {/* Personal Information - Hidden when anonymous */}
          {!isAnonymous && (
            <div className="donate-section">
              <h2 className="section-title">Personal Information</h2>
              <div className="form-row">
                <div className="form-group half-width">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required={!isAnonymous}
                  />
                </div>
                <div className="form-group half-width">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required={!isAnonymous}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required={!isAnonymous}
                />
              </div>
            </div>
          )}

          {/* Anonymous Toggle */}
          <div className="donate-section">
            <div className="anonymous-toggle">
              <input
                type="checkbox"
                id="anonymous"
                checked={isAnonymous}
                onChange={() => setIsAnonymous(!isAnonymous)}
              />
              <label htmlFor="anonymous">Make this donation anonymous</label>
            </div>
          </div>

          {/* Payment Method */}
          <div className="donate-section">
            <h2 className="section-title">Payment Method</h2>
            <div className="payment-methods">
              <div className="payment-option">
                <input
                  type="radio"
                  id="visa"
                  name="paymentMethod"
                  checked={paymentMethod === 'visa'}
                  onChange={() => setPaymentMethod('visa')}
                />
                <label htmlFor="visa" className="payment-label">
                  <span className="payment-icon">💳</span>
                  <span>Credit/Debit Card</span>
                </label>
              </div>
              <div className="payment-option">
                <input
                  type="radio"
                  id="mpesa"
                  name="paymentMethod"
                  checked={paymentMethod === 'mpesa'}
                  onChange={() => setPaymentMethod('mpesa')}
                />
                <label htmlFor="mpesa" className="payment-label">
                  <span className="payment-icon">📱</span>
                  <span>M-Pesa</span>
                </label>
              </div>
              <div className="payment-option">
                <input
                  type="radio"
                  id="paypal"
                  name="paymentMethod"
                  checked={paymentMethod === 'paypal'}
                  onChange={() => setPaymentMethod('paypal')}
                />
                <label htmlFor="paypal" className="payment-label">
                  <span className="payment-icon">🔵</span>
                  <span>PayPal</span>
                </label>
              </div>
            </div>
          </div>

          {/* Payment Details - Dynamic based on selection */}
          {paymentMethod === 'visa' && (
            <div className="donate-section">
              <div className="form-group">
                <label>Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  placeholder="1234 5678 9012 3456"
                  required={paymentMethod === 'visa'}
                />
              </div>
              <div className="form-row">
                <div className="form-group half-width">
                  <label>Expiry Date</label>
                  <input
                    type="text"
                    name="expiry"
                    value={formData.expiry}
                    onChange={handleInputChange}
                    placeholder="MM/YY"
                    required={paymentMethod === 'visa'}
                  />
                </div>
                <div className="form-group half-width">
                  <label>CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    placeholder="123"
                    required={paymentMethod === 'visa'}
                  />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'mpesa' && (
            <div className="donate-section">
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="e.g. 254712345678"
                  required={paymentMethod === 'mpesa'}
                />
              </div>
              <p className="payment-note">
                You'll receive a payment request on your phone via M-Pesa
              </p>
            </div>
          )}

          {paymentMethod === 'paypal' && (
            <div className="donate-section">
              <button type="button" className="paypal-button">
                <span className="paypal-icon">🔵</span>
                Continue with PayPal
              </button>
              <p className="payment-note">
                You'll be redirected to PayPal to complete your donation
              </p>
            </div>
          )}

          {/* Submit Section */}
          <div className="submit-section">
            <div className="security-badges">
              <span>🔒 Secure Payment</span>
              <span>⇨ SSL Encrypted</span>
            </div>
            <button type="submit" className="submit-btn">
              Donate ${amount || customAmount || '25'} Now
            </button>
          </div>
        </form>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default DonationPage;