import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { PostGroupBody } from "@/lib/schemas";

/**
 * Create a new group
 * @description 新しいグループを作成する
 * @tag Groups
 * @body PostGroupBody
 * @response 200:PostGroupResponse
 * @responseSet public
 */
export async function POST(req: Request) {
  const body = await req.json();
  
  // Zodでのバリデーション
  const validation = PostGroupBody.safeParse(body);
  if (!validation.success) {
    return NextResponse.json({ error: validation.error.flatten() }, { status: 400 });
  }
  
  const { name } = validation.data;

  const { data, error } = await supabase.from("groups").insert([{ name }]).select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data || data.length === 0) {
    return NextResponse.json({ error: "グループの作成に失敗しました" }, { status: 500 });
  }

  return NextResponse.json({ 
      groupId: data[0].id,
      name: data[0].name 
  });
}
