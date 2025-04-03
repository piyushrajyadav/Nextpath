import { NextRequest, NextResponse } from 'next/server';
import { generateCareerRecommendations, getMockCareerRecommendations } from '@/app/utils/ai';

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json();
    
    // Check if required user data is present
    if (!userData) {
      return NextResponse.json(
        { error: 'User data is required' },
        { status: 400 }
      );
    }

    // Check for API key
    const hasApiKey = !!process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    
    let recommendations;
    
    if (hasApiKey) {
      // Generate recommendations using AI
      recommendations = await generateCareerRecommendations(userData);
    } else {
      // Use mock data if API key is not present
      console.warn('No Gemini API key found. Using mock recommendations.');
      recommendations = getMockCareerRecommendations();
    }

    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
} 