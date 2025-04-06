'use client';

import { useState } from 'react';
import useUserStore from '@/app/store/userStore';
import Button from '@/app/results/components/Button';

export default function AcademicPerformanceForm() {
  const academicPerformance = useUserStore((state) => state.academicPerformance);
  const setAcademicPerformance = useUserStore((state) => state.setAcademicPerformance);

  // Local state for adding new degrees/exams
  const [newDegree, setNewDegree] = useState({ degree: '', percentage: '' });
  const [newExam, setNewExam] = useState({ exam: '', score: '' });
  const [newFavoriteSubject, setNewFavoriteSubject] = useState('');
  const [errors, setErrors] = useState({ degree: '', percentage: '', exam: '', score: '', favoriteSubject: '' });

  // Common education degrees in India
  const commonDegrees = [
    '10th Standard',
    '12th Standard',
    'Bachelor\'s Degree',
    'Master\'s Degree',
    'Diploma',
    'Other'
  ];

  // Handle adding a new degree percentage
  const handleAddDegree = () => {
    // Validate inputs
    const newErrors = { ...errors };
    let hasError = false;

    if (!newDegree.degree.trim()) {
      newErrors.degree = 'Degree/Standard is required';
      hasError = true;
    }

    if (!newDegree.percentage.trim()) {
      newErrors.percentage = 'Percentage is required';
      hasError = true;
    } else {
      const percentage = parseFloat(newDegree.percentage);
      if (isNaN(percentage) || percentage < 0 || percentage > 100) {
        newErrors.percentage = 'Percentage must be between 0 and 100';
        hasError = true;
      }
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    // Add the new degree percentage
    const updatedSubjectMarks = [
      ...academicPerformance.subjectMarks,
      { subject: newDegree.degree, mark: parseFloat(newDegree.percentage) }
    ];
    
    setAcademicPerformance({ subjectMarks: updatedSubjectMarks });
    setNewDegree({ degree: '', percentage: '' });
    setErrors({ ...errors, degree: '', percentage: '' });
  };

  // Handle removing a degree
  const handleRemoveSubject = (index: number) => {
    const updatedSubjectMarks = [...academicPerformance.subjectMarks];
    updatedSubjectMarks.splice(index, 1);
    setAcademicPerformance({ subjectMarks: updatedSubjectMarks });
  };

  // Handle adding a new exam score
  const handleAddExam = () => {
    // Validate inputs
    const newErrors = { ...errors };
    let hasError = false;

    if (!newExam.exam.trim()) {
      newErrors.exam = 'Exam name is required';
      hasError = true;
    }

    if (!newExam.score.trim()) {
      newErrors.score = 'Score is required';
      hasError = true;
    } else {
      const score = parseFloat(newExam.score);
      if (isNaN(score) || score < 0 || score > 100) {
        newErrors.score = 'Score must be between 0 and 100';
        hasError = true;
      }
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    // Add the new exam score
    const updatedExamScores = [
      ...academicPerformance.examScores,
      { exam: newExam.exam, score: parseFloat(newExam.score) }
    ];
    
    setAcademicPerformance({ examScores: updatedExamScores });
    setNewExam({ exam: '', score: '' });
    setErrors({ ...errors, exam: '', score: '' });
  };

  // Handle removing an exam score
  const handleRemoveExam = (index: number) => {
    const updatedExamScores = [...academicPerformance.examScores];
    updatedExamScores.splice(index, 1);
    setAcademicPerformance({ examScores: updatedExamScores });
  };

  // Handle adding a favorite subject
  const handleAddFavoriteSubject = () => {
    // Validate input
    if (!newFavoriteSubject.trim()) {
      setErrors({ ...errors, favoriteSubject: 'Subject name is required' });
      return;
    }

    // Add the new favorite subject
    const updatedFavoriteSubjects = [...academicPerformance.favoriteSubjects, newFavoriteSubject];
    setAcademicPerformance({ favoriteSubjects: updatedFavoriteSubjects });
    setNewFavoriteSubject('');
    setErrors({ ...errors, favoriteSubject: '' });
  };

  // Handle removing a favorite subject
  const handleRemoveFavoriteSubject = (index: number) => {
    const updatedFavoriteSubjects = [...academicPerformance.favoriteSubjects];
    updatedFavoriteSubjects.splice(index, 1);
    setAcademicPerformance({ favoriteSubjects: updatedFavoriteSubjects });
  };

  return (
    <div className="space-y-8">
      {/* Past Education Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Past Education Performance</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Add your academic performance for each completed degree or education level.
        </p>
        
        {/* Add new degree mark */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <label htmlFor="degree" className="sr-only">Degree/Standard</label>
            <select
              id="degree"
              value={newDegree.degree}
              onChange={(e) => {
                setNewDegree({ ...newDegree, degree: e.target.value });
                if (errors.degree) setErrors({ ...errors, degree: '' });
              }}
              className="form-select"
            >
              <option value="">Select Degree/Standard</option>
              {commonDegrees.map((degree) => (
                <option key={degree} value={degree}>{degree}</option>
              ))}
            </select>
            {errors.degree && <p className="mt-1 text-sm text-red-600">{errors.degree}</p>}
          </div>
          
          <div className="flex-1">
            <label htmlFor="percentage" className="sr-only">Percentage</label>
            <input
              type="text"
              id="percentage"
              placeholder="Percentage (0-100)"
              value={newDegree.percentage}
              onChange={(e) => {
                setNewDegree({ ...newDegree, percentage: e.target.value });
                if (errors.percentage) setErrors({ ...errors, percentage: '' });
              }}
              className="form-input"
            />
            {errors.percentage && <p className="mt-1 text-sm text-red-600">{errors.percentage}</p>}
          </div>
          
          <Button 
            onClick={handleAddDegree} 
            variant="secondary"
            size="md"
            className="md:w-auto w-full"
          >
            Add Degree
          </Button>
        </div>
        
        {/* List of degree marks */}
        {academicPerformance.subjectMarks.length > 0 ? (
          <div className="bg-gray-50 dark:bg-dark-300 rounded-md p-4">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {academicPerformance.subjectMarks.map((mark, index) => (
                <li key={index} className="py-3 flex justify-between items-center">
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">{mark.subject}</span>
                    <span className="ml-2 text-gray-600 dark:text-gray-300">{mark.mark}%</span>
                  </div>
                  <button
                    onClick={() => handleRemoveSubject(index)}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-sm italic">No education details added yet</p>
        )}
      </div>
      
      {/* Competitive Exam Scores Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Competitive Exam Scores</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Add scores for any competitive exams you&apos;ve taken (JEE, NEET, CAT, GATE, etc.)
        </p>
        
        {/* Add new exam score */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <label htmlFor="exam" className="sr-only">Exam</label>
            <input
              type="text"
              id="exam"
              placeholder="Exam Name (e.g., JEE, NEET)"
              value={newExam.exam}
              onChange={(e) => {
                setNewExam({ ...newExam, exam: e.target.value });
                if (errors.exam) setErrors({ ...errors, exam: '' });
              }}
              className="form-input"
            />
            {errors.exam && <p className="mt-1 text-sm text-red-600">{errors.exam}</p>}
          </div>
          
          <div className="flex-1">
            <label htmlFor="score" className="sr-only">Score</label>
            <input
              type="text"
              id="score"
              placeholder="Score/Percentile (0-100)"
              value={newExam.score}
              onChange={(e) => {
                setNewExam({ ...newExam, score: e.target.value });
                if (errors.score) setErrors({ ...errors, score: '' });
              }}
              className="form-input"
            />
            {errors.score && <p className="mt-1 text-sm text-red-600">{errors.score}</p>}
          </div>
          
          <Button 
            onClick={handleAddExam} 
            variant="secondary"
            size="md"
            className="md:w-auto w-full"
          >
            Add Exam
          </Button>
        </div>
        
        {/* List of exam scores */}
        {academicPerformance.examScores.length > 0 ? (
          <div className="bg-gray-50 dark:bg-dark-300 rounded-md p-4">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {academicPerformance.examScores.map((examScore, index) => (
                <li key={index} className="py-3 flex justify-between items-center">
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">{examScore.exam}</span>
                    <span className="ml-2 text-gray-600 dark:text-gray-300">{examScore.score}%</span>
                  </div>
                  <button
                    onClick={() => handleRemoveExam(index)}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-sm italic">No exam scores added yet</p>
        )}
      </div>
      
      {/* Favorite Subjects Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Favorite Subjects</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Add subjects you enjoy or excel at. This helps us recommend careers that align with your academic interests.
        </p>
        
        {/* Add new favorite subject */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <label htmlFor="favoriteSubject" className="sr-only">Favorite Subject</label>
            <input
              type="text"
              id="favoriteSubject"
              placeholder="Subject Name"
              value={newFavoriteSubject}
              onChange={(e) => {
                setNewFavoriteSubject(e.target.value);
                if (errors.favoriteSubject) setErrors({ ...errors, favoriteSubject: '' });
              }}
              className="form-input"
            />
            {errors.favoriteSubject && <p className="mt-1 text-sm text-red-600">{errors.favoriteSubject}</p>}
          </div>
          
          <Button 
            onClick={handleAddFavoriteSubject} 
            variant="secondary"
            size="md"
            className="md:w-auto w-full"
          >
            Add Subject
          </Button>
        </div>
        
        {/* List of favorite subjects */}
        {academicPerformance.favoriteSubjects.length > 0 ? (
          <div className="flex flex-wrap gap-2 mt-4">
            {academicPerformance.favoriteSubjects.map((subject, index) => (
              <div
                key={index}
                className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full flex items-center"
              >
                <span>{subject}</span>
                <button
                  onClick={() => handleRemoveFavoriteSubject(index)}
                  className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-sm italic">No favorite subjects added yet</p>
        )}
      </div>
    </div>
  );
} 