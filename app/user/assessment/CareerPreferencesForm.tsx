'use client';

import { useState } from 'react';
import useUserStore from '@/app/store/userStore';
import Button from '@/app/results/components/Button';

// India-centric career path options
const careerPaths = [
  'Private Sector Job',
  'Government/PSU Job',
  'Civil Services (IAS, IPS, etc.)',
  'Entrepreneurship/Startup',
  'Family Business',
  'Teaching/Academia',
  'Research',
  'Freelancing/Self-employed',
  'Public Service/Non-profit',
  'Banking/Finance',
  'Armed Forces',
  'Healthcare Professional',
  'Other'
];

// India-centric industry options
const industries = [
  'Information Technology/Software',
  'Banking & Financial Services',
  'Education & Training',
  'Healthcare & Pharmaceuticals',
  'Government & Public Administration',
  'Manufacturing',
  'E-commerce & Retail',
  'Telecommunications',
  'Media & Entertainment',
  'Travel & Hospitality',
  'Agriculture & Food Processing',
  'Automotive',
  'Construction & Real Estate',
  'Renewable Energy',
  'Textile & Apparel',
  'FMCG (Fast Moving Consumer Goods)',
  'BPO & KPO Services',
  'Consulting',
  'Logistics & Supply Chain',
  'Railways',
  'Defence',
  'Mining',
  'Oil & Gas',
  'Shipping'
];

export default function CareerPreferencesForm() {
  const careerPreferences = useUserStore((state) => state.careerPreferences);
  const setCareerPreferences = useUserStore((state) => state.setCareerPreferences);
  
  const [customCareerPath, setCustomCareerPath] = useState('');
  const [customIndustry, setCustomIndustry] = useState('');
  const [showCustomCareerPath, setShowCustomCareerPath] = useState(careerPreferences.preferredCareerPath === 'Other');

  // Handle career path selection
  const handleCareerPathChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setCareerPreferences({ preferredCareerPath: value });
    setShowCustomCareerPath(value === 'Other');
    if (value !== 'Other') setCustomCareerPath('');
  };
  
  // Handle custom career path
  const handleCustomCareerPath = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomCareerPath(value);
    if (value.trim()) {
      setCareerPreferences({ preferredCareerPath: value });
    }
  };

  // Handle industry selection
  const handleIndustryChange = (industry: string) => {
    // Toggle industry selection
    const updatedIndustries = careerPreferences.preferredIndustries.includes(industry)
      ? careerPreferences.preferredIndustries.filter((i) => i !== industry)
      : [...careerPreferences.preferredIndustries, industry];
    
    setCareerPreferences({ preferredIndustries: updatedIndustries });
  };
  
  // Handle custom industry input
  const handleCustomIndustry = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomIndustry(e.target.value);
  };
  
  // Add custom industry
  const handleAddCustomIndustry = () => {
    const trimmedIndustry = customIndustry.trim();
    
    if (!trimmedIndustry) return;
    if (careerPreferences.preferredIndustries.includes(trimmedIndustry)) return;
    if (careerPreferences.preferredIndustries.length >= 5) return;
    
    setCareerPreferences({
      preferredIndustries: [...careerPreferences.preferredIndustries, trimmedIndustry]
    });
    
    setCustomIndustry('');
  };

  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setCareerPreferences({ [name]: checked });
  };

  return (
    <div className="space-y-8">
      {/* Career Path */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Preferred Career Path</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          What type of career are you most interested in pursuing?
        </p>
        <select
          id="preferredCareerPath"
          name="preferredCareerPath"
          value={careerPaths.includes(careerPreferences.preferredCareerPath) ? careerPreferences.preferredCareerPath : 'Other'}
          onChange={handleCareerPathChange}
          className="form-input"
        >
          <option value="" disabled>Select your preferred career path</option>
          {careerPaths.map((path) => (
            <option key={path} value={path}>{path}</option>
          ))}
        </select>
        
        {showCustomCareerPath && (
          <div className="mt-2">
            <input
              type="text"
              placeholder="Specify your career path"
              value={customCareerPath}
              onChange={handleCustomCareerPath}
              className="form-input"
            />
          </div>
        )}
      </div>

      {/* Preferred Industries */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Preferred Industries</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Select up to 5 industries you&apos;re interested in working in.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {industries.map((industry) => {
            const isSelected = careerPreferences.preferredIndustries.includes(industry);
            const isDisabled = !isSelected && careerPreferences.preferredIndustries.length >= 5;
            
            return (
              <div 
                key={industry}
                className={`
                  relative flex items-center p-3 rounded-md border
                  ${isSelected 
                    ? 'bg-primary-50 border-primary-300 dark:bg-primary-900/20 dark:border-primary-700' 
                    : 'bg-white dark:bg-dark-300 border-gray-300 dark:border-gray-700'}
                  ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-400'}
                  transition-colors duration-200
                `}
                onClick={() => !isDisabled && handleIndustryChange(industry)}
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  checked={isSelected}
                  disabled={isDisabled && !isSelected}
                  onChange={() => {}}
                  onClick={(e) => e.stopPropagation()}
                />
                <label className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {industry}
                </label>
              </div>
            );
          })}
        </div>
        
        {/* Add custom industry */}
        {careerPreferences.preferredIndustries.length < 5 && (
          <div className="mt-4 flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Add a custom industry if not in the list"
                value={customIndustry}
                onChange={handleCustomIndustry}
                className="form-input"
              />
            </div>
            <Button 
              onClick={handleAddCustomIndustry} 
              variant="secondary"
              size="md"
              className="md:w-auto w-full"
              disabled={!customIndustry.trim() || careerPreferences.preferredIndustries.length >= 5}
            >
              Add Industry
            </Button>
          </div>
        )}
        
        {careerPreferences.preferredIndustries.length === 0 && (
          <p className="text-sm text-red-500 mt-2">Please select at least one industry</p>
        )}
      </div>

      {/* Additional Preferences */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Additional Preferences</h3>
        
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              id="governmentJobInterest"
              name="governmentJobInterest"
              type="checkbox"
              className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              checked={careerPreferences.governmentJobInterest}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="governmentJobInterest" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
              I am interested in government jobs, PSUs, or civil services
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              id="entrepreneurshipInterest"
              name="entrepreneurshipInterest"
              type="checkbox"
              className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              checked={careerPreferences.entrepreneurshipInterest}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="entrepreneurshipInterest" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
              I am interested in starting my own business or startup
            </label>
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-500 dark:text-gray-400 italic mt-8">
        Your career preferences help us tailor recommendations to match your interests and aspirations in the Indian job market.
      </div>
    </div>
  );
} 