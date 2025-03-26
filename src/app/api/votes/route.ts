import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  const { groupId, rankings } = await req.json();

  if (!groupId || !Array.isArray(rankings) || rankings.length === 0) {
    return NextResponse.json({ error: "無効なデータ" }, { status: 400 });
  }

  // 投票データを保存
  const { error } = await supabase
    .from("votes")
    .insert(rankings.map((rank, index) => ({ group_id: groupId, member_id: index, rank })));

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
