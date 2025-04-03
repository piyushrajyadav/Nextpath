import { GoogleGenerativeAI } from '@google/generative-ai';
import { 
  BasicDetails, 
  AcademicPerformance, 
  InterestsAndSkills, 
  CareerPreferences, 
  FinancialCondition, 
  FuturePlans,
  CareerSuggestion 
} from '../store/userStore';

// Initialize the Google Generative AI with the API key
export const getGeminiClient = () => {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('NEXT_PUBLIC_GEMINI_API_KEY is not defined in environment variables');
  }
  
  return new GoogleGenerativeAI(apiKey);
};

// Function to generate chat responses
export const getGeminiResponse = async (prompt: string): Promise<string> => {
  try {
    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error('Error generating response from Gemini:', error);
    return "I'm sorry, I couldn't generate a response at this time. Please try again later or check your API key configuration.";
  }
};

// Helper function to format user data for prompt
export function formatUserDataForPrompt(
  basicDetails: BasicDetails,
  academicPerformance: AcademicPerformance,
  interestsAndSkills: InterestsAndSkills,
  careerPreferences: CareerPreferences,
  financialCondition: FinancialCondition,
  futurePlans: FuturePlans
): string {
  return `
    ## User Profile for Career Guidance:

    ### Basic Details
    - Name: ${basicDetails.name}
    - Age: ${basicDetails.age}
    - Education Level: ${basicDetails.educationLevel}
    - Field of Study: ${basicDetails.fieldOfStudy}
    - Year of Completion: ${basicDetails.yearOfCompletion}

    ### Academic Performance
    - Subject Marks: ${academicPerformance.subjectMarks.map(sm => `${sm.subject}: ${sm.mark}`).join(', ')}
    - Exam Scores: ${academicPerformance.examScores.map(es => `${es.exam}: ${es.score}`).join(', ')}
    - Favorite Subjects: ${academicPerformance.favoriteSubjects.join(', ')}

    ### Interests & Skills
    - Hobbies: ${interestsAndSkills.hobbies.join(', ')}
    - Key Skills: ${interestsAndSkills.keySkills.join(', ')}
    - Extracurricular Activities: ${interestsAndSkills.extracurriculars.join(', ')}

    ### Career Preferences
    - Preferred Career Path: ${careerPreferences.preferredCareerPath}
    - Preferred Industries: ${careerPreferences.preferredIndustries.join(', ')}
    - Interest in Government Jobs: ${careerPreferences.governmentJobInterest ? 'Yes' : 'No'}
    - Interest in Entrepreneurship: ${careerPreferences.entrepreneurshipInterest ? 'Yes' : 'No'}

    ### Financial Condition
    - Family Income Level: ${financialCondition.familyIncome}
    - Scholarship Eligibility: ${financialCondition.scholarshipEligibility ? 'Yes' : 'No'}
    - Willingness to Take Educational Loans: ${financialCondition.loanWillingness ? 'Yes' : 'No'}

    ### Future Plans
    - Plans for Higher Education: ${futurePlans.higherEducationPlans ? 'Yes' : 'No'}
    - Salary Expectations: ${futurePlans.salaryExpectations}
    - Location Preferences: ${futurePlans.locationPreferences.join(', ')}
  `;
}

// Generate career recommendations based on user data
export async function getCareerRecommendations(
  basicDetails: BasicDetails,
  academicPerformance: AcademicPerformance,
  interestsAndSkills: InterestsAndSkills,
  careerPreferences: CareerPreferences,
  financialCondition: FinancialCondition,
  futurePlans: FuturePlans
): Promise<CareerSuggestion[]> {
  try {
    // Format user data for the prompt
    const userData = formatUserDataForPrompt(
      basicDetails,
      academicPerformance,
      interestsAndSkills,
      careerPreferences,
      financialCondition,
      futurePlans
    );

    // Create the model and generate content
    const model = getGeminiClient().getGenerativeModel({ model: 'gemini-1.5-pro' });

    const prompt = `
      You are an AI career counselor specializing in the Indian job market and education system.
      
      Based on the following user profile, generate 5 personalized career recommendations specifically for the Indian market.
      
      ${userData}
      
      For each career, provide the following information:
      1. Career title
      2. Description - Why this career fits the user's profile
      3. Required skills - Skills needed for this career path
      4. Required education - Education qualifications needed
      5. Salary range in INR - Typical salary ranges in India for this role
      6. Growth potential - Career growth opportunities in the Indian market
      7. Learning resources - Resources to learn more about this career
      8. Match score - A percentage representing how well this matches the user profile
      
      Focus on careers that are currently in-demand in India and align with the user's interests, skills, and educational background.
      Consider Indian market factors like geographical preferences, family income concerns, and specific Indian education pathways.
      
      Return the response as a JSON array of career objects with the structure:
      [
        {
          "id": "unique-id",
          "title": "Career Title",
          "description": "Career description...",
          "requiredSkills": ["skill1", "skill2"...],
          "requiredEducation": ["education1", "education2"...],
          "salaryRange": "₹X-Y LPA",
          "growthPotential": "Growth description...",
          "industries": ["industry1", "industry2"...],
          "learningResources": ["resource1", "resource2"...],
          "matchScore": 95
        },
        ...
      ]
      
      IMPORTANT: Return ONLY a valid JSON array without any additional text or formatting. The response should be parseable using JSON.parse().
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Try to parse the response as JSON directly
    try {
      return JSON.parse(text) as CareerSuggestion[];
    } catch (e) {
      console.error('Failed to parse direct JSON, trying to extract JSON array', e);
      
      // If direct parsing fails, try to extract JSON from the text
      const jsonMatch = text.match(/\[\s*\{[\s\S]*\}\s*\]/);
      if (!jsonMatch) {
        throw new Error('Failed to get valid JSON response from Gemini API');
      }
      
      // Parse the extracted JSON
      try {
        return JSON.parse(jsonMatch[0]) as CareerSuggestion[];
      } catch (extractError) {
        console.error('Failed to parse extracted JSON', extractError);
        throw new Error('Failed to parse JSON response');
      }
    }
  } catch (error) {
    console.error('Error getting career recommendations:', error);
    throw error;
  }
}

// Get answer to specific career question
export const getCareerQuestion = async (question: string): Promise<string> => {
  try {
    const model = getGeminiClient().getGenerativeModel({ model: 'gemini-1.5-pro' });

    let prompt = `As a career guidance expert, please answer this question: "${question}"`;
    
    // Add Indian context to the prompt
    prompt += `\n\nProvide information that is particularly relevant for students and professionals in India.`;
    
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Error getting answer from Gemini:', error);
    return "I'm sorry, I couldn't answer your question at this time. Please try again later.";
  }
}; 