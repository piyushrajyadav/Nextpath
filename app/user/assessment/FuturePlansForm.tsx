'use client';

import { useState } from 'react';
import useUserStore from '@/app/store/userStore';
import Button from '@/app/results/components/Button';

// India-specific salary expectation ranges (in INR per annum)
const salaryRanges = [
  'Below ₹3,00,000 per annum',
  '₹3,00,000 - ₹5,00,000 per annum',
  '₹5,00,000 - ₹8,00,000 per annum',
  '₹8,00,000 - ₹12,00,000 per annum',
  '₹12,00,000 - ₹18,00,000 per annum',
  '₹18,00,000 - ₹25,00,000 per annum',
  'Above ₹25,00,000 per annum',
  'Not important to me'
];

// India-specific higher education options
const higherEducationOptions = [
  { id: 'masters_india', label: 'Master\'s degree in India' },
  { id: 'phd_india', label: 'PhD in India' },
  { id: 'masters_abroad', label: 'Master\'s degree abroad' },
  { id: 'phd_abroad', label: 'PhD abroad' },
  { id: 'mba', label: 'MBA (Indian or foreign)' },
  { id: 'other_pg', label: 'Other postgraduate diploma/certification' },
];

// Popular location options in India and abroad
const popularLocations = [
  // Major Indian cities
  'Mumbai',
  'Delhi NCR',
  'Bangalore',
  'Hyderabad',
  'Chennai',
  'Pune',
  'Kolkata',
  'Ahmedabad',
  'Chandigarh',
  'Jaipur',
  'Indore',
  'Kochi',
  'Bhubaneswar',
  'Lucknow',
  // International locations
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Singapore',
  'Dubai/UAE',
  'Germany',
  'Japan',
  // Work arrangements
  'Remote / Work from Home',
  'Flexible / No Preference',
  'Any Tier 1 City in India',
  'Any Tier 2 City in India'
];

export default function FuturePlansForm() {
  const futurePlans = useUserStore((state) => state.futurePlans);
  const setFuturePlans = useUserStore((state) => state.setFuturePlans);
  
  const [newLocation, setNewLocation] = useState('');
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [customSalary, setCustomSalary] = useState('');
  const [showCustomSalary, setShowCustomSalary] = useState(false);
  const [selectedEducationOptions, setSelectedEducationOptions] = useState<string[]>([]);

  // Filter locations based on input
  const filteredLocations = newLocation.trim() 
    ? popularLocations.filter(loc => loc.toLowerCase().includes(newLocation.toLowerCase())) 
    : popularLocations;

  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFuturePlans({ [name]: checked });
    
    // Reset education options if unchecked
    if (name === 'higherEducationPlans' && !checked) {
      setSelectedEducationOptions([]);
    }
  };
  
  // Handle education option selection
  const handleEducationOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked, id } = e.target;
    
    if (checked) {
      setSelectedEducationOptions([...selectedEducationOptions, id]);
    } else {
      setSelectedEducationOptions(selectedEducationOptions.filter(item => item !== id));
    }
  };

  // Handle salary expectation selection
  const handleSalaryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFuturePlans({ salaryExpectations: value });
    setShowCustomSalary(value === 'Other');
    if (value !== 'Other') setCustomSalary('');
  };
  
  // Handle custom salary input
  const handleCustomSalary = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomSalary(value);
    if (value.trim()) {
      setFuturePlans({ salaryExpectations: value });
    }
  };

  // Handle adding a location preference
  const handleAddLocation = (location = newLocation) => {
    const trimmedLocation = location.trim();
    
    if (!trimmedLocation) return;
    if (futurePlans.locationPreferences.includes(trimmedLocation)) return;
    
    setFuturePlans({
      locationPreferences: [...futurePlans.locationPreferences, trimmedLocation]
    });
    
    setNewLocation('');
    setShowLocationSuggestions(false);
  };

  // Handle removing a location preference
  const handleRemoveLocation = (index: number) => {
    const updatedLocations = [...futurePlans.locationPreferences];
    updatedLocations.splice(index, 1);
    setFuturePlans({ locationPreferences: updatedLocations });
  };

  return (
    <div className="space-y-8">
      {/* Higher Education Plans */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Higher Education Plans</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Let us know if you're interested in pursuing higher education as part of your career journey.
        </p>
        
        <div className="bg-gray-50 dark:bg-dark-300 rounded-md p-5">
          <div className="flex items-center">
            <input
              id="higherEducationPlans"
              name="higherEducationPlans"
              type="checkbox"
              className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              checked={futurePlans.higherEducationPlans}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="higherEducationPlans" className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
              I'm interested in pursuing higher education
            </label>
          </div>
          
          {futurePlans.higherEducationPlans && (
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              <p className="mb-3">
                Select the higher education options you might be interested in:
              </p>
              
              <div className="space-y-2 ml-2">
                {higherEducationOptions.map((option) => (
                  <div key={option.id} className="flex items-center">
                    <input
                      id={option.id}
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      checked={selectedEducationOptions.includes(option.id)}
                      onChange={handleEducationOptionChange}
                    />
                    <label htmlFor={option.id} className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
              
              <p className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                We'll include recommendations for relevant advanced degree programs that could enhance your career prospects in India and abroad if desired.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Salary Expectations */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Salary Expectations</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          What is your expected salary range for your future career in India?
        </p>
        
        <select
          id="salaryExpectations"
          name="salaryExpectations"
          value={salaryRanges.includes(futurePlans.salaryExpectations) ? futurePlans.salaryExpectations : 'Other'}
          onChange={handleSalaryChange}
          className="form-input"
        >
          <option value="" disabled>Select salary range</option>
          {salaryRanges.map((range) => (
            <option key={range} value={range}>{range}</option>
          ))}
          <option value="Other">Other / Specify custom amount</option>
        </select>
        
        {showCustomSalary && (
          <div className="mt-2">
            <input
              type="text"
              placeholder="Specify your expected salary"
              value={customSalary}
              onChange={handleCustomSalary}
              className="form-input"
            />
          </div>
        )}
      </div>

      {/* Location Preferences */}
      <div className="relative">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Location Preferences</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Where in India (or abroad) would you prefer to work? Add multiple locations if applicable.
        </p>
        
        {/* Input with suggestions */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Type a city or region"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              onFocus={() => setShowLocationSuggestions(true)}
              className="form-input"
            />
            
            {/* Suggestions dropdown */}
            {showLocationSuggestions && (
              <div className="absolute z-10 w-full mt-1 bg-white dark:bg-dark-200 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
                {filteredLocations.length > 0 ? (
                  <ul className="py-1">
                    {filteredLocations.map((location, index) => (
                      <li 
                        key={index}
                        className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-300 cursor-pointer"
                        onClick={() => handleAddLocation(location)}
                      >
                        {location}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">No suggestions found. Type and add your own location!</p>
                )}
              </div>
            )}
          </div>
          
          <Button 
            onClick={() => handleAddLocation()} 
            variant="secondary"
            size="md"
            className="md:w-auto w-full"
          >
            Add Location
          </Button>
        </div>
        
        {/* Selected locations */}
        {futurePlans.locationPreferences.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {futurePlans.locationPreferences.map((location, index) => (
              <div 
                key={index}
                className="bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 px-3 py-1 rounded-full flex items-center"
              >
                <span>{location}</span>
                <button
                  onClick={() => handleRemoveLocation(index)}
                  className="ml-2 text-teal-500 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-sm italic">No location preferences added yet</p>
        )}
      </div>

      {/* Final Note */}
      <div className="bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-400 p-4 mt-8">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              You're almost done! After this step, we'll analyze your profile and provide personalized career recommendations tailored to the Indian job market and your specific preferences.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 