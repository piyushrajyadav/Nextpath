'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FormStepper from '@/app/results/components/FormStepper';
import Button from '@/app/results/components/Button';
import useUserStore from '@/app/store/userStore';
import { motion } from 'framer-motion';

// Form Steps Components
import {
  BasicDetailsForm,
  AcademicPerformanceForm,
  InterestsSkillsForm,
  CareerPreferencesForm,
  FinancialConditionForm,
  FuturePlansForm
} from './index';

// Steps configuration
const steps = [
  {
    label: 'Basic Details',
    description: 'Personal information and educational background',
  },
  {
    label: 'Academic Performance',
    description: 'Subject marks, exam scores, and favorite subjects',
  },
  {
    label: 'Interests & Skills',
    description: 'Hobbies, key skills, and extracurricular activities',
  },
  {
    label: 'Career Preferences',
    description: 'Preferred industries and career paths',
  },
  {
    label: 'Financial Condition',
    description: 'Family income and scholarship eligibility',
  },
  {
    label: 'Future Plans',
    description: 'Higher education plans and salary expectations',
  },
];

export default function AssessmentPage() {
  const router = useRouter();
  const currentStep = useUserStore((state) => state.currentStep);
  const setCurrentStep = useUserStore((state) => state.setCurrentStep);
  const completeAssessment = useUserStore((state) => state.completeAssessment);
  const [isLoading, setIsLoading] = useState(false);

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  // Function to render the correct form based on the current step
  const renderStepForm = () => {
    switch (currentStep) {
      case 1:
        return <BasicDetailsForm />;
      case 2:
        return <AcademicPerformanceForm />;
      case 3:
        return <InterestsSkillsForm />;
      case 4:
        return <CareerPreferencesForm />;
      case 5:
        return <FinancialConditionForm />;
      case 6:
        return <FuturePlansForm />;
      default:
        return <BasicDetailsForm />;
    }
  };

  // Navigate to next step
  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    } else {
      // Final step - submit the form and proceed to results
      handleSubmit();
    }
  };

  // Navigate to previous step
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  // Handle form submission (after the last step)
  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      // Mark assessment as completed
      completeAssessment();
      
      // Redirect to success page after successful submission
      router.push('/user/assessment/success');
    } catch (error) {
      console.error('Error submitting form:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-dark-200 min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Career Assessment
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
              Complete this assessment to get AI-powered career recommendations tailored to your profile.
            </p>
          </div>

          {/* Form Stepper */}
          <FormStepper steps={steps} currentStep={currentStep} />

          {/* Form Container */}
          <motion.div
            className="card mb-8"
            key={currentStep}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {steps[currentStep - 1].label}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {steps[currentStep - 1].description}
              </p>
            </div>

            {/* Current step form */}
            {renderStepForm()}
          </motion.div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1 || isLoading}
            >
              Previous
            </Button>

            <Button
              variant="primary"
              onClick={handleNext}
              isLoading={isLoading}
              icon={
                currentStep === steps.length ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                  </svg>
                )
              }
              iconPosition="right"
            >
              {currentStep === steps.length ? 'Submit' : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 