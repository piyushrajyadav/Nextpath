'use client';

import { useState } from 'react';
import useUserStore from '@/app/store/userStore';

// India-specific family income brackets (in INR)
const incomeRanges = [
  'Below ₹2,50,000 per annum',
  '₹2,50,000 - ₹5,00,000 per annum',
  '₹5,00,000 - ₹7,50,000 per annum',
  '₹7,50,000 - ₹10,00,000 per annum',
  '₹10,00,000 - ₹15,00,000 per annum',
  '₹15,00,000 - ₹20,00,000 per annum',
  'Above ₹20,00,000 per annum',
  'Prefer not to say'
];

// Scholarship categories specific to India
const scholarshipCategories = [
  { id: 'merit', label: 'Merit-based scholarships' },
  { id: 'sc_st', label: 'SC/ST/OBC scholarships' },
  { id: 'minority', label: 'Minority scholarships' },
  { id: 'sports', label: 'Sports scholarships' },
  { id: 'girls', label: 'Scholarships for girls' },
  { id: 'disability', label: 'Scholarships for differently-abled' },
];

export default function FinancialConditionForm() {
  const financialCondition = useUserStore((state) => state.financialCondition);
  const setFinancialCondition = useUserStore((state) => state.setFinancialCondition);
  
  const [customIncome, setCustomIncome] = useState('');
  const [showCustomIncome, setShowCustomIncome] = useState(false);
  const [selectedScholarships, setSelectedScholarships] = useState<string[]>([]);

  // Handle income range selection
  const handleIncomeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFinancialCondition({ familyIncome: value });
    setShowCustomIncome(value === 'Other');
    if (value !== 'Other') setCustomIncome('');
  };
  
  // Handle custom income input
  const handleCustomIncome = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomIncome(value);
    if (value.trim()) {
      setFinancialCondition({ familyIncome: value });
    }
  };

  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFinancialCondition({ [name]: checked });
  };
  
  // Handle scholarship selection
  const handleScholarshipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked, id } = e.target;
    
    if (checked) {
      setSelectedScholarships([...selectedScholarships, id]);
    } else {
      setSelectedScholarships(selectedScholarships.filter(item => item !== id));
    }
    
    // Also set the main eligibility flag if any scholarship is selected
    if (!financialCondition.scholarshipEligibility && checked) {
      setFinancialCondition({ scholarshipEligibility: true });
    } else if (selectedScholarships.length === 1 && !checked) {
      setFinancialCondition({ scholarshipEligibility: false });
    }
  };

  return (
    <div className="space-y-8">
      {/* Family Income */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Annual Family Income</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          This information helps us recommend career paths and education options in India that align with your financial situation.
        </p>
        <select
          id="familyIncome"
          name="familyIncome"
          value={incomeRanges.includes(financialCondition.familyIncome) ? financialCondition.familyIncome : 'Other'}
          onChange={handleIncomeChange}
          className="form-input"
        >
          <option value="" disabled>Select income range</option>
          {incomeRanges.map((range) => (
            <option key={range} value={range}>{range}</option>
          ))}
          <option value="Other">Other / Specify custom amount</option>
        </select>
        
        {showCustomIncome && (
          <div className="mt-2">
            <input
              type="text"
              placeholder="Specify your annual family income"
              value={customIncome}
              onChange={handleCustomIncome}
              className="form-input"
            />
          </div>
        )}
      </div>

      {/* Scholarship Information */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Scholarship Eligibility</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Select the scholarship categories you may be eligible for in India.
        </p>
        
        <div className="bg-gray-50 dark:bg-dark-300 rounded-md p-5">
          <div className="flex items-center mb-4">
            <input
              id="scholarshipEligibility"
              name="scholarshipEligibility"
              type="checkbox"
              className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              checked={financialCondition.scholarshipEligibility}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="scholarshipEligibility" className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
              I may be eligible for scholarships or grants
            </label>
          </div>
          
          {financialCondition.scholarshipEligibility && (
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              <p className="mb-2">
                Select the scholarship categories you might be eligible for:
              </p>
              <div className="space-y-2 mt-3">
                {scholarshipCategories.map((category) => (
                  <div key={category.id} className="flex items-center">
                    <input
                      id={category.id}
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      checked={selectedScholarships.includes(category.id)}
                      onChange={handleScholarshipChange}
                    />
                    <label htmlFor={category.id} className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                      {category.label}
                    </label>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p>
                  India offers various scholarship programs at central and state levels. We'll include relevant scholarship information in your career recommendations.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Educational Loan */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Educational Loans</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Indicate if you're willing to consider educational loans for funding your education or career training.
        </p>
        
        <div className="bg-gray-50 dark:bg-dark-300 rounded-md p-5">
          <div className="flex items-center">
            <input
              id="loanWillingness"
              name="loanWillingness"
              type="checkbox"
              className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              checked={financialCondition.loanWillingness}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="loanWillingness" className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
              I am willing to consider educational loans if necessary
            </label>
          </div>
          
          {financialCondition.loanWillingness && (
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              <p className="mb-2">
                In India, several banks and financial institutions offer education loans with:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Lower interest rates for higher education</li>
                <li>Collateral-free loans up to ₹7.5 lakhs</li>
                <li>Interest subsidies for economically weaker sections</li>
                <li>Moratorium period until course completion plus 6-12 months</li>
              </ul>
              <p className="mt-2">
                We'll provide information about career paths where the return on investment typically justifies taking out loans.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900/10 border-l-4 border-yellow-400 p-4 mt-8">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              Your financial information is kept private and is only used to provide relevant career guidance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 