// This is a server component
export default function CareerDetailPage({ params }: { params: { id: string } }) {
  return <CareerDetailClient id={params.id} />;
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useUserStore, { CareerSuggestion } from '@/app/store/userStore';
import { getMockCareerRecommendations } from '../../utils/ai';
import Button from '@/app/results/components/Button';
import Link from 'next/link';
import { motion } from 'framer-motion';

// Client component
function CareerDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const careerId = id;
  
  const careerSuggestions = useUserStore((state) => state.careerSuggestions);
  const bookmarkedCareers = useUserStore((state) => state.bookmarkedCareers);
  const bookmarkCareer = useUserStore((state) => state.bookmarkCareer);
  const removeBookmark = useUserStore((state) => state.removeBookmark);
  const setCareerSuggestions = useUserStore((state) => state.setCareerSuggestions);
  
  const [career, setCareer] = useState<CareerSuggestion | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'roadmap' | 'resources'>('overview');
  const [similarCareers, setSimilarCareers] = useState<CareerSuggestion[]>([]);

  // Handle bookmark toggle
  const handleBookmarkToggle = () => {
    if (!career) return;
    
    if (bookmarkedCareers.includes(career.id)) {
      removeBookmark(career.id);
    } else {
      bookmarkCareer(career.id);
    }
  };

  // Load career data
  useEffect(() => {
    const fetchCareerDetails = async () => {
      try {
        let careerData: CareerSuggestion | undefined;
        
        // Try to find the career in existing suggestions
        careerData = careerSuggestions.find(c => c.id === careerId);
        
        // If not found, fetch mock data
        if (!careerData) {
          const mockCareers = getMockCareerRecommendations();
          
          // Process mock data to ensure it matches CareerSuggestion type
          const processedCareers = mockCareers.map((career, index) => ({
            ...career,
            id: career.id || `career-${index + 1}`,
            matchScore: career.matchScore || 85 + Math.floor(Math.random() * 10)
          }));
          
          // Update the career suggestions in store for future use
          setCareerSuggestions(processedCareers);
          
          // Find the career we're looking for
          careerData = processedCareers.find(c => c.id === careerId);
        }
        
        // If still not found, redirect to careers page
        if (!careerData) {
          console.error('Career not found');
          router.push('/careers');
          return;
        }
        
        // Find similar careers based on industries or skills
        const similar = careerSuggestions
          .filter(c => c.id !== careerId)
          .filter(c => {
            // Check for overlapping industries
            const industryOverlap = c.industries?.some(industry => 
              careerData?.industries?.includes(industry)
            );
            
            // Check for overlapping skills
            const skillOverlap = c.requiredSkills.some(skill => 
              careerData?.requiredSkills.includes(skill)
            );
            
            return industryOverlap || skillOverlap;
          })
          .slice(0, 3); // Limit to 3 similar careers
        
        setCareer(careerData);
        setSimilarCareers(similar);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching career details:', error);
        setIsLoading(false);
      }
    };

    fetchCareerDetails();
  }, [careerId, careerSuggestions, router, setCareerSuggestions]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-dark-200 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Loading career information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!career) {
    return (
      <div className="min-h-screen bg-white dark:bg-dark-200 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Career Not Found</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">The career you&apos;re looking for could not be found.</p>
            <Link 
              href="/careers"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Browse All Careers
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-dark-200 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Back button */}
          <div className="mb-6">
            <Link
              href="/careers"
              className="inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Back to Careers
            </Link>
          </div>
          
          {/* Career header */}
          <div className="bg-white dark:bg-dark-200 rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{career.title}</h1>
                  <div className={`
                    h-10 w-10 rounded-full flex items-center justify-center text-white font-medium text-sm
                    ${(career.matchScore || 95) >= 90 ? 'bg-green-500' : 
                      (career.matchScore || 95) >= 80 ? 'bg-teal-500' : 
                      (career.matchScore || 95) >= 70 ? 'bg-blue-500' : 
                      'bg-gray-500'}
                  `}>
                    {career.matchScore || 95}%
                  </div>
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                  {career.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {(career.industries || []).map((industry, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                    >
                      {industry}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="shrink-0">
                <Button
                  onClick={handleBookmarkToggle}
                  variant={bookmarkedCareers.includes(career.id) ? 'primary' : 'outline'}
                  className="flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                    <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z" clipRule="evenodd" />
                  </svg>
                  {bookmarkedCareers.includes(career.id) ? 'Bookmarked' : 'Bookmark'}
                </Button>
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('roadmap')}
                className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'roadmap'
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Career Roadmap
              </button>
              <button
                onClick={() => setActiveTab('resources')}
                className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'resources'
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Learning Resources
              </button>
            </nav>
          </div>
          
          {/* Tab Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {activeTab === 'overview' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-white dark:bg-dark-200 rounded-lg shadow-sm p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Career Overview</h2>
                    
                    <div className="mb-6">
                      <h3 className="text-md font-medium text-gray-800 dark:text-white mb-2">Salary Range</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {career.salaryRange || career.averageSalary || 'Varies based on experience and location'}
                      </p>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-md font-medium text-gray-800 dark:text-white mb-2">Growth Potential</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {career.growthPotential}
                      </p>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-md font-medium text-gray-800 dark:text-white mb-2">Required Skills</h3>
                      <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                        {career.requiredSkills.map((skill, index) => (
                          <li key={index}>{skill}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-md font-medium text-gray-800 dark:text-white mb-2">Required Education</h3>
                      {typeof career.requiredEducation === 'string' ? (
                        <p className="text-gray-600 dark:text-gray-300">{career.requiredEducation}</p>
                      ) : Array.isArray(career.requiredEducation) ? (
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                          {career.requiredEducation.map((education, index) => (
                            <li key={index}>{education}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-600 dark:text-gray-300">No specific education requirements specified.</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
              
              {activeTab === 'roadmap' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-white dark:bg-dark-200 rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Career Roadmap</h2>
                    
                    <div className="relative pl-8 pb-2 border-l-2 border-gray-200 dark:border-gray-700">
                      <div className="absolute top-0 left-0 w-6 h-6 bg-primary-500 rounded-full transform -translate-x-1/2 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">1</span>
                      </div>
                      <div className="mb-8">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Education & Foundation</h3>
                        <p className="mt-2 text-gray-600 dark:text-gray-300">
                          {typeof career.requiredEducation === 'string' 
                            ? career.requiredEducation 
                            : 'Obtain the necessary educational qualifications and build a solid foundation of skills.'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="relative pl-8 pb-2 border-l-2 border-gray-200 dark:border-gray-700">
                      <div className="absolute top-0 left-0 w-6 h-6 bg-primary-500 rounded-full transform -translate-x-1/2 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">2</span>
                      </div>
                      <div className="mb-8">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Entry-Level Position</h3>
                        <p className="mt-2 text-gray-600 dark:text-gray-300">
                          Start with an entry-level position to gain practical experience and industry exposure. Focus on developing core skills and understanding the business environment.
                        </p>
                      </div>
                    </div>
                    
                    <div className="relative pl-8 pb-2 border-l-2 border-gray-200 dark:border-gray-700">
                      <div className="absolute top-0 left-0 w-6 h-6 bg-primary-500 rounded-full transform -translate-x-1/2 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">3</span>
                      </div>
                      <div className="mb-8">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Mid-Level Growth</h3>
                        <p className="mt-2 text-gray-600 dark:text-gray-300">
                          After 2-3 years, advance to mid-level roles with increased responsibilities. Develop specialized expertise and build professional networks. Consider additional certifications or training.
                        </p>
                      </div>
                    </div>
                    
                    <div className="relative pl-8">
                      <div className="absolute top-0 left-0 w-6 h-6 bg-primary-500 rounded-full transform -translate-x-1/2 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">4</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Senior/Leadership Level</h3>
                        <p className="mt-2 text-gray-600 dark:text-gray-300">
                          Progress to senior roles with 5-8+ years of experience. Develop leadership skills, manage teams, and contribute to strategic initiatives. Explore opportunities for mentoring and guiding others.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {activeTab === 'resources' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-white dark:bg-dark-200 rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Learning Resources</h2>
                    
                    <ul className="space-y-4">
                      {(career.resources || []).map((resource, index) => (
                        <li key={index} className="border-b border-gray-100 dark:border-gray-800 pb-4 last:border-0 last:pb-0">
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block hover:bg-gray-50 dark:hover:bg-dark-300 rounded-md p-3 -m-3 transition-colors"
                          >
                            <h3 className="text-lg font-medium text-primary-600 dark:text-primary-400">{resource.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {resource.url}
                            </p>
                          </a>
                        </li>
                      ))}
                      
                      {(career.learningResources || []).map((resource, index) => (
                        <li key={`learning-${index}`} className="border-b border-gray-100 dark:border-gray-800 pb-4 last:border-0 last:pb-0">
                          <div className="block rounded-md p-3 -m-3">
                            <h3 className="text-lg font-medium text-primary-600 dark:text-primary-400">{resource}</h3>
                          </div>
                        </li>
                      ))}
                      
                      {(career.resources || []).length === 0 && (career.learningResources || []).length === 0 && (
                        <li className="text-center py-4">
                          <p className="text-gray-500 dark:text-gray-400">No specific learning resources available.</p>
                        </li>
                      )}
                    </ul>
                  </div>
                </motion.div>
              )}
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-dark-200 rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Similar Careers</h2>
                
                {similarCareers.length > 0 ? (
                  <ul className="space-y-4">
                    {similarCareers.map((similarCareer) => (
                      <li key={similarCareer.id} className="border-b border-gray-100 dark:border-gray-800 pb-4 last:border-0 last:pb-0">
                        <Link 
                          href={`/careers/${similarCareer.id}`}
                          className="block hover:bg-gray-50 dark:hover:bg-dark-300 rounded-md p-3 -m-3 transition-colors"
                        >
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">{similarCareer.title}</h3>
                          <div className="flex items-center mt-2">
                            <div className={`
                              h-6 w-6 rounded-full flex items-center justify-center text-white font-medium text-xs
                              ${(similarCareer.matchScore || 80) >= 90 ? 'bg-green-500' : 
                                (similarCareer.matchScore || 80) >= 80 ? 'bg-teal-500' : 
                                (similarCareer.matchScore || 80) >= 70 ? 'bg-blue-500' : 
                                'bg-gray-500'}
                            `}>
                              {similarCareer.matchScore || 80}%
                            </div>
                            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">Match</span>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-center py-4 text-gray-500 dark:text-gray-400">
                    No similar careers found.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 