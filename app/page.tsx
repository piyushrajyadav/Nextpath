'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Button from './results/components/Button';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50 dark:from-dark-200 dark:to-dark-300 pt-16 md:pt-20 lg:pt-32 pb-20 md:pb-24 lg:pb-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Find Your <span className="text-primary-600 dark:text-primary-400">Perfect Career</span> Path
            </motion.h1>
            
            <motion.p 
              className="mt-6 text-xl text-gray-600 dark:text-gray-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Discover personalized career recommendations based on your qualifications, interests, and goals. Let AI guide you to a successful future.
            </motion.p>
            
            <motion.div 
              className="mt-10 flex flex-col sm:flex-row justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link href="/user/assessment">
                <Button 
                  variant="primary" 
                  size="lg"
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                    </svg>
                  }
                  iconPosition="right"
                >
                  Start Career Assessment
                </Button>
              </Link>
              
              <Link href="/careers">
                <Button 
                  variant="outline" 
                  size="lg"
                >
                  Explore Careers
                </Button>
              </Link>
            </motion.div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-40 h-40 lg:w-64 lg:h-64 bg-primary-100 dark:bg-primary-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 right-0 w-40 h-40 lg:w-64 lg:h-64 bg-secondary-100 dark:bg-secondary-900/30 rounded-full mix-blend-multiply dark:mix-blend-lighten blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-40 h-40 lg:w-64 lg:h-64 bg-pink-100 dark:bg-pink-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-dark-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              How NextPath Works
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our AI-powered platform analyzes your profile to provide personalized career guidance tailored to your unique circumstances.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <motion.div 
              className="card flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="p-3 mb-4 bg-primary-50 dark:bg-primary-900/30 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-primary-600 dark:text-primary-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Complete Your Profile</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Fill out our interactive form with your education, skills, interests, and financial details to help us understand your background.
              </p>
            </motion.div>
            
            {/* Feature 2 */}
            <motion.div 
              className="card flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="p-3 mb-4 bg-secondary-50 dark:bg-secondary-900/30 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-secondary-600 dark:text-secondary-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">AI-Powered Analysis</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our advanced AI uses the Gemini API to analyze your data and generate personalized career recommendations that match your profile.
              </p>
            </motion.div>
            
            {/* Feature 3 */}
            <motion.div 
              className="card flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="p-3 mb-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-yellow-600 dark:text-yellow-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Personalized Roadmap</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Receive detailed guidance including education paths, skill development resources, and financial aid options for your chosen careers.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-dark-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Success Stories
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              See how our platform has helped students and job seekers find their perfect career paths.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <motion.div 
              className="card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-r from-primary-500 to-secondary-500 w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold">RK</div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Shivam Kundu</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Engineering Graduate</p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                "CareerGuide helped me discover that my skills were perfect for a career in AI research, something I had never considered before. Now I'm pursuing my Master's with a clear career goal!"
              </p>
            </motion.div>
            
            {/* Testimonial 2 */}
            <motion.div 
              className="card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold">PS</div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Raj Yadav</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Commerce Student</p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                "I was confused between so many career options after my commerce degree. The personalized guidance helped me find a perfect match in financial analysis and even suggested affordable certification courses."
              </p>
            </motion.div>
            
            {/* Testimonial 3 */}
            <motion.div 
              className="card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-r from-green-500 to-teal-500 w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold">AT</div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Arjun Tiwari</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Career Changer</p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                "After 5 years in a job I didn't enjoy, NextPath analyzed my transferable skills and pointed me toward UX design. The resource recommendations helped me transition without going back to school full-time."
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-dark-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Ready to Discover Your Ideal Career Path?
            </motion.h2>
            
            <motion.p 
              className="mt-4 text-lg text-gray-600 dark:text-gray-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Take our comprehensive assessment and get AI-powered recommendations tailored just for you.
            </motion.p>
            
            <motion.div 
              className="mt-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link href="/user/assessment">
                <Button 
                  variant="primary" 
                  size="lg" 
                  className="px-8"
                >
                  Start Free Assessment
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-6 bg-white dark:bg-dark-200 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>Developed by Piyush Yadav | <a href="https://github.com/piyushrajyadav" className="text-primary-600 dark:text-primary-400 hover:underline" target="_blank" rel="noopener noreferrer">@piyushrajyadav</a></p>
        </div>
      </footer>
    </div>
  );
}
