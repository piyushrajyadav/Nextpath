'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import useUserStore, { CareerSuggestion } from '@/app/store/userStore';
import { generateCareerRecommendations, getMockCareerRecommendations } from '@/app/utils/ai';
import Button from '@/app/results/components/Button';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  
  // Use separate selectors for each piece of state to avoid recreating objects
  const basicDetails = useUserStore((state) => state.basicDetails);
  const academicPerformance = useUserStore((state) => state.academicPerformance);
  const interestsAndSkills = useUserStore((state) => state.interestsAndSkills);
  const careerPreferences = useUserStore((state) => state.careerPreferences);
  const financialCondition = useUserStore((state) => state.financialCondition);
  const futurePlans = useUserStore((state) => state.futurePlans);
  const assessmentCompleted = useUserStore((state) => state.assessmentCompleted);
  
  // Memoize the userData object to prevent recreation on each render
  const userData = useMemo(() => ({
    basicDetails,
    academicPerformance,
    interestsAndSkills,
    careerPreferences,
    financialCondition,
    futurePlans,
    assessmentCompleted
  }), [basicDetails, academicPerformance, interestsAndSkills, careerPreferences, financialCondition, futurePlans, assessmentCompleted]);
  
  const careerSuggestions = useUserStore((state) => state.careerSuggestions);
  const setCareerSuggestions = useUserStore((state) => state.setCareerSuggestions);
  const bookmarkedCareers = useUserStore((state) => state.bookmarkedCareers);
  const bookmarkCareer = useUserStore((state) => state.bookmarkCareer);
  const removeBookmark = useUserStore((state) => state.removeBookmark);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'bookmarked'>('all');
  const [selectedCareer, setSelectedCareer] = useState<CareerSuggestion | null>(null);

  // Check if user has completed the assessment
  useEffect(() => {
    const hasCompletedBasics = userData.basicDetails.name && userData.basicDetails.educationLevel;
    
    if (!hasCompletedBasics) {
      router.push('/user/assessment');
      return;
    }
    
    // If assessment not officially completed, redirect to success page first
    if (!userData.assessmentCompleted && hasCompletedBasics) {
      router.push('/user/assessment/success');
      return;
    }
  }, [userData, router]);

  // Fetch career recommendations
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Always generate new AI recommendations
        let suggestions: CareerSuggestion[] = [];
        
        try {
          // Generate AI recommendations based on the user's profile
          suggestions = await generateCareerRecommendations(
            userData.basicDetails,
            userData.academicPerformance,
            userData.interestsAndSkills,
            userData.careerPreferences,
            userData.financialCondition,
            userData.futurePlans
          );
          
          console.log('Fresh AI-generated career recommendations:', suggestions);
        } catch (apiError) {
          console.error('Error generating AI recommendations, falling back to mock data:', apiError);
          suggestions = getMockCareerRecommendations();
        }
        
        // Add IDs if missing and ensure all required fields are present
        const processedSuggestions = suggestions.map((career, index) => {
          // Process requiredEducation to ensure it's always a string array
          let processedEducation: string[] = [];
          
          if (!career.requiredEducation) {
            processedEducation = ['Not specified'];
          } else if (typeof career.requiredEducation === 'string') {
            processedEducation = [career.requiredEducation];
          } else if (Array.isArray(career.requiredEducation)) {
            processedEducation = career.requiredEducation.map(item => 
              typeof item === 'string' ? item : 'Education requirement'
            );
          } else {
            processedEducation = ['Education requirements available'];
          }
          
          const processedCareer: CareerSuggestion = {
            id: career.id || `career-${Date.now()}-${index + 1}`, // Add timestamp for uniqueness
            title: career.title || 'Career Path',
            description: career.description || 'No description available',
            matchScore: career.matchScore || 70 + Math.floor(Math.random() * 25),
            requiredSkills: career.requiredSkills || ['Not specified'],
            requiredEducation: processedEducation,
            salaryRange: career.salaryRange || career.averageSalary || 'Varies based on experience',
            growthPotential: career.growthPotential || 'Career growth opportunities available',
            industries: career.industries || [],
            learningResources: career.learningResources || []
          };
          return processedCareer;
        });
        
        // Sort by match score
        processedSuggestions.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
        
        // Store in user state (this won't be persisted)
        setCareerSuggestions(processedSuggestions);
        setIsLoading(false);
        
      } catch (error) {
        console.error('Error fetching career recommendations:', error);
        setError('Failed to fetch career recommendations. Please try again later.');
        
        // Fallback to mock data even on error, but generate unique IDs
        const mockData = getMockCareerRecommendations().map((career, index) => {
          // Process requiredEducation to ensure it's always a string array
          let processedEducation: string[] = [];
          
          if (!career.requiredEducation) {
            processedEducation = ['Not specified'];
          } else if (typeof career.requiredEducation === 'string') {
            processedEducation = [career.requiredEducation];
          } else if (Array.isArray(career.requiredEducation)) {
            processedEducation = career.requiredEducation.map(item => 
              typeof item === 'string' ? item : 'Education requirement'
            );
          } else {
            processedEducation = ['Education requirements available'];
          }
          
          return {
            ...career,
            id: `mock-${Date.now()}-${index + 1}`,
            matchScore: career.matchScore || 70 + Math.floor(Math.random() * 25),
            requiredEducation: processedEducation
          };
        });
        setCareerSuggestions(mockData);
        setIsLoading(false);
      }
    };

    // Clear existing suggestions and fetch new ones
    setCareerSuggestions([]);
    fetchRecommendations();
  }, [userData, setCareerSuggestions]);

  // Handle career bookmark toggle
  const handleBookmarkToggle = (careerId: string) => {
    if (bookmarkedCareers.includes(careerId)) {
      removeBookmark(careerId);
    } else {
      bookmarkCareer(careerId);
    }
  };

  // Get careers to display based on active tab
  const displayedCareers = activeTab === 'all' 
    ? careerSuggestions 
    : careerSuggestions.filter(career => bookmarkedCareers.includes(career.id));
  
  // Show career details
  const handleShowDetails = (career: CareerSuggestion) => {
    setSelectedCareer(career);
  };

  // Close career details
  const handleCloseDetails = () => {
    setSelectedCareer(null);
  };

  // Redirect to detailed career page
  const handleExploreCareer = (careerId: string) => {
    router.push(`/careers/${careerId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-dark-200 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Generating personalized career recommendations...</p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">This may take a moment as our AI analyzes your profile.</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && careerSuggestions.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-dark-200 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error</h3>
                  <p className="mt-2 text-sm text-red-700 dark:text-red-300">{error}</p>
                  <div className="mt-4">
                    <Button 
                      onClick={() => window.location.reload()}
                      variant="outline"
                      size="sm"
                    >
                      Try Again
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-dark-200 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12 flex justify-between items-start">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Your Career Dashboard
              </h1>
              <p className="mt-2 text-lg text-gray-600 dark:text-gray-300 max-w-3xl">
                Based on your profile, we've identified these career paths in the Indian job market that best match your qualifications, interests, and goals.
              </p>
              <div className="mt-4">
                <Link 
                  href="/careers"
                  className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:underline"
                >
                  <span>Explore all careers</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
            
            <Button
              onClick={() => {
                setIsLoading(true);
                setCareerSuggestions([]);
                setTimeout(() => {
                  // Clear stored suggestions and reload the page
                  useUserStore.getState().clearCareerSuggestions();
                  window.location.reload();
                }, 500);
              }}
              variant="outline"
              className="flex items-center"
              disabled={isLoading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Generate New Recommendations
            </Button>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('all')}
                className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'all'
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                All Recommendations ({careerSuggestions.length})
              </button>
              <button
                onClick={() => setActiveTab('bookmarked')}
                className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'bookmarked'
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Bookmarked ({bookmarkedCareers.length})
              </button>
            </nav>
          </div>

          {/* Career Cards */}
          {displayedCareers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedCareers.map((career) => (
                <motion.div 
                  key={career.id}
                  className="card hover:shadow-md transition-shadow duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{career.title}</h3>
                    <button
                      onClick={() => handleBookmarkToggle(career.id)}
                      className={`p-1 rounded-md transition-colors ${
                        bookmarkedCareers.includes(career.id)
                          ? 'text-yellow-500 hover:text-yellow-600'
                          : 'text-gray-400 hover:text-yellow-500'
                      }`}
                      aria-label={bookmarkedCareers.includes(career.id) ? 'Remove bookmark' : 'Add bookmark'}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="flex items-center mb-4">
                    <div className={`
                      h-10 w-10 rounded-full flex items-center justify-center text-white font-medium text-sm
                      ${(career.matchScore || 95) >= 90 ? 'bg-green-500' : 
                        (career.matchScore || 95) >= 80 ? 'bg-teal-500' : 
                        (career.matchScore || 95) >= 70 ? 'bg-blue-500' : 
                        'bg-gray-500'}
                    `}>
                      {career.matchScore || 95}%
                    </div>
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">Match Score</span>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                    {career.description}
                  </p>
                  
                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Required Skills:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {career.requiredSkills.slice(0, 3).map((skill, index) => (
                        <span 
                          key={index}
                          className="text-xs inline-flex items-center px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                        >
                          {skill}
                        </span>
                      ))}
                      {career.requiredSkills.length > 3 && (
                        <span className="text-xs inline-flex items-center px-2 py-0.5 rounded bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                          +{career.requiredSkills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-6">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Salary:</span> {career.salaryRange || career.averageSalary}
                    </div>
                    <Button 
                      onClick={() => handleShowDetails(career)}
                      variant="outline"
                      size="sm"
                    >
                      View Details
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No {activeTab === 'bookmarked' ? 'bookmarked' : ''} careers found</h3>
              {activeTab === 'bookmarked' ? (
                <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                  You haven't bookmarked any career recommendations yet. Bookmark careers you're interested in to view them here.
                </p>
              ) : (
                <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                  We couldn't find any career recommendations based on your profile. Please update your assessment to get personalized suggestions.
                </p>
              )}
              {activeTab === 'bookmarked' && (
                <Button 
                  onClick={() => setActiveTab('all')}
                  variant="outline"
                  className="mt-4"
                >
                  View All Recommendations
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Career Details Modal */}
      {selectedCareer && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <motion.div 
              className="inline-block align-bottom bg-white dark:bg-dark-200 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 sm:mt-0 sm:text-left w-full">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-2xl leading-6 font-bold text-gray-900 dark:text-white">
                        {selectedCareer.title}
                      </h3>
                      <div className={`
                        h-12 w-12 rounded-full flex items-center justify-center text-white font-medium
                        ${(selectedCareer.matchScore || 95) >= 90 ? 'bg-green-500' : 
                          (selectedCareer.matchScore || 95) >= 80 ? 'bg-teal-500' : 
                          (selectedCareer.matchScore || 95) >= 70 ? 'bg-blue-500' : 
                          'bg-gray-500'}
                      `}>
                        {selectedCareer.matchScore || 95}%
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <p className="text-gray-700 dark:text-gray-300 mb-6">
                        {selectedCareer.description}
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <h4 className="text-md font-medium text-gray-800 dark:text-white mb-2">
                            Required Skills
                          </h4>
                          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                            {selectedCareer.requiredSkills.map((skill, index) => (
                              <li key={index}>{skill}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="text-md font-medium text-gray-800 dark:text-white mb-2">
                            Required Education
                          </h4>
                          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                            {Array.isArray(selectedCareer.requiredEducation) && 
                              selectedCareer.requiredEducation.map((education: string, index: number) => (
                                <li key={index}>{education}</li>
                              ))
                            }
                            {(!selectedCareer.requiredEducation || 
                              !Array.isArray(selectedCareer.requiredEducation) || 
                              selectedCareer.requiredEducation.length === 0) && (
                              <li>No specific education requirements</li>
                            )}
                          </ul>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <h4 className="text-md font-medium text-gray-800 dark:text-white mb-2">
                            Salary Range
                          </h4>
                          <p className="text-gray-600 dark:text-gray-300">
                            {selectedCareer.salaryRange || selectedCareer.averageSalary || 'Varies based on experience and location'}
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="text-md font-medium text-gray-800 dark:text-white mb-2">
                            Growth Potential
                          </h4>
                          <p className="text-gray-600 dark:text-gray-300">
                            {selectedCareer.growthPotential}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <h4 className="text-md font-medium text-gray-800 dark:text-white mb-2">
                          Key Industries
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {(selectedCareer.industries || []).map((industry, index) => (
                            <span 
                              key={index}
                              className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                            >
                              {industry}
                            </span>
                          ))}
                          {(!selectedCareer.industries || selectedCareer.industries.length === 0) && (
                            <span className="text-gray-600 dark:text-gray-300">No specific industries listed</span>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-md font-medium text-gray-800 dark:text-white mb-2">
                          Learning Resources
                        </h4>
                        <ul className="space-y-2">
                          {(selectedCareer.learningResources || []).map((resource, index) => (
                            <li key={index} className="text-primary-600 dark:text-primary-400">
                              {resource}
                            </li>
                          ))}
                          {(!selectedCareer.learningResources || selectedCareer.learningResources.length === 0) && (
                            <li className="text-gray-600 dark:text-gray-300">No specific resources listed</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-dark-300 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Button
                  onClick={() => handleExploreCareer(selectedCareer.id)}
                  variant="primary"
                  className="w-full sm:w-auto sm:ml-3"
                >
                  Explore This Career
                </Button>
                <Button
                  onClick={handleCloseDetails}
                  variant="outline"
                  className="mt-3 sm:mt-0 w-full sm:w-auto"
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
} 