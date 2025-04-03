import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
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
const getAIClient = () => {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('Google Generative AI API key is not defined. Please add it to your .env.local file.');
  }
  
  return new GoogleGenerativeAI(apiKey);
};

// Configure safety settings
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

// Format the user profile data for the prompt
const formatUserProfile = (
  basicDetails: BasicDetails,
  academicPerformance: AcademicPerformance,
  interestsAndSkills: InterestsAndSkills,
  careerPreferences: CareerPreferences,
  financialCondition: FinancialCondition,
  futurePlans: FuturePlans
) => {
  return `
  User profile:
  - Name: ${basicDetails.name || 'Not provided'}
  - Age: ${basicDetails.age || 'Not provided'}
  - Education Level: ${basicDetails.educationLevel || 'Not provided'}
  - Field of Study: ${basicDetails.fieldOfStudy || 'Not provided'}
  - Year of Completion: ${basicDetails.yearOfCompletion || 'Not provided'}
  
  - Academic Performance:
    - Subject Marks: ${academicPerformance.subjectMarks.map(s => `${s.subject}: ${s.mark}%`).join(', ') || 'None provided'}
    - Exam Scores: ${academicPerformance.examScores.map(e => `${e.exam}: ${e.score}%`).join(', ') || 'None provided'}
    - Favorite Subjects: ${academicPerformance.favoriteSubjects.join(', ') || 'None provided'}
  
  - Interests & Skills:
    - Hobbies: ${interestsAndSkills.hobbies.join(', ') || 'None provided'}
    - Key Skills: ${interestsAndSkills.keySkills.join(', ') || 'None provided'}
    - Extracurricular Activities: ${interestsAndSkills.extracurriculars.join(', ') || 'None provided'}
  
  - Career Preferences:
    - Preferred Career Path: ${careerPreferences.preferredCareerPath || 'Not specified'}
    - Preferred Industries: ${careerPreferences.preferredIndustries.join(', ') || 'None specified'}
    - Interest in Government Jobs: ${careerPreferences.governmentJobInterest ? 'Yes' : 'No'}
    - Interest in Entrepreneurship: ${careerPreferences.entrepreneurshipInterest ? 'Yes' : 'No'}
  
  - Financial Condition:
    - Family Income: ${financialCondition.familyIncome || 'Not provided'}
    - Scholarship Eligibility: ${financialCondition.scholarshipEligibility ? 'Yes' : 'No'}
    - Willingness to Take Educational Loans: ${financialCondition.loanWillingness ? 'Yes' : 'No'}
  
  - Future Plans:
    - Plans for Higher Education: ${futurePlans.higherEducationPlans ? 'Yes' : 'No'}
    - Salary Expectations: ${futurePlans.salaryExpectations || 'Not specified'}
    - Location Preferences: ${futurePlans.locationPreferences.join(', ') || 'None specified'}
  `;
};

// Generate AI-powered career recommendations
export const generateCareerRecommendations = async (
  basicDetails: BasicDetails,
  academicPerformance: AcademicPerformance,
  interestsAndSkills: InterestsAndSkills,
  careerPreferences: CareerPreferences,
  financialCondition: FinancialCondition,
  futurePlans: FuturePlans
): Promise<CareerSuggestion[]> => {
  try {
    const genAI = getAIClient();
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-pro',
      safetySettings,
    });

    // Format user profile
    const userProfile = formatUserProfile(
      basicDetails,
      academicPerformance,
      interestsAndSkills,
      careerPreferences,
      financialCondition,
      futurePlans
    );

    const prompt = `
      I want you to act as a career guidance expert specifically for Indian students and job seekers.
      
      Based on the following user profile, provide 5 personalized career recommendations 
      that are relevant and viable in the Indian job market. For each career recommendation, include:
      
      1. Career title - job roles that exist in India
      2. Brief description - explain why this matches the user's profile
      3. Required skills - be specific about skills valued in the Indian market
      4. Required education/qualifications - include Indian degrees, exams, and certifications
      5. Salary range - provide realistic figures in Indian Rupees (₹)
      6. Growth potential - specific to the Indian job market
      7. Learning resources - include Indian platforms, universities, and courses

      ${userProfile}

      Important instructions:
      1. Focus ONLY on careers that are in-demand and viable in INDIA.
      2. Include both traditional and emerging career paths in the Indian context.
      3. Consider opportunities in government sectors, PSUs, private companies, and entrepreneurship.
      4. Be realistic about qualifications required in the Indian education system.
      5. Provide salary ranges that are current and accurate for the Indian job market.
      6. Suggest Indian educational institutions, courses, and certifications where applicable.
      7. Consider location preferences within India when making recommendations.
      8. Include a match score (percentage between 60-100) indicating how well this career matches the user's profile.

      Format the response as a JSON array where each career recommendation is an object with the properties: 
      id, title, description, matchScore, requiredSkills (array), requiredEducation (array), salaryRange, growthPotential, industries (array), and learningResources (array).
      ONLY return the JSON array with NO additional text.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    try {
      // Clean the text to ensure it's proper JSON
      const text = response.text().trim();
      const jsonStartIndex = text.indexOf('[');
      const jsonEndIndex = text.lastIndexOf(']') + 1;
      
      if (jsonStartIndex >= 0 && jsonEndIndex > jsonStartIndex) {
        const jsonStr = text.substring(jsonStartIndex, jsonEndIndex);
        return JSON.parse(jsonStr);
      } else {
        throw new Error('Invalid JSON format in the response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      // Fallback to mock data if JSON parsing fails
      return getMockCareerRecommendations();
    }
  } catch (error) {
    console.error('Error generating career recommendations:', error);
    // Return mock data in case of any error
    return getMockCareerRecommendations();
  }
};

// Get answer to a specific career question
export const getCareerAnswer = async (question: string): Promise<string> => {
  try {
    const genAI = getAIClient();
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-pro',
      safetySettings,
    });

    const prompt = `
      You are a career guidance expert specializing in the Indian education system and job market.
      Answer the following career-related question concisely (within 150 words) but helpfully:
      
      "${question}"
      
      Focus on providing information relevant to Indian students and professionals.
      Include specific details about Indian educational pathways, job opportunities, or career growth when applicable.
      If the question is not related to careers or education, politely redirect the conversation to career topics.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error getting answer from AI:', error);
    return "I'm sorry, I couldn't process your request at the moment. Please try again later.";
  }
};

// Mock data for testing or when API is unavailable - India-centric
export const getMockCareerRecommendations = (): CareerSuggestion[] => {
  return [
    {
      id: "software-engineer",
      title: "Software Developer",
      description: "Software development is a high-growth field in India with excellent salary potential and diverse opportunities across startups, tech giants, and IT service companies.",
      matchScore: 92,
      requiredSkills: ["Coding", "Problem Solving", "Data Structures", "Algorithms", "Software Design"],
      requiredEducation: ["B.Tech/B.E in Computer Science", "MCA", "Other technical degree with coding skills"],
      salaryRange: "₹5-40 LPA",
      growthPotential: "Excellent growth with paths to tech lead, architect, or management roles. Remote work opportunities.",
      industries: ["IT Services", "Product Companies", "Startups", "E-commerce"],
      learningResources: ["FreeCodeCamp", "Coursera Programming Courses", "GeeksForGeeks", "DSA practice on LeetCode"]
    },
    {
      id: "data-scientist",
      title: "Data Scientist",
      description: "Data Science combines statistics, programming, and domain knowledge to extract insights from data, a rapidly growing field in India with applications across industries.",
      matchScore: 88,
      requiredSkills: ["Statistics", "Python/R Programming", "Machine Learning", "Data Analysis", "SQL"],
      requiredEducation: ["Degree in Statistics/Math/CS/Engineering", "Certifications in Data Science"],
      salaryRange: "₹6-30 LPA",
      growthPotential: "High demand across sectors with paths to specialization in ML engineering, AI research, or analytics leadership.",
      industries: ["IT", "Banking", "E-commerce", "Healthcare", "Consulting"],
      learningResources: ["Andrew Ng's Machine Learning Course", "Kaggle Competitions", "IIT-M Data Science Program"]
    },
    {
      id: "government-services",
      title: "Government Services",
      description: "Government jobs in India offer stability, good benefits, and the opportunity to make a social impact, with various entry points through competitive exams.",
      matchScore: 85,
      requiredSkills: ["Analytical Skills", "General Knowledge", "Time Management", "Communication"],
      requiredEducation: ["Bachelor's Degree (Minimum)", "Specific requirements vary by service"],
      salaryRange: "₹5-15 LPA (plus benefits)",
      growthPotential: "Structured promotion path based on seniority and performance. Long-term job security.",
      industries: ["Civil Services", "Banking", "Defense", "Public Sector Undertakings"],
      learningResources: ["UPSC preparation resources", "Previous year question papers", "Online coaching platforms"]
    },
    {
      id: "chartered-accountant",
      title: "Chartered Accountant",
      description: "Chartered Accountancy is a respected profession in India with strong demand in all business sectors, offering financial expertise and consulting opportunities.",
      matchScore: 79,
      requiredSkills: ["Accounting", "Taxation Knowledge", "Financial Analysis", "Attention to Detail"],
      requiredEducation: ["Commerce Background", "CA Certification from ICAI (3 levels)"],
      salaryRange: "₹7-25 LPA",
      growthPotential: "Opportunities in corporate finance, independent practice, consulting, or financial leadership roles.",
      industries: ["Accounting Firms", "Banking", "Corporate Finance", "Consulting"],
      learningResources: ["ICAI Study Materials", "CA Coaching Institutes", "Online CA Forums"]
    },
    {
      id: "digital-marketing",
      title: "Digital Marketing Specialist",
      description: "Digital marketing is booming in India with the digital transformation of businesses, offering creative opportunities with technical aspects.",
      matchScore: 76,
      requiredSkills: ["SEO/SEM", "Social Media Marketing", "Content Creation", "Analytics", "Creative Thinking"],
      requiredEducation: ["Any Bachelor's Degree", "Digital Marketing Certifications"],
      salaryRange: "₹3-18 LPA",
      growthPotential: "Growth into specialized roles (SEO, content, social) or marketing management. Good for entrepreneurial individuals.",
      industries: ["Marketing Agencies", "E-commerce", "Startups", "Media Companies"],
      learningResources: ["Google Digital Garage", "HubSpot Academy", "Digital Marketing Courses on Udemy/Coursera"]
    }
  ];
}; 