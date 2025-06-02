import { NextResponse } from 'next/server';
import { supabase, TABLES } from '@/lib/supabase/config';
import { generateId } from '@/lib/utils';

export async function GET() {
  try {
    const now = new Date().toISOString();
    
    const { data: tagsData, error: tagsError } = await supabase
      .from(TABLES.TAGS)
      .select('id')
      .limit(1);
      
    if (tagsError) {
      return NextResponse.json({
        success: false,
        stage: 'tags_check',
        error: tagsError.message
      }, { status: 500 });
    }
    
    let tagIds: string[] = [];
    if (!tagsData || tagsData.length === 0) {
      const testTags = [
        { id: generateId(), name: 'Test Tag' },
        { id: generateId(), name: 'Sample Tag' }
      ];
      
      const { data: newTags, error: tagError } = await supabase
        .from(TABLES.TAGS)
        .insert(testTags)
        .select();
        
      if (tagError) {
        return NextResponse.json({
          success: false,
          stage: 'tag_create',
          error: tagError.message
        }, { status: 500 });
      }
      
      tagIds = newTags.map(tag => tag.id);
    } else {
      tagIds = [tagsData[0].id];
    }
    
    const template = {
      id: generateId(),
      name: 'Test Template',
      content: 'https://example.com',
      type: 'url',
      tag_ids: tagIds,
      style: {
        backgroundColor: "#FFFFFF",
        foregroundColor: "#000000",
        size: 200,
        level: "M",
        includeMargin: true
      },
      is_template: true,
      created_at: now,
      updated_at: now
    };
    
    const { data: templateData, error: templateError } = await supabase
      .from(TABLES.TEMPLATES)
      .insert(template)
      .select()
      .single();
      
    if (templateError) {
      return NextResponse.json({
        success: false, 
        stage: 'template_create',
        error: templateError.message,
        details: templateError.details,
        hint: templateError.hint,
        template: template
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Test template created successfully.',
      template: templateData
    });
  } catch (error) {
    console.error('Error creating test template:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create test template.',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 