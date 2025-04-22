import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Mail, Phone, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Support() {
  const [activeIndex, setActiveIndex] = useState(null);
  const navigate = useNavigate();

  const faqs = [
    {
      question: "How do I place an order?",
      answer:
        "You can place an order by browsing our products, adding them to your cart, and proceeding to checkout.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept UPI, credit/debit cards, net banking, and cash on delivery.",
    },
    {
      question: "How can I track my order?",
      answer:
        "You can track your order in the 'Order History' section of your profile.",
    },
    {
      question: "Can I cancel or modify my order?",
      answer:
        "Yes, you can cancel or modify your order within 15 minutes of placing it through your order dashboard.",
    },
  ];

  const toggleFAQ = (index) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">Support</h1>

      <section className="mb-8 sm:mb-10">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Frequently Asked Questions</h2>
        <div className="space-y-3 sm:space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border rounded-lg sm:rounded-xl p-3 sm:p-4 bg-white shadow-sm cursor-pointer"
              onClick={() => toggleFAQ(index)}
            >
              <div className="flex justify-between items-center">
                <p className="font-medium text-gray-800 text-sm sm:text-base">{faq.question}</p>
                {activeIndex === index ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
              {activeIndex === index && (
                <p className="text-gray-600 mt-2 text-xs sm:text-sm">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-blue-50 p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Contact Us</h2>
        <ul className="space-y-2 sm:space-y-3 text-gray-700 text-sm sm:text-base">
          <li className="flex items-center gap-2">
            <MessageSquare className="text-orange-600" size={16} />
            <button
              onClick={() => navigate('/contact')}
              className="hover:underline text-orange-700"
            >
              Start Chat
            </button>
          </li>
          <li className="flex items-center gap-2">
            <Phone className="text-orange-600" size={16} />
            <a href="tel:+91-9876543210" className="hover:underline">
              +91-9876543210
            </a>
          </li>
          <li className="flex items-center gap-2">
            <Mail className="text-orange-600" size={16} />
            <a href="mailto:support@mediquik.com" className="hover:underline">
              support@mediquik.com
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}

export default Support;