'use client';

import { useState } from 'react';
import useUserStore from '@/app/store/userStore';
import Button from '@/app/results/components/Button';
import { motion } from 'framer-motion';

// Sample suggestions for each category with India-centric options
const suggestedHobbies = [
  'Reading', 'Writing', 'Drawing', 'Painting', 'Photography', 'Cooking', 'Baking',
  'Gardening', 'Cricket', 'Badminton', 'Chess', 'Carrom', 'Tabla', 'Sitar', 'Harmonium',
  'Bharatanatyam', 'Kathak', 'Yoga', 'Meditation', 'Rangoli Making', 'Mehendi Art',
  'Singing', 'Classical Music', 'Bollywood Dancing', 'Temple Visiting', 'Vedic Mathematics',
  'Sanskrit Learning', 'Ayurveda', 'Blog Writing', 'Poetry', 'Pottery'
];

const suggestedSkills = [
  'Communication', 'Leadership', 'Teamwork', 'Problem Solving', 'Critical Thinking',
  'Creativity', 'Adaptability', 'Time Management', 'Organization', 'Attention to Detail',
  'Research', 'Data Analysis', 'Project Management', 'Public Speaking', 'Negotiation',
  'Decision Making', 'Customer Service', 'Content Writing', 'Video Editing', 'Graphic Design',
  'Web Development', 'Programming', 'Digital Marketing', 'SEO', 'Social Media Management',
  'Teaching', 'Mentoring', 'Fluency in Hindi', 'Fluency in English', 'Fluency in Regional Languages',
  'Accounting', 'MS Office', 'Tally', 'GST Knowledge', 'CAD Design'
];

const suggestedExtracurriculars = [
  'NCC', 'NSS', 'Sports Teams', 'School/College Cultural Festivals', 'Drama/Theater',
  'Music Band/Orchestra', 'College Magazine Committee', 'Annual Day Organizing',
  'Volunteer Work', 'Swachh Bharat Initiatives', 'Tree Plantation Drives',
  'Science Club', 'Math Olympiad', 'Coding Competitions', 'Literary Club',
  'Art Club', 'Dance Competitions', 'Chess Tournaments', 'Youth Parliament',
  'Mock UN', 'Debate Competitions', 'Quiz Club', 'Religious/Cultural Groups',
  'NGO Volunteering', 'Internships', 'Part-time Teaching', 'Community Service'
];

export default function InterestsSkillsForm() {
  const interestsAndSkills = useUserStore((state) => state.interestsAndSkills);
  const setInterestsAndSkills = useUserStore((state) => state.setInterestsAndSkills);

  const [newHobby, setNewHobby] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [newExtracurricular, setNewExtracurricular] = useState('');

  // Suggestion visibility state
  const [showHobbySuggestions, setShowHobbySuggestions] = useState(false);
  const [showSkillSuggestions, setShowSkillSuggestions] = useState(false);
  const [showExtracurrSuggestions, setShowExtracurrSuggestions] = useState(false);

  // Filter suggestions based on input
  const filteredHobbies = newHobby.trim() 
    ? suggestedHobbies.filter(h => h.toLowerCase().includes(newHobby.toLowerCase())) 
    : suggestedHobbies;

  const filteredSkills = newSkill.trim() 
    ? suggestedSkills.filter(s => s.toLowerCase().includes(newSkill.toLowerCase())) 
    : suggestedSkills;

  const filteredExtracurriculars = newExtracurricular.trim() 
    ? suggestedExtracurriculars.filter(e => e.toLowerCase().includes(newExtracurricular.toLowerCase())) 
    : suggestedExtracurriculars;

  // Handle adding a new hobby
  const handleAddHobby = (hobby = newHobby) => {
    const trimmedHobby = hobby.trim();
    
    if (!trimmedHobby) return;
    if (interestsAndSkills.hobbies.includes(trimmedHobby)) return;
    
    setInterestsAndSkills({
      hobbies: [...interestsAndSkills.hobbies, trimmedHobby]
    });
    
    setNewHobby('');
    setShowHobbySuggestions(false);
  };

  // Handle removing a hobby
  const handleRemoveHobby = (index: number) => {
    const updatedHobbies = [...interestsAndSkills.hobbies];
    updatedHobbies.splice(index, 1);
    setInterestsAndSkills({ hobbies: updatedHobbies });
  };

  // Handle adding a new skill
  const handleAddSkill = (skill = newSkill) => {
    const trimmedSkill = skill.trim();
    
    if (!trimmedSkill) return;
    if (interestsAndSkills.keySkills.includes(trimmedSkill)) return;
    
    setInterestsAndSkills({
      keySkills: [...interestsAndSkills.keySkills, trimmedSkill]
    });
    
    setNewSkill('');
    setShowSkillSuggestions(false);
  };

  // Handle removing a skill
  const handleRemoveSkill = (index: number) => {
    const updatedSkills = [...interestsAndSkills.keySkills];
    updatedSkills.splice(index, 1);
    setInterestsAndSkills({ keySkills: updatedSkills });
  };

  // Handle adding a new extracurricular
  const handleAddExtracurricular = (extracurricular = newExtracurricular) => {
    const trimmedExtracurricular = extracurricular.trim();
    
    if (!trimmedExtracurricular) return;
    if (interestsAndSkills.extracurriculars.includes(trimmedExtracurricular)) return;
    
    setInterestsAndSkills({
      extracurriculars: [...interestsAndSkills.extracurriculars, trimmedExtracurricular]
    });
    
    setNewExtracurricular('');
    setShowExtracurrSuggestions(false);
  };

  // Handle removing an extracurricular
  const handleRemoveExtracurricular = (index: number) => {
    const updatedExtracurriculars = [...interestsAndSkills.extracurriculars];
    updatedExtracurriculars.splice(index, 1);
    setInterestsAndSkills({ extracurriculars: updatedExtracurriculars });
  };

  return (
    <div className="space-y-8">
      {/* Hobbies Section */}
      <div className="relative">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Hobbies & Interests</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Select from the suggestions or add your own hobbies and interests
        </p>
        
        {/* Input with suggestions */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Type your hobby or interest"
              value={newHobby}
              onChange={(e) => setNewHobby(e.target.value)}
              onFocus={() => setShowHobbySuggestions(true)}
              className="form-input"
            />
            
            {/* Suggestions dropdown */}
            {showHobbySuggestions && (
              <div className="absolute z-10 w-full mt-1 bg-white dark:bg-dark-200 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
                {filteredHobbies.length > 0 ? (
                  <ul className="py-1">
                    {filteredHobbies.map((hobby, index) => (
                      <li 
                        key={index}
                        className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-300 cursor-pointer"
                        onClick={() => handleAddHobby(hobby)}
                      >
                        {hobby}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">No suggestions found. Type and add your own!</p>
                )}
              </div>
            )}
          </div>
          
          <Button 
            onClick={() => handleAddHobby()} 
            variant="secondary"
            size="md"
            className="md:w-auto w-full"
          >
            Add Hobby
          </Button>
        </div>
        
        {/* Selected hobbies */}
        {interestsAndSkills.hobbies.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {interestsAndSkills.hobbies.map((hobby, index) => (
              <motion.div 
                key={index}
                className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full flex items-center"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <span>{hobby}</span>
                <button
                  onClick={() => handleRemoveHobby(index)}
                  className="ml-2 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-sm italic">No hobbies added yet</p>
        )}
      </div>
      
      {/* Skills Section */}
      <div className="relative">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Key Skills</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Select from the suggestions or add your own skills
        </p>
        
        {/* Input with suggestions */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Type your skill"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onFocus={() => setShowSkillSuggestions(true)}
              className="form-input"
            />
            
            {/* Suggestions dropdown */}
            {showSkillSuggestions && (
              <div className="absolute z-10 w-full mt-1 bg-white dark:bg-dark-200 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
                {filteredSkills.length > 0 ? (
                  <ul className="py-1">
                    {filteredSkills.map((skill, index) => (
                      <li 
                        key={index}
                        className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-300 cursor-pointer"
                        onClick={() => handleAddSkill(skill)}
                      >
                        {skill}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">No suggestions found. Type and add your own!</p>
                )}
              </div>
            )}
          </div>
          
          <Button 
            onClick={() => handleAddSkill()} 
            variant="secondary"
            size="md"
            className="md:w-auto w-full"
          >
            Add Skill
          </Button>
        </div>
        
        {/* Selected skills */}
        {interestsAndSkills.keySkills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {interestsAndSkills.keySkills.map((skill, index) => (
              <motion.div 
                key={index}
                className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-3 py-1 rounded-full flex items-center"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <span>{skill}</span>
                <button
                  onClick={() => handleRemoveSkill(index)}
                  className="ml-2 text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-sm italic">No skills added yet</p>
        )}
      </div>
      
      {/* Extracurricular Activities Section */}
      <div className="relative">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Extracurricular Activities</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Select from the suggestions or add your own activities
        </p>
        
        {/* Input with suggestions */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Type your extracurricular activity"
              value={newExtracurricular}
              onChange={(e) => setNewExtracurricular(e.target.value)}
              onFocus={() => setShowExtracurrSuggestions(true)}
              className="form-input"
            />
            
            {/* Suggestions dropdown */}
            {showExtracurrSuggestions && (
              <div className="absolute z-10 w-full mt-1 bg-white dark:bg-dark-200 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
                {filteredExtracurriculars.length > 0 ? (
                  <ul className="py-1">
                    {filteredExtracurriculars.map((extracurricular, index) => (
                      <li 
                        key={index}
                        className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-300 cursor-pointer"
                        onClick={() => handleAddExtracurricular(extracurricular)}
                      >
                        {extracurricular}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">No suggestions found. Type and add your own!</p>
                )}
              </div>
            )}
          </div>
          
          <Button 
            onClick={() => handleAddExtracurricular()} 
            variant="secondary"
            size="md"
            className="md:w-auto w-full"
          >
            Add Activity
          </Button>
        </div>
        
        {/* Selected extracurricular activities */}
        {interestsAndSkills.extracurriculars.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {interestsAndSkills.extracurriculars.map((activity, index) => (
              <motion.div 
                key={index}
                className="bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full flex items-center"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <span>{activity}</span>
                <button
                  onClick={() => handleRemoveExtracurricular(index)}
                  className="ml-2 text-purple-500 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-sm italic">No extracurricular activities added yet</p>
        )}
      </div>
      
      <div className="text-sm text-gray-500 dark:text-gray-400 mt-8">
        <p className="italic mb-2">
          Tip: Adding details about your interests and skills helps us recommend more personalized career paths in India.
        </p>
        <p>
          Click on the suggestions or add your own - the more specific you are, the better your recommendations will be!
        </p>
      </div>
    </div>
  );
} 