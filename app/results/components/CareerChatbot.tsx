'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';
import { getGeminiResponse } from '@/app/utils/gemini';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function CareerChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      role: 'assistant', 
      content: 'Hi! I\'m your career guidance assistant. Ask me any questions about careers, education, or job prospects in India.' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Get AI response
      let response = '';
      
      try {
        response = await getGeminiResponse(
          `You are a career guidance assistant specializing in Indian education and job market. 
           Answer the following career-related question concisely but helpfully:
           "${input}"
           
           Focus on Indian context - education pathways, job prospects, and career opportunities in India.
           If the question is not related to careers or education, politely redirect to career topics.
           Keep your response under 150 words and conversational in tone.`
        );
        setApiError(false);
      } catch (error) {
        console.error('Error getting AI response:', error);
        setApiError(true);
        
        // Provide more helpful fallback responses based on input keywords
        const inputLower = input.toLowerCase();
        
        if (inputLower.includes('engineering') || inputLower.includes('computer') || inputLower.includes('software')) {
          response = "Engineering, especially in IT/Computer Science, remains one of India's strongest career paths. Top institutions like IITs and NITs offer excellent programs. The average starting salary ranges from ₹4-12 LPA, with experienced professionals earning ₹20-50+ LPA. Consider specializing in emerging areas like AI, data science, or cloud computing for better prospects.";
        }
        else if (inputLower.includes('medicine') || inputLower.includes('doctor') || inputLower.includes('medical')) {
          response = "Medicine is a prestigious career in India requiring NEET for MBBS admission (5.5 years), followed by optional specialization. Government college fees are affordable (₹25,000-1L/year) while private colleges charge ₹5-25L/year. Doctors earn ₹8-15L initially, increasing significantly with specialization and experience. The profession offers job security but demands commitment to continuous learning.";
        }
        else if (inputLower.includes('mba') || inputLower.includes('business') || inputLower.includes('management')) {
          response = "MBA remains popular in India, with top institutes like IIMs offering excellent ROI. Admission requires CAT/XAT/GMAT scores. Fees range from ₹10-25L for 2 years at premier institutes. Graduates earn ₹10-30L initially, with specializations in Finance, Marketing, and Operations being traditional strongholds, while Product Management, Data Analytics, and Digital Marketing are emerging areas with strong growth potential.";
        }
        else {
          response = "I'm sorry, I couldn't process your request at the moment. Please try asking about popular career paths in India like Engineering, Medicine, MBA, Law, Civil Services, or Data Science. Or you can ask about specific qualifications, salary expectations, or growth opportunities in various fields.";
        }
      }
      
      // Add assistant message
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error in chat flow:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I encountered an error processing your request. Please try again with a different question about careers or education in India."
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="fixed bottom-6 right-6 bg-primary-600 text-white p-4 rounded-full shadow-lg hover:bg-primary-700 transition-all z-40"
        aria-label="Open chat"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
          </svg>
        )}
      </button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-2rem)] bg-white dark:bg-dark-200 rounded-lg shadow-xl z-40 flex flex-col"
            style={{ height: '500px', maxHeight: 'calc(100vh - 120px)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                Career Assistant
                {apiError && (
                  <span className="ml-2 inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
                    Offline Mode
                  </span>
                )}
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto">
              {messages.map((message) => (
                <div 
                  key={message.id}
                  className={`mb-4 ${message.role === 'user' ? 'ml-auto' : 'mr-auto'} max-w-[80%]`}
                >
                  <div 
                    className={`p-3 rounded-lg ${
                      message.role === 'user' 
                        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-900 dark:text-primary-100 rounded-tr-none' 
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-tl-none'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="mb-4 mr-auto max-w-[80%]">
                  <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800 rounded-tl-none">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Ask about careers, education..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isLoading}
                  className="form-input flex-1"
                />
                <Button 
                  type="submit" 
                  variant="primary" 
                  disabled={isLoading || !input.trim()}
                  aria-label="Send message"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 