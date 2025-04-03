import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define the types for our user data
export type BasicDetails = {
  name: string;
  age: number | null;
  educationLevel: string;
  fieldOfStudy: string;
  yearOfCompletion: number | null;
};

export type AcademicPerformance = {
  subjectMarks: { subject: string; mark: number }[];
  examScores: { exam: string; score: number }[];
  favoriteSubjects: string[];
};

export type InterestsAndSkills = {
  hobbies: string[];
  keySkills: string[];
  extracurriculars: string[];
};

export type CareerPreferences = {
  preferredCareerPath: string;
  preferredIndustries: string[];
  governmentJobInterest: boolean;
  entrepreneurshipInterest: boolean;
};

export type FinancialCondition = {
  familyIncome: string;
  scholarshipEligibility: boolean;
  loanWillingness: boolean;
};

export type FuturePlans = {
  higherEducationPlans: boolean;
  salaryExpectations: string;
  locationPreferences: string[];
};

export type CareerSuggestion = {
  id: string;
  title: string;
  description: string;
  matchScore?: number;
  requiredSkills: string[];
  requiredEducation?: string[] | string;
  averageSalary?: string;
  salaryRange?: string;
  growthPotential: string;
  industries?: string[];
  resources?: { title: string; url: string }[];
  learningResources?: string[];
};

export interface User {
  name?: string;
  age?: number;
  educationLevel?: string;
  interests?: string[];
  skills?: string[];
  careerPathPreference?: string;
  preferredIndustries?: string[];
  financialCondition?: {
    income?: string;
    scholarshipEligible?: boolean;
    willConsiderLoans?: boolean;
  };
  futurePlans?: {
    interestedInHigherEducation?: boolean;
    salaryExpectation?: string;
    locationPreferences?: string[];
  };
}

export interface UserState {
  user: User;
  currentStep: number;
  totalSteps: number;
  assessmentCompleted: boolean;
  basicDetails: BasicDetails;
  academicPerformance: AcademicPerformance;
  interestsAndSkills: InterestsAndSkills;
  careerPreferences: CareerPreferences;
  financialCondition: FinancialCondition;
  futurePlans: FuturePlans;
  careerSuggestions: CareerSuggestion[];
  bookmarkedCareers: string[];
  setUser: (user: Partial<User>) => void;
  setCurrentStep: (step: number) => void;
  completeAssessment: () => void;
  setBasicDetails: (details: Partial<BasicDetails>) => void;
  setAcademicPerformance: (academics: Partial<AcademicPerformance>) => void;
  setInterestsAndSkills: (interests: Partial<InterestsAndSkills>) => void;
  setCareerPreferences: (preferences: Partial<CareerPreferences>) => void;
  setFinancialCondition: (financial: Partial<FinancialCondition>) => void;
  setFuturePlans: (plans: Partial<FuturePlans>) => void;
  setCareerSuggestions: (suggestions: CareerSuggestion[]) => void;
  bookmarkCareer: (careerId: string) => void;
  removeBookmark: (careerId: string) => void;
  resetForm: () => void;
  clearCareerSuggestions: () => void;
}

// Create the store
const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: {
        interests: [],
        skills: [],
        preferredIndustries: [],
        financialCondition: {
          scholarshipEligible: false,
          willConsiderLoans: false
        },
        futurePlans: {
          interestedInHigherEducation: false,
          locationPreferences: []
        }
      },
      currentStep: 1,
      totalSteps: 6,
      assessmentCompleted: false,
      basicDetails: {
        name: '',
        age: null,
        educationLevel: '',
        fieldOfStudy: '',
        yearOfCompletion: null,
      },
      academicPerformance: {
        subjectMarks: [],
        examScores: [],
        favoriteSubjects: [],
      },
      interestsAndSkills: {
        hobbies: [],
        keySkills: [],
        extracurriculars: [],
      },
      careerPreferences: {
        preferredCareerPath: '',
        preferredIndustries: [],
        governmentJobInterest: false,
        entrepreneurshipInterest: false,
      },
      financialCondition: {
        familyIncome: '',
        scholarshipEligibility: false,
        loanWillingness: false,
      },
      futurePlans: {
        higherEducationPlans: false,
        salaryExpectations: '',
        locationPreferences: [],
      },
      careerSuggestions: [],
      bookmarkedCareers: [],
      setUser: (userData) => set((state) => ({ 
        user: { ...state.user, ...userData } 
      })),
      setCurrentStep: (step) => set({ currentStep: step }),
      completeAssessment: () => set({ assessmentCompleted: true }),
      setBasicDetails: (details) => 
        set((state) => ({ 
          basicDetails: { ...state.basicDetails, ...details } 
        })),
      setAcademicPerformance: (academics) => 
        set((state) => ({ 
          academicPerformance: { ...state.academicPerformance, ...academics } 
        })),
      setInterestsAndSkills: (interests) => 
        set((state) => ({ 
          interestsAndSkills: { ...state.interestsAndSkills, ...interests } 
        })),
      setCareerPreferences: (preferences) => 
        set((state) => ({ 
          careerPreferences: { ...state.careerPreferences, ...preferences } 
        })),
      setFinancialCondition: (financial) => 
        set((state) => ({ 
          financialCondition: { ...state.financialCondition, ...financial } 
        })),
      setFuturePlans: (plans) => 
        set((state) => ({ 
          futurePlans: { ...state.futurePlans, ...plans } 
        })),
      setCareerSuggestions: (suggestions) => 
        set({ careerSuggestions: suggestions }),
      clearCareerSuggestions: () => 
        set({ careerSuggestions: [] }),
      bookmarkCareer: (careerId) => 
        set((state) => ({ 
          bookmarkedCareers: [...state.bookmarkedCareers, careerId] 
        })),
      removeBookmark: (careerId) => 
        set((state) => ({ 
          bookmarkedCareers: state.bookmarkedCareers.filter(id => id !== careerId) 
        })),
      resetForm: () => set({
        currentStep: 1,
        basicDetails: {
          name: '',
          age: null,
          educationLevel: '',
          fieldOfStudy: '',
          yearOfCompletion: null,
        },
        academicPerformance: {
          subjectMarks: [],
          examScores: [],
          favoriteSubjects: [],
        },
        interestsAndSkills: {
          hobbies: [],
          keySkills: [],
          extracurriculars: [],
        },
        careerPreferences: {
          preferredCareerPath: '',
          preferredIndustries: [],
          governmentJobInterest: false,
          entrepreneurshipInterest: false,
        },
        financialCondition: {
          familyIncome: '',
          scholarshipEligibility: false,
          loanWillingness: false,
        },
        futurePlans: {
          higherEducationPlans: false,
          salaryExpectations: '',
          locationPreferences: [],
        },
        careerSuggestions: [],
      }),
    }),
    {
      name: 'career-guidance-storage',
      // Exclude career suggestions from persistence
      partialize: (state) => Object.fromEntries(
        Object.entries(state).filter(([key]) => key !== 'careerSuggestions')
      ),
    }
  )
);

export default useUserStore; 