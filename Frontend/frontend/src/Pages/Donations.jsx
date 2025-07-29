import { useState } from 'react';
import Navbar from "../components/Navbar";
import Footer from '../components/Footer';
import './Donations.css';

const Donations = () => {
  // ... (keep all your existing state and functions) ...

  return (
    <>
      <Navbar />

      <div className="donation-page-container">
        <div className="donation-page-header">
          <h1>Make a Donation</h1>
          <p>Support Girls Sanitary Health Initiative and help girls stay in school</p>
        </div>

        <div className="donation-page-content">
          <div className="donation-page-form">
            <form onSubmit={handleDonationSubmit}>
              <div className="donation-form-section">
                <h2>Donation Type</h2>
                <div className="donation-type-options">
                  <label className={donationType === 'one-time' ? 'donation-option-active' : ''}>
                    <input 
                      type="radio" 
                      name="donationType" 
                      checked={donationType === 'one-time'}
                      onChange={() => setDonationType('one-time')}
                    />
                    One-time
                  </label>
                  <label className={donationType === 'monthly' ? 'donation-option-active' : ''}>
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
                  <div className="donation-monthly-amount">
                    <h3>Monthly Amount</h3>
                    <div className="donation-amount-options">
                      {[10, 20, 50, 100, 250].map(amount => (
                        <button
                          key={amount}
                          type="button"
                          className={monthlyAmount === amount ? 'donation-amount-selected' : 'donation-amount-option'}
                          onClick={() => setMonthlyAmount(amount)}
                        >
                          ${amount}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="donation-custom-amount">
                    <label>
                      Custom Amount ($)
                      <input 
                        type="number" 
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        placeholder="Enter amount"
                        min="1"
                        required
                        className="donation-custom-input"
                      />
                    </label>
                  </div>
                )}
              </div>

              <div className="donation-form-section">
                <h2>Payment Method</h2>
                <div className="donation-payment-methods">
                  <button 
                    type="button"
                    className={paymentMethod === 'mpesa' ? 'donation-payment-selected' : 'donation-payment-option'}
                    onClick={() => setPaymentMethod('mpesa')}
                  >
                    <img src="/mpesa-logo.png" alt="Mpesa" className="donation-payment-logo" />
                    Mpesa
                  </button>
                  <button 
                    type="button"
                    className={paymentMethod === 'paypal' ? 'donation-payment-selected' : 'donation-payment-option'}
                    onClick={() => setPaymentMethod('paypal')}
                  >
                    <img src="/paypal-logo.png" alt="PayPal" className="donation-payment-logo" />
                    PayPal
                  </button>
                  <button 
                    type="button"
                    className={paymentMethod === 'visa' ? 'donation-payment-selected' : 'donation-payment-option'}
                    onClick={() => setPaymentMethod('visa')}
                  >
                    <img src="/visa-logo.png" alt="Visa" className="donation-payment-logo" />
                    Card
                  </button>
                </div>

                {paymentMethod === 'mpesa' && (
                  <div className="donation-payment-fields">
                    <label className="donation-field-label">
                      Mpesa Phone Number
                      <div className="donation-input-with-prefix">
                        <span className="donation-input-prefix">+254</span>
                        <input 
                          type="tel" 
                          value={mpesaNumber}
                          onChange={(e) => setMpesaNumber(e.target.value.replace(/\D/g, ''))}
                          placeholder="712345678"
                          maxLength="9"
                          required
                          className="donation-mpesa-input"
                        />
                      </div>
                    </label>
                    <p className="donation-payment-hint">You'll receive an Mpesa prompt to complete the payment</p>
                  </div>
                )}

                {paymentMethod === 'paypal' && (
                  <div className="donation-payment-fields">
                    <label className="donation-field-label">
                      PayPal Email
                      <input 
                        type="email" 
                        value={paypalEmail}
                        onChange={(e) => setPaypalEmail(e.target.value)}
                        placeholder="your@paypal.com"
                        required
                        className="donation-paypal-input"
                      />
                    </label>
                    <p className="donation-payment-hint">You'll be redirected to PayPal to complete your payment</p>
                  </div>
                )}

                {paymentMethod === 'visa' && (
                  <div className="donation-payment-fields">
                    <label className="donation-field-label">
                      Card Number
                      <input 
                        type="text" 
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                        required
                        className="donation-card-input"
                      />
                    </label>
                    <div className="donation-card-details">
                      <label className="donation-field-label">
                        Expiry Date
                        <input 
                          type="text" 
                          value={expiryDate}
                          onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                          placeholder="MM/YY"
                          maxLength="5"
                          required
                          className="donation-expiry-input"
                        />
                      </label>
                      <label className="donation-field-label">
                        CVV
                        <input 
                          type="text" 
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                          placeholder="123"
                          maxLength="4"
                          required
                          className="donation-cvv-input"
                        />
                      </label>
                    </div>
                    <p className="donation-payment-hint">Your payment is secure and encrypted</p>
                  </div>
                )}
              </div>

              {!isAnonymous && (
                <>
                  <div className="donation-form-section">
                    <h2>Personal Information</h2>
                    <div className="donation-personal-info">
                      <label className="donation-field-label">
                        First Name
                        <input 
                          type="text" 
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                          className="donation-name-input"
                        />
                      </label>
                      <label className="donation-field-label">
                        Last Name
                        <input 
                          type="text" 
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required
                          className="donation-name-input"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="donation-form-section">
                    <h2>Email Address</h2>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="donation-email-input"
                    />
                  </div>
                </>
              )}

              <div className="donation-form-section">
                <label className="donation-anonymous-check">
                  <input 
                    type="checkbox" 
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="donation-anonymous-input"
                  />
                  Make this donation anonymous
                </label>
              </div>

              <button type="submit" className="donation-submit-button" disabled={!paymentMethod || (!monthlyAmount && !customAmount)}>
                Donate Now
              </button>
            </form>
          </div>

          <div className="donation-info-sidebar">
            <div className="donation-summary-box">
              <h3>Donation Summary</h3>
              {donationType && (
                <div className="donation-summary-item">
                  <span>Type:</span>
                  <span>{donationType === 'monthly' ? 'Monthly Donation' : 'One-time Donation'}</span>
                </div>
              )}
              {(monthlyAmount || customAmount) && (
                <div className="donation-summary-item">
                  <span>Amount:</span>
                  <span>${donationType === 'monthly' ? monthlyAmount : customAmount}</span>
                </div>
              )}
              {paymentMethod && (
                <div className="donation-summary-item">
                  <span>Payment Method:</span>
                  <span>
                    {paymentMethod === 'mpesa' ? 'Mpesa' : 
                     paymentMethod === 'paypal' ? 'PayPal' : 'Credit/Debit Card'}
                  </span>
                </div>
              )}
            </div>

            {impact && (
              <div className="donation-impact-section">
                <h3>Your Impact</h3>
                <p>Your donation of ${donationType === 'monthly' ? monthlyAmount : customAmount} can provide:</p>
                <ul className="donation-impact-list">
                  <li>Sanitary products for {impact.kitsProvided} {impact.kitsProvided === 1 ? 'girl' : 'girls'}</li>
                  <li>Menstrual health education for {impact.girlsHelped} girls</li>
                  {donationType === 'monthly' && (
                    <li>Continuous support for {impact.monthsCovered} months</li>
                  )}
                </ul>
              </div>
            )}

            <div className="donation-initiative-info">
              <h3>Girls Sanitary Health Initiative</h3>
              <p>Providing sanitary products and education to girls in rural Kenya.</p>
              
              <div className="donation-progress-container">
                <div className="donation-progress-text">
                  <strong>$12,500 raised</strong>
                  <span>of $20,000</span>
                </div>
                <div className="donation-progress-bar">
                  <div className="donation-progress" style={{ width: '62.5%' }}></div>
                </div>
              </div>

              <div className="donation-donors-count">
                <strong>107 donors</strong>
              </div>
            </div>

            <div className="donation-secure-info">
              <h3>Secure Donation</h3>
              <ul className="donation-secure-list">
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