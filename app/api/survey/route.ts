import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const surveyData = await request.json();
    const supabase = createServerSupabaseClient();

    // Get client IP and user agent
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Map the form data to match your database schema
    const mappedData = {
      name: surveyData.name,
      email: surveyData.email || null,
      phone: surveyData.phone || null,
      age: surveyData.age || null,
      visit_frequency: surveyData.visitFrequency || null,
      last_visit: surveyData.lastVisit || null,
      party_size: surveyData.partySize || null,
      occasion: surveyData.occasion || null,
      food_quality: surveyData.foodQuality || null,
      service_quality: surveyData.serviceQuality || null,
      atmosphere: surveyData.atmosphere || null,
      value_for_money: surveyData.valueForMoney || null,
      favorite_items: surveyData.favoriteItems ? JSON.stringify(surveyData.favoriteItems) : null,
      preferred_time: surveyData.preferredTime || null,
      most_liked: surveyData.mostLiked || null,
      improvements: surveyData.improvements || null,
      recommendation: surveyData.recommendation || null,
      additional_comments: surveyData.additionalComments || null,
      hear_about_us: surveyData.hearAboutUs || null,
      newsletter: surveyData.newsletter || false,
      promotions: surveyData.promotions || false,
      language: surveyData.language || 'en',
      ip_address: ip,
      user_agent: userAgent
    };

    const { data: survey, error } = await supabase
      .from('customer_surveys')
      .insert([mappedData])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: survey
    });

  } catch (error) {
    console.error('Error submitting survey:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to submit survey' },
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