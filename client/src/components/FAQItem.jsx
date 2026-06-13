import React, { useState } from 'react';
import './FAQItem.css';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="faq-item">
      <div className="faq-question" onClick={() => setIsOpen(!isOpen)}>
        <h3>{question}</h3>
        <span>{isOpen ? '-' : '+'}</span>
      </div>
      {isOpen && <div className="faq-answer"><p>{answer}</p></div>}
    </div>
  );
};

const FAQ = () => {
    const faqs = [
        {
            question: "What is Tuinue Wasichana?",
            answer: "Tuinue Wasichana is a platform dedicated to empowering girls through education by connecting donors with impactful charities."
        },
        {
            question: "How can I donate?",
            answer: "You can donate by visiting the Charities page, selecting a cause you care about, and clicking the 'Donate Now' button."
        },
        {
            question: "Is my donation secure?",
            answer: "Yes, we use industry-standard security measures to ensure that all donations are processed securely."
        },
        {
            question: "Can I apply for my charity to be listed?",
            answer: "Absolutely. You can fill out the application form on the 'Apply Charity' page to be considered for our platform."
        }
    ];

    return (
        <div className="faq-section">
            <h2>Frequently Asked Questions</h2>
            <div className="faq-list">
                {faqs.map((faq, index) => (
                    <FAQItem key={index} question={faq.question} answer={faq.answer} />
                ))}
            </div>
        </div>
    );
}


export default FAQ;
