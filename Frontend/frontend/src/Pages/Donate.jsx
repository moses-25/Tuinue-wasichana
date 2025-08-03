import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { donationAPI, charityAPI } from '../services/api';
import './Donate.css';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import visaLogo from '../assets/images/visa.svg';
import mpesaLogo from '../assets/images/mpesa.svg';
import paypalLogo from '../assets/images/paypal.svg';

const DonationPage = () => {
  const { isAuthenticated, user } = useAuth();
  const [charities, setCharities] = useState([]);
  const [selectedCharity, setSelectedCharity] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
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

  // Fetch charities on component mount
  useEffect(() => {
    const fetchCharities = async () => {
      try {
        const response = await charityAPI.getCharities();
        if (response.success && response.charities) {
          setCharities(response.charities);
        } else {
          // Fallback charities if API fails
          setCharities([
            {
              id: 1,
              name: "Girls Education Initiative",
              description: "Providing scholarships and school supplies for girls",
              category: "Education"
            },
            {
              id: 2,
              name: "Safe Spaces Foundation", 
              description: "Creating safe environments for at-risk girls",
              category: "Safety"
            },
            {
              id: 3,
              name: "Nutrition for Her",
              description: "Ensuring proper nutrition for girls' development",
              category: "Health"
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching charities:', error);
        // Set fallback charities
        setCharities([
          {
            id: 1,
            name: "Girls Education Initiative",
            description: "Providing scholarships and school supplies for girls",
            category: "Education"
          }
        ]);
      }
    };

    fetchCharities();

    // Handle pre-selected charity from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const charityId = urlParams.get('charity');
    if (charityId) {
      setSelectedCharity(charityId);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      alert('Please login to make a donation');
      return;
    }

    if (!selectedCharity) {
      alert('Please select a charity to donate to');
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      const donationAmount = parseFloat(amount || customAmount);
      
      if (!donationAmount || donationAmount <= 0) {
        alert('Please enter a valid donation amount');
        return;
      }

      const donationData = {
        charityId: parseInt(selectedCharity),
        amount: donationAmount,
        paymentMethod: paymentMethod,
        is_anonymous: isAnonymous,
        phoneNumber: paymentMethod === 'mpesa' ? formData.phone : undefined
      };

      let result;
      
      if (paymentMethod === 'mpesa') {
        // For M-Pesa, initiate STK push first
        result = await donationAPI.initiateMpesaPayment({
          phoneNumber: formData.phone,
          amount: donationAmount,
          charityId: parseInt(selectedCharity)
        });
        
        if (result.success) {
          alert('M-Pesa payment request sent to your phone. Please complete the payment.');
          // You might want to poll for payment status here
        }
      } else {
        // For other payment methods, process donation directly
        result = await donationAPI.makeDonation(donationData);
      }

      if (result.success) {
        setSuccess(true);
        // Reset form
        setAmount('25');
        setCustomAmount('');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          cardNumber: '',
          expiry: '',
          cvv: ''
        });
        
        alert('Thank you for your donation! Your contribution will make a difference.');
      } else {
        alert(result.error || 'Donation failed. Please try again.');
      }
    } catch (error) {
      console.error('Donation error:', error);
      alert('An error occurred while processing your donation. Please try again.');
    } finally {
      setLoading(false);
    }
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
          {/* Charity Selection */}
          <div className="donate-section">
            <h2 className="section-title">Select Charity</h2>
            <div className="form-group">
              <select
                value={selectedCharity}
                onChange={(e) => setSelectedCharity(e.target.value)}
                required
                className="charity-select"
              >
                <option value="">Choose a charity to support</option>
                {charities.map((charity) => (
                  <option key={charity.id} value={charity.id}>
                    {charity.name}
                  </option>
                ))}
              </select>
            </div>
            {selectedCharity && (
              <div className="selected-charity-info">
                {charities.find(c => c.id.toString() === selectedCharity)?.description}
              </div>
            )}
          </div>

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
                  <img src={visaLogo} alt="Visa" className="payment-logo" />
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
                  <img src={mpesaLogo} alt="M-Pesa" className="payment-logo mpesa-logo" />
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
                  <img src={paypalLogo} alt="PayPal" className="payment-logo" />
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
                <span className="paypal-icon"></span>
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
              <span>Secure Payment</span>
              <span>⇨ SSL Encrypted</span>
            </div>
            <button type="submit" className={`submit-btn ${loading ? 'loading' : ''}`} disabled={loading}>
              {loading ? 'Processing...' : `Donate $${amount || customAmount || '25'} Now`}
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