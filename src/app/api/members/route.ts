import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  const { groupId, members } = await req.json();

  if (!groupId || !Array.isArray(members) || members.length === 0) {
    return NextResponse.json({ error: "無効なデータ" }, { status: 400 });
  }

  // メンバーを一括挿入
  const { error } = await supabase
    .from("members")
    .insert(members.map((name) => ({ group_id: groupId, name })));

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
