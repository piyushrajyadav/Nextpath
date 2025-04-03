'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import useUserStore from '@/app/store/userStore';
import Button from '@/app/results/components/Button';
import { motion } from 'framer-motion';

export default function AssessmentSuccessPage() {
  const router = useRouter();
  
  // Fix: Use separate selectors for each piece of state to avoid recreating objects
  const basicDetails = useUserStore((state) => state.basicDetails);
  const academicPerformance = useUserStore((state) => state.academicPerformance);
  const interestsAndSkills = useUserStore((state) => state.interestsAndSkills);
  const careerPreferences = useUserStore((state) => state.careerPreferences);
  const financialCondition = useUserStore((state) => state.financialCondition);
  const futurePlans = useUserStore((state) => state.futurePlans);
  
  const [isLoading, setIsLoading] = useState(true);
  
  // Memoize the userData object to prevent recreation on each render
  const userData = useMemo(() => ({
    basicDetails,
    academicPerformance,
    interestsAndSkills,
    careerPreferences,
    financialCondition,
    futurePlans
  }), [basicDetails, academicPerformance, interestsAndSkills, careerPreferences, financialCondition, futurePlans]);
  
  // Redirect if no data
  useEffect(() => {
    // Check if user has completed basics at minimum
    const hasBasicData = userData.basicDetails.name && userData.basicDetails.educationLevel;
    
    if (!hasBasicData) {
      router.push('/user/assessment');
      return;
    }
    
    setIsLoading(false);
  }, [userData, router]);
  
  // Get top interests and skills - memoize these calculations
  const topInterests = useMemo(() => 
    userData.interestsAndSkills.hobbies.slice(0, 3), 
    [userData.interestsAndSkills.hobbies]
  );
  
  const topSkills = useMemo(() => 
    userData.interestsAndSkills.keySkills.slice(0, 3),
    [userData.interestsAndSkills.keySkills]
  );
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-dark-200 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <motion.div 
      className="min-h-screen bg-white dark:bg-dark-200 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Assessment Complete!
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Thank you for completing your career assessment. We've analyzed your information and prepared your personalized career recommendations.
            </p>
          </div>
          
          <div className="bg-white dark:bg-dark-200 rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Your Profile Summary
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">
                  Personal Details
                </h3>
                <ul className="space-y-2">
                  <li className="flex">
                    <span className="w-32 text-gray-600 dark:text-gray-400">Name:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{userData.basicDetails.name}</span>
                  </li>
                  <li className="flex">
                    <span className="w-32 text-gray-600 dark:text-gray-400">Age:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{userData.basicDetails.age || 'Not provided'}</span>
                  </li>
                  <li className="flex">
                    <span className="w-32 text-gray-600 dark:text-gray-400">Education:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{userData.basicDetails.educationLevel}</span>
                  </li>
                  <li className="flex">
                    <span className="w-32 text-gray-600 dark:text-gray-400">Field of Study:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{userData.basicDetails.fieldOfStudy || 'Not provided'}</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">
                  Career Preferences
                </h3>
                <ul className="space-y-2">
                  <li className="flex">
                    <span className="w-32 text-gray-600 dark:text-gray-400">Career Path:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{userData.careerPreferences.preferredCareerPath || 'Not specified'}</span>
                  </li>
                  <li className="flex">
                    <span className="w-32 text-gray-600 dark:text-gray-400">Salary Goal:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{userData.futurePlans.salaryExpectations || 'Not specified'}</span>
                  </li>
                  <li className="flex flex-col">
                    <span className="mb-1 text-gray-600 dark:text-gray-400">Preferred Industries:</span>
                    {userData.careerPreferences.preferredIndustries && userData.careerPreferences.preferredIndustries.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {userData.careerPreferences.preferredIndustries.map((industry, index) => (
                          <span 
                            key={index} 
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                          >
                            {industry}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="font-medium text-gray-900 dark:text-white">Not specified</span>
                    )}
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">
                  Top Interests
                </h3>
                {topInterests.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {topInterests.map((interest, index) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">No interests provided</p>
                )}
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">
                  Top Skills
                </h3>
                {topSkills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {topSkills.map((skill, index) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">No skills provided</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Based on your profile, we've prepared personalized career recommendations for you. View your dashboard to explore careers that match your profile.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                onClick={() => router.push('/dashboard')}
                variant="primary"
                className="w-full sm:w-auto text-center px-6 py-3"
              >
                View My Dashboard
              </Button>
              <Button
                onClick={() => router.push('/careers')}
                variant="outline"
                className="w-full sm:w-auto text-center px-6 py-3"
              >
                Explore All Careers
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 