'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useUserStore from '../store/userStore';
import { FiLoader, FiCheckCircle, FiArrowRight, FiCheck } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ResultsPage() {
  const router = useRouter();
  const { user, assessmentCompleted } = useUserStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user has completed assessment
    if (!assessmentCompleted) {
      router.push('/user/assessment');
      return;
    }

    // Simulate API call to generate results
    const generateResults = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 2500)); // Simulate API delay
        setLoading(false);
      } catch (error) {
        console.error('Error generating results:', error);
        setLoading(false);
      }
    };

    generateResults();
  }, [assessmentCompleted, router]);

  // User data summary from assessment
  const userSummary = [
    { label: 'Name', value: user.name || 'Not provided' },
    { label: 'Age', value: user.age ? `${user.age} years` : 'Not provided' },
    { label: 'Education Level', value: user.educationLevel || 'Not provided' },
    { label: 'Top Interests', value: user.interests?.slice(0, 3).join(', ') || 'Not provided' },
    { label: 'Top Skills', value: user.skills?.slice(0, 3).join(', ') || 'Not provided' },
    { label: 'Career Path Preference', value: user.careerPathPreference || 'Not provided' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <FiLoader className="animate-spin text-5xl mx-auto mb-4 text-primary" />
          <h1 className="text-2xl font-bold mb-2">Generating Your Career Recommendations</h1>
          <p className="text-muted-foreground mb-8">
            We&apos;re analyzing your profile to find the best career matches...
          </p>
          
          <div className="max-w-md mx-auto">
            <div className="space-y-2 text-left">
              <div className="flex items-center text-primary">
                <FiCheck className="mr-2" /> Analyzing educational background
              </div>
              <div className="flex items-center text-primary">
                <FiCheck className="mr-2" /> Processing skills and interests
              </div>
              <div className="flex items-center text-primary">
                <FiCheck className="mr-2" /> Evaluating career preferences
              </div>
              <div className="flex items-center animate-pulse">
                <FiLoader className="animate-spin mr-2" /> Generating personalized recommendations
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="mb-8 text-center">
          <FiCheckCircle className="text-primary text-5xl mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Assessment Complete!</h1>
          <p className="text-muted-foreground">
            Thank you for completing your career assessment. We&apos;ve analyzed your information and prepared your personalized career recommendations.
          </p>
        </div>

        <div className="bg-card rounded-lg p-6 shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Profile Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userSummary.map((item, index) => (
              <div key={index} className="border-b pb-2">
                <span className="font-medium">{item.label}:</span> {item.value}
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            View My Career Recommendations <FiArrowRight className="ml-2" />
          </Link>
          <p className="mt-4 text-sm text-muted-foreground">
            Your personalized career recommendations are now available on your dashboard.
          </p>
        </div>
      </motion.div>
    </div>
  );
} 