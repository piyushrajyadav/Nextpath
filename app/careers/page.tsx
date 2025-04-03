'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useUserStore, { CareerSuggestion } from '@/app/store/userStore';
import { getMockCareerRecommendations } from '../utils/ai';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function CareersPage() {
  const router = useRouter();
  const careerSuggestions = useUserStore((state) => state.careerSuggestions);
  const setCareerSuggestions = useUserStore((state) => state.setCareerSuggestions);
  const bookmarkedCareers = useUserStore((state) => state.bookmarkedCareers);
  const bookmarkCareer = useUserStore((state) => state.bookmarkCareer);
  const removeBookmark = useUserStore((state) => state.removeBookmark);

  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [salaryRange, setSalaryRange] = useState<[number, number]>([0, 100]);

  // Load career suggestions if they don't exist
  useEffect(() => {
    const loadCareers = async () => {
      if (careerSuggestions.length === 0) {
        try {
          // In a real app, this would be an API call
          const mockCareers = getMockCareerRecommendations();
          
          // Add IDs if missing
          const processedCareers = mockCareers.map((career, index) => ({
            ...career,
            id: career.id || `career-${index + 1}`,
            matchScore: career.matchScore || 85 + Math.floor(Math.random() * 10)
          }));
          
          setTimeout(() => {
            setCareerSuggestions(processedCareers);
            setIsLoading(false);
          }, 1000); // Simulate loading
        } catch (error) {
          console.error('Error loading careers:', error);
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    loadCareers();
  }, [careerSuggestions.length, setCareerSuggestions]);

  // Get all unique industries from career suggestions
  const allIndustries = Array.from(
    new Set(
      careerSuggestions
        .flatMap(career => career.industries || [])
        .filter(Boolean)
    )
  );

  // Filter careers based on search and filters
  const filteredCareers = careerSuggestions.filter(career => {
    // Filter by search term
    const matchesSearch = searchTerm === '' || 
      career.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      career.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by selected industries
    const matchesIndustries = selectedIndustries.length === 0 || 
      selectedIndustries.some(industry => 
        career.industries?.includes(industry)
      );
    
    // Filter by salary range (converting string salary to number for comparison)
    const careerSalary = career.salaryRange || career.averageSalary || '';
    const salaryMatch = true; // Simplified for now due to complex string parsing

    return matchesSearch && matchesIndustries && salaryMatch;
  });

  // Handle bookmark toggle
  const handleBookmarkToggle = (careerId: string) => {
    if (bookmarkedCareers.includes(careerId)) {
      removeBookmark(careerId);
    } else {
      bookmarkCareer(careerId);
    }
  };

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

  return (
    <div className="min-h-screen bg-white dark:bg-dark-200 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Explore Careers
            </h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
              Browse through various career options suited for the Indian job market and your profile.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            <div className="lg:col-span-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search careers by title or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input pr-10"
                />
                <svg 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="lg:col-span-1">
              <select 
                className="form-input"
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "") {
                    setSelectedIndustries([]);
                  } else {
                    setSelectedIndustries([value]);
                  }
                }}
              >
                <option value="">All Industries</option>
                {allIndustries.map((industry) => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Career Cards */}
          {filteredCareers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCareers.map((career) => (
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
                    <Link 
                      href={`/careers/${career.id}`}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-700 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-300 hover:bg-gray-50 dark:hover:bg-dark-400 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No matching careers found</h3>
              <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                Try adjusting your search criteria or filters to find more career options.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 