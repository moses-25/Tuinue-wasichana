import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Donate.css';

const DonationPage = () => {
  const [donationType, setDonationType] = useState('one-time');
  const [amount, setAmount] = useState('25'); // Default to $25
  const [customAmount, setCustomAmount] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
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
              <li>Sanitary products for {Math.floor(amount/25) || 1} girl(s) for {Math.floor(amount/8.33) || 3} months</li>
              <li>Menstrual health education for {Math.floor(amount/2.5) || 10} girls</li>
            </ul>
          </div>

          {/* Personal Information */}
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

          {/* Payment Information */}
          <div className="donate-section">
            <h2 className="section-title">Payment Information</h2>
            <div className="form-group">
              <label>Card Number</label>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                placeholder="1234 5678 9012 3456"
                required
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
                  required
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
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit Section */}
          <div className="submit-section">
            <div className="security-badges">
              <span>Secure Payment</span>
              <span>⇨ SSL Encrypted</span>
            </div>
            <button type="submit" className="submit-btn">
              Donate  Now
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