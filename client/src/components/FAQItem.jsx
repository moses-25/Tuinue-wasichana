import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './FAQItem.css';

const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className={`faq-item-modern ${isOpen ? 'faq-open' : ''}`}>
      <div className="faq-question-modern" onClick={onClick}>
        <h3>{question}</h3>
        <button className="faq-toggle-btn" aria-label="Toggle answer">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="2"/>
            <line x1="12" y1="7" x2="12" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="7" y1="12" x2="17" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
      {isOpen && (
        <div className="faq-answer-modern">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            question: "What is Tuinue Wasichana?",
            answer: "Tuinue Wasichana is a platform dedicated to empowering girls through education by connecting donors with impactful charities. We work with verified organizations across Kenya to ensure every donation creates lasting change in girls' lives."
        },
        {
            question: "How can I donate?",
            answer: "You can donate by visiting the Charities page, selecting a cause you care about, and clicking the 'Donate Now' button. We accept multiple payment methods including M-Pesa, credit cards, and PayPal for your convenience."
        },
        {
            question: "Is my donation secure?",
            answer: "Yes, we use industry-standard security measures to ensure that all donations are processed securely. Our platform is PCI-DSS compliant and all transactions are encrypted. You can donate with complete confidence."
        },
        {
            question: "Can I apply for my charity to be listed?",
            answer: "Absolutely. You can fill out the application form on the 'Apply Charity' page to be considered for our platform. We review all applications to ensure organizations meet our standards for transparency and impact."
        },
        {
            question: "How do I track my donation impact?",
            answer: "Once you donate, you'll receive regular updates through your donor dashboard showing exactly how your contribution is making a difference. You'll see stories, photos, and progress reports from the girls and communities you're helping."
        },
        {
            question: "What percentage of my donation goes to the cause?",
            answer: "We take only a small 5% platform fee to maintain our services. The remaining 95% goes directly to the charity you choose. We believe in maximum transparency and efficiency in helping girls achieve their dreams."
        }
    ];

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="faq-section-modern">
            <div className="faq-container">
                <div className="faq-list-modern">
                    {faqs.map((faq, index) => (
                        <FAQItem 
                            key={index} 
                            question={faq.question} 
                            answer={faq.answer}
                            isOpen={openIndex === index}
                            onClick={() => toggleFAQ(index)}
                        />
                    ))}
                </div>

                <div className="faq-cta-section">
                    <h2 className="faq-cta-title">Still Have any Question?</h2>
                    <Link to="/contact" className="faq-cta-button">
                        Contact us Now
                    </Link>
                </div>
            </div>
        </div>
    );
}


export default FAQ;
