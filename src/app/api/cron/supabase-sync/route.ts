import { NextResponse } from "next/server";
import { supabase, TABLES } from "@/lib/supabase/config";

export async function GET() {
  try {
    await Promise.all([checkTagsTable(), checkTemplatesTable()]);

    return NextResponse.json({
      success: true,
      message: "Supabase tables checked successfully.",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Supabase sync failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Supabase sync failed.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

async function checkTagsTable() {
  const { error } = await supabase.from(TABLES.TAGS).select("id").limit(1);

  if (error) {
    console.log("Tags table not found, creating...");
    await supabase.rpc("create_tags_table");
  } else {
    console.log("Tags table found, skipping...");
  }
}

async function checkTemplatesTable() {
  const { error } = await supabase.from(TABLES.TEMPLATES).select("id").limit(1);

  if (error) {
    console.log("QR templates table not found, creating...");
    await supabase.rpc("create_qr_templates_table");
  } else {
    console.log("QR templates table found, skipping...");
  }
}
