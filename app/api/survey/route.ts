import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const body = await request.json();
    
    // Get client IP and user agent for analytics
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Prepare data for database insertion
    const surveyData = {
      // Personal Information
      name: body.name?.trim() || null,
      email: body.email?.trim() || null,
      phone: body.phone?.trim() || null,
      age: body.age || null,
      
      // Visit Information
      visit_frequency: body.visitFrequency || null,
      last_visit: body.lastVisit || null,
      party_size: body.partySize || null,
      occasion: body.occasion || null,
      
      // Ratings (convert 0 to null for database)
      food_quality: body.foodQuality || null,
      service_quality: body.serviceQuality || null,
      atmosphere: body.atmosphere || null,
      value_for_money: body.valueForMoney || null,
      
      // Preferences
      favorite_items: body.favoriteItems || [],
      preferred_time: body.preferredTime || null,
      
      // Feedback
      most_liked: body.mostLiked?.trim() || null,
      improvements: body.improvements?.trim() || null,
      recommendation: body.recommendation || null,
      additional_comments: body.additionalComments?.trim() || null,
      
      // Marketing
      hear_about_us: body.hearAboutUs || null,
      newsletter: body.newsletter || false,
      promotions: body.promotions || false,
      
      // Metadata
      language: body.language || 'en',
      ip_address: ip,
      user_agent: userAgent
    };

    // Insert into database
    const { data, error } = await supabase
      .from('customer_surveys')
      .insert([surveyData])
      .select('id')
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to save survey response' 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: data.id,
        message: 'Survey response saved successfully'
      }
    });

  } catch (error) {
    console.error('Survey submission error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint to retrieve survey statistics
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language') || 'en';

    // Get basic statistics
    const { data: stats, error } = await supabase
      .from('customer_surveys')
      .select(`
        id,
        food_quality,
        service_quality,
        atmosphere,
        value_for_money,
        recommendation,
        visit_frequency,
        submitted_at
      `)
      .eq('language', language)
      .order('submitted_at', { ascending: false })
      .limit(100);

    if (error) {
      throw error;
    }

    // Calculate averages
    const totalResponses = stats.length;
    const averages = {
      food_quality: stats.filter(s => s.food_quality).reduce((sum, s) => sum + s.food_quality, 0) / stats.filter(s => s.food_quality).length || 0,
      service_quality: stats.filter(s => s.service_quality).reduce((sum, s) => sum + s.service_quality, 0) / stats.filter(s => s.service_quality).length || 0,
      atmosphere: stats.filter(s => s.atmosphere).reduce((sum, s) => sum + s.atmosphere, 0) / stats.filter(s => s.atmosphere).length || 0,
      value_for_money: stats.filter(s => s.value_for_money).reduce((sum, s) => sum + s.value_for_money, 0) / stats.filter(s => s.value_for_money).length || 0,
      recommendation: stats.filter(s => s.recommendation).reduce((sum, s) => sum + s.recommendation, 0) / stats.filter(s => s.recommendation).length || 0,
    };

    return NextResponse.json({
      success: true,
      data: {
        totalResponses,
        averages,
        recentResponses: stats.slice(0, 10)
      }
    });

  } catch (error) {
    console.error('Survey stats error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch survey statistics' 
      },
      { status: 500 }
    );
  }
}