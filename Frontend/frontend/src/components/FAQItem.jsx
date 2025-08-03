import { useState } from 'react';
import { Link } from 'react-router-dom';
import './FAQItem.css';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "How do I create an account?",
      answer: (
        <>
          Click <Link to="/reg" className="faq-link">Register Here</Link> button on the login page 
          and fill in your details to create an account.
        </>
      )
    },
    {
      question: "What if I forget my password?",
      answer: (
        <>
          Click on <Link to="/forgot-password" className="faq-link">Forgot Password</Link> on the 
          login page and follow the instructions to reset your password.
        </>
      )
    },
    {
      question: "How can I support the Tuinue Wasichana project?",
      answer: (
        <>
          You can support us through <Link to="/charity" className="faq-link">donations</Link> or spreading awareness 
          about our Organisation.
          <div className="faq-cta">
            Ready to help? <Link to="/charity" className="faq-link cta-link">Donate here!</Link>
          </div>
        </>
      )
    },
    {
      question: "Are there any age restrictions for participants?",
      answer: "Our programs are designed for girls aged 0-25, but we have some initiatives for other older ages too."
    },
    {
      question: "How do I contact your support team?",
      answer: (
        <>
          You can reach us through the <Link to="/cont" className="faq-link">contact form</Link> 
          on our website or email us at support@tuinuewasichana.org
        </>
      )
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      <h2 className="faq-title">Frequently Asked Questions</h2>
      <div className="faq-list">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className={`faq-item ${activeIndex === index ? 'active' : ''}`}
          >
            <div 
              className="faq-question" 
              onClick={() => toggleFAQ(index)}
            >
              <h3>{faq.question}</h3>
              <span className="faq-toggle">
                {activeIndex === index ? '−' : '+'}
              </span>
            </div>
            <div className="faq-answer">
              <div>{faq.answer}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;