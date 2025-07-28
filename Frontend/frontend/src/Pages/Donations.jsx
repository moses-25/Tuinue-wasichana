

import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from "../components/Navbar";
import Footer from '../components/Footer';
import './Donations.css';

const Donations = () => {
  const [donationType, setDonationType] = useState('one-time');
  const [monthlyAmount, setMonthlyAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handleDonationSubmit = (e) => {
    e.preventDefault();
    // submiddion logic handling point
    console.log({
      donationType,
      amount: donationType === 'monthly' ? monthlyAmount : customAmount,
      paymentMethod,
      firstName,
      lastName,
      email,
      isAnonymous
    });
  };

  const renderPaymentFields = () => {
    switch(paymentMethod) {
      case 'mpesa':
        return (
          <div className="payment-fields">
            <label>
              Mpesa Phone Number
              <input type="tel" placeholder="e.g. 254712345678" required />
            </label>
          </div>
        );
      case 'paypal':
        return (
          <div className="payment-fields">
            <label>
              PayPal Email
              <input type="email" placeholder="your@paypal.com" required />
            </label>
          </div>
        );
      case 'visa':
        return (
          <div className="payment-fields">
            <label>
              Card Number
              <input type="text" placeholder="1234 5678 9012 3456" required />
            </label>
            <div className="card-details">
              <label>
                Expiry Date
                <input type="text" placeholder="MM/YY" required />
              </label>
              <label>
                CVV
                <input type="text" placeholder="123" required />
              </label>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Navbar />
      <div className="donation-container">
        <div className="donation-header">
          <h1>Make a Donation</h1>
          <p>Support Girls Sanitary Health Initiative and help girls stay in school</p>
        </div>

        <div className="donation-content">
          <div className="donation-form">
            <form onSubmit={handleDonationSubmit}>
              <div className="form-section">
                <h2>Donation Type</h2>
                <div className="donation-type">
                  <label className={donationType === 'one-time' ? 'active' : ''}>
                    <input 
                      type="radio" 
                      name="donationType" 
                      checked={donationType === 'one-time'}
                      onChange={() => setDonationType('one-time')}
                    />
                    One-time
                  </label>
                  <label className={donationType === 'monthly' ? 'active' : ''}>
                    <input 
                      type="radio" 
                      name="donationType" 
                      checked={donationType === 'monthly'}
                      onChange={() => setDonationType('monthly')}
                    />
                    Monthly
                  </label>
                </div>

                {donationType === 'monthly' ? (
                  <div className="monthly-amount">
                    <h3>Monthly Amount</h3>
                    <div className="amount-options">
                      {[10, 20, 50, 100, 250].map(amount => (
                        <button
                          key={amount}
                          type="button"
                          className={monthlyAmount === amount ? 'selected' : ''}
                          onClick={() => setMonthlyAmount(amount)}
                        >
                          ${amount}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="custom-amount">
                    <label>
                      Custom Amount ($)
                      <input 
                        type="number" 
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        placeholder="Enter amount"
                        required
                      />
                    </label>
                  </div>
                )}
              </div>

              <div className="form-section">
                <h2>Payment Method</h2>
                <div className="payment-methods">
                  <button 
                    type="button"
                    className={paymentMethod === 'mpesa' ? 'selected' : ''}
                    onClick={() => setPaymentMethod('mpesa')}
                  >
                    Mpesa
                  </button>
                  <button 
                    type="button"
                    className={paymentMethod === 'paypal' ? 'selected' : ''}
                    onClick={() => setPaymentMethod('paypal')}
                  >
                    PayPal
                  </button>
                  <button 
                    type="button"
                    className={paymentMethod === 'visa' ? 'selected' : ''}
                    onClick={() => setPaymentMethod('visa')}
                  >
                    Visa
                  </button>
                </div>
                {renderPaymentFields()}
              </div>

              <div className="form-section">
                <h2>Personal Information</h2>
                <div className="personal-info">
                  <label>
                    First Name
                    <input 
                      type="text" 
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required={!isAnonymous}
                    />
                  </label>
                  <label>
                    Last Name
                    <input 
                      type="text" 
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required={!isAnonymous}
                    />
                  </label>
                </div>
              </div>

              <div className="form-section">
                <h2>Email Address</h2>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required={!isAnonymous}
                  placeholder="your@email.com"
                />
                <label className="anonymous-check">
                  <input 
                    type="checkbox" 
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                  />
                  Make this donation anonymous
                </label>
              </div>

              <button type="submit" className="donate-button">
                Donate Now
              </button>
            </form>
          </div>

          <div className="donation-sidebar">
            <div className="impact-section">
              <h3>Your Impact</h3>
              <p>$25 per month can provide:</p>
              <ul>
                <li>Sanitary products for 1 girl for 3 months</li>
                <li>Menstrual health education for 10 girls</li>
              </ul>
            </div>

            <div className="initiative-info">
              <h3>Girls Sanitary Health Initiative</h3>
              <p>Providing sanitary products and education to girls in rural Kenya.</p>
              
              <div className="progress-container">
                <div className="progress-text">
                  <strong>$12,500 raised</strong>
                  <span>of $20,000</span>
                </div>
                <div className="progress-bar">
                  <div className="progress" style={{ width: '62.5%' }}></div>
                </div>
              </div>

              <div className="donors-count">
                <strong>107 donors</strong>
              </div>
            </div>

            <div className="secure-info">
              <h3>Secure Donation</h3>
              <ul>
                <li>Your payment information is encrypted and secure</li>
                <li>100% of your donation goes to the charity</li>
                <li>You'll receive a tax-deductible receipt</li>
                <li>Cancel recurring donations anytime</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Donations;