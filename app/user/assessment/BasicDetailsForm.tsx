'use client';

import { useState, useEffect } from 'react';
import useUserStore from '@/app/store/userStore';

const educationLevels = [
  '10th Standard',
  '12th Standard',
  'Diploma',
  'Bachelor\'s Degree (B.A, B.Sc, B.Com, etc.)',
  'Bachelor\'s in Engineering/Technology (B.E/B.Tech)',
  'Bachelor\'s in Medicine (MBBS)',
  'Master\'s Degree (M.A, M.Sc, M.Com, etc.)',
  'Master\'s in Engineering/Technology (M.E/M.Tech)',
  'Master\'s in Business Administration (MBA)',
  'Ph.D',
  'Other'
];

const studyFields = [
  'Computer Science & IT',
  'Engineering',
  'Commerce & Accounting',
  'Medicine & Healthcare',
  'Arts & Humanities',
  'Science',
  'Management',
  'Education',
  'Law',
  'Agriculture',
  'Pharmacy',
  'Architecture',
  'Design',
  'Media & Journalism',
  'Social Sciences',
  'Other'
];

export default function BasicDetailsForm() {
  const basicDetails = useUserStore((state) => state.basicDetails);
  const setBasicDetails = useUserStore((state) => state.setBasicDetails);
  
  const [errors, setErrors] = useState({
    name: '',
    age: '',
    educationLevel: '',
    fieldOfStudy: '',
    yearOfCompletion: ''
  });
  
  const [customEducationLevel, setCustomEducationLevel] = useState('');
  const [customFieldOfStudy, setCustomFieldOfStudy] = useState('');
  const [showCustomEducation, setShowCustomEducation] = useState(basicDetails.educationLevel === 'Other');
  const [showCustomField, setShowCustomField] = useState(basicDetails.fieldOfStudy === 'Other');

  // Handle change for text inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBasicDetails({ [name]: value });
    
    // Show custom field if "Other" is selected
    if (name === 'educationLevel') {
      setShowCustomEducation(value === 'Other');
      if (value !== 'Other') setCustomEducationLevel('');
    }
    
    if (name === 'fieldOfStudy') {
      setShowCustomField(value === 'Other');
      if (value !== 'Other') setCustomFieldOfStudy('');
    }
    
    // Clear error when field is modified
    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  // Handle number inputs separately
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = value ? parseInt(value, 10) : null;
    setBasicDetails({ [name]: numValue });
    
    // Clear error when field is modified
    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: '' });
    }
  };
  
  // Handle custom education level
  const handleCustomEducationLevel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomEducationLevel(value);
    if (value.trim()) {
      setBasicDetails({ educationLevel: value });
    }
  };
  
  // Handle custom field of study
  const handleCustomFieldOfStudy = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomFieldOfStudy(value);
    if (value.trim()) {
      setBasicDetails({ fieldOfStudy: value });
    }
  };

  return (
    <form className="space-y-6">
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Full Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={basicDetails.name}
          onChange={handleChange}
          className="form-input"
          placeholder="Enter your full name"
          required
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
      </div>

      {/* Age */}
      <div>
        <label htmlFor="age" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Age *
        </label>
        <input
          type="number"
          id="age"
          name="age"
          value={basicDetails.age || ''}
          onChange={handleNumberChange}
          min="15"
          max="100"
          className="form-input"
          placeholder="Enter your age"
          required
        />
        {errors.age && <p className="mt-1 text-sm text-red-600">{errors.age}</p>}
      </div>

      {/* Education Level */}
      <div>
        <label htmlFor="educationLevel" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Highest Education Level *
        </label>
        <select
          id="educationLevel"
          name="educationLevel"
          value={educationLevels.includes(basicDetails.educationLevel) ? basicDetails.educationLevel : 'Other'}
          onChange={handleChange}
          className="form-input"
          required
        >
          <option value="" disabled>Select your education level</option>
          {educationLevels.map((level) => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>
        
        {showCustomEducation && (
          <div className="mt-2">
            <input
              type="text"
              placeholder="Specify your education level"
              value={customEducationLevel}
              onChange={handleCustomEducationLevel}
              className="form-input"
            />
          </div>
        )}
        
        {errors.educationLevel && <p className="mt-1 text-sm text-red-600">{errors.educationLevel}</p>}
      </div>

      {/* Field of Study */}
      <div>
        <label htmlFor="fieldOfStudy" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Field of Study *
        </label>
        <select
          id="fieldOfStudy"
          name="fieldOfStudy"
          value={studyFields.includes(basicDetails.fieldOfStudy) ? basicDetails.fieldOfStudy : 'Other'}
          onChange={handleChange}
          className="form-input"
          required
        >
          <option value="" disabled>Select your field of study</option>
          {studyFields.map((field) => (
            <option key={field} value={field}>{field}</option>
          ))}
        </select>
        
        {showCustomField && (
          <div className="mt-2">
            <input
              type="text"
              placeholder="Specify your field of study"
              value={customFieldOfStudy}
              onChange={handleCustomFieldOfStudy}
              className="form-input"
            />
          </div>
        )}
        
        {errors.fieldOfStudy && <p className="mt-1 text-sm text-red-600">{errors.fieldOfStudy}</p>}
      </div>

      {/* Year of Completion */}
      <div>
        <label htmlFor="yearOfCompletion" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Year of Completion (or Expected) *
        </label>
        <input
          type="number"
          id="yearOfCompletion"
          name="yearOfCompletion"
          value={basicDetails.yearOfCompletion || ''}
          onChange={handleNumberChange}
          min={new Date().getFullYear() - 50}
          max={new Date().getFullYear() + 10}
          className="form-input"
          placeholder="Enter year of completion"
          required
        />
        {errors.yearOfCompletion && <p className="mt-1 text-sm text-red-600">{errors.yearOfCompletion}</p>}
      </div>

      {/* Form note */}
      <div className="text-sm text-gray-500 dark:text-gray-400 italic">
        * Required fields
      </div>
    </form>
  );
} 