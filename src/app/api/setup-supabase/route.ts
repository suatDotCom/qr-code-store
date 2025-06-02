import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/config';

export async function GET() {
  try {
    // if exist setup_database function on supabase, it will be called.
    const { error: createTablesError } = await supabase.rpc('setup_database');

    if (createTablesError) {
      console.error('Tables creation error:', createTablesError);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Tables creation failed.', 
          details: createTablesError.message 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Tables created successfully.',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error during Supabase setup:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Supabase setup failed.',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 