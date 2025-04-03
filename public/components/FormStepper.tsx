'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import useUserStore from '../store/userStore';

interface FormStepperProps {
  steps: { label: string; description: string }[];
  currentStep: number;
}


export default function FormStepper({ steps, currentStep }: FormStepperProps) {
  return (
    <nav aria-label="Progress" className="mb-10">
      <ol className="space-y-4 md:flex md:space-y-0 md:space-x-4">
        {steps.map((step, index) => (
          <li key={step.label} className="md:flex-1">
            <StepItem 
              label={step.label}
              description={step.description}
              status={
                index < currentStep - 1
                  ? 'complete'
                  : index === currentStep - 1
                  ? 'current'
                  : 'upcoming'
              }
              position={index + 1}
              total={steps.length}
            />
          </li>
        ))}
      </ol>
    </nav>
  );
}

type StepStatus = 'complete' | 'current' | 'upcoming';

interface StepItemProps {
  label: string;
  description: string;
  status: StepStatus;
  position: number;
  total: number;
}

function StepItem({ label, description, status, position, total }: StepItemProps) {
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (status === 'current') {
      const timer = setTimeout(() => setAnimateIn(true), 100);
      return () => clearTimeout(timer);
    }
    setAnimateIn(false);
  }, [status]);
  
  return (
    <motion.div 
      className={`group relative flex items-start ${status === 'complete' ? 'hover:bg-gray-50 dark:hover:bg-dark-300' : ''} p-4 rounded-md transition-colors duration-200`}
      animate={
        status === 'current' 
          ? { scale: animateIn ? 1.02 : 1 } 
          : { scale: 1 }
      }
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
    >
      {status !== 'upcoming' && (
        <div className="flex-shrink-0 flex h-9 items-center">
          <span className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full ${
              status === 'complete' 
                ? 'bg-primary-500 group-hover:bg-primary-600' 
                : 'border-2 border-primary-500 bg-white dark:bg-dark-200'
            }`}
          >
            {status === 'complete' ? (
              <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <span className="text-primary-500 font-semibold text-sm">{position}</span>
            )}
          </span>
        </div>
      )}
      
      {status === 'upcoming' && (
        <div className="flex-shrink-0 flex h-9 items-center">
          <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-200">
            <span className="text-gray-500 dark:text-gray-400 font-semibold text-sm">{position}</span>
          </span>
        </div>
      )}
      
      <div className="ml-4 min-w-0 flex-1">
        <div 
          className={`text-sm font-medium ${
            status === 'complete' ? 'text-primary-600 dark:text-primary-400' : 
            status === 'current' ? 'text-gray-900 dark:text-white' : 
            'text-gray-500 dark:text-gray-400'
          }`}
        >
          {label}
          {status === 'complete' && (
            <span className="ml-2 text-xs font-medium text-green-500">Completed</span>
          )}
        </div>
        <p 
          className={`text-sm ${
            status === 'upcoming' 
              ? 'text-gray-500 dark:text-gray-400' 
              : 'text-gray-600 dark:text-gray-300'
          }`}
        >
          {description}
        </p>
      </div>
      
      {position < total && (
        <div 
          className={`absolute top-12 left-4 -ml-px mt-0.5 h-full w-0.5 ${
            status === 'complete' ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-700'
          }`} 
          aria-hidden="true" 
        />
      )}
    </motion.div>
  );
} 