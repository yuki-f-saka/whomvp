import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  const { groupId, members } = await req.json();

  if (!groupId || !Array.isArray(members) || members.length === 0) {
    return NextResponse.json({ error: "無効なデータ" }, { status: 400 });
  }

  // メンバーを一括挿入
  const { data, error } = await supabase
    .from("members")
    .insert(members.map((name) => ({ group_id: groupId, name })))
    .select('id');  // 挿入したメンバーのIDを取得

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const memberIds = data?.map(member => member.id) || [];

  return NextResponse.json({ success: true, memberIds });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const groupId = searchParams.get('groupId');

  if (!groupId) {
    return NextResponse.json({ error: "グループIDが必要です" }, { status: 400 });
  }

  // 新しく作成したビューからメンバー情報と投票ステータスを一度に取得
  const { data, error } = await supabase
    .from("members_with_vote_status")
    .select("id, name, has_voted")
    .eq("group_id", groupId);

  if (error) {
    // ビューが存在しない、または権限がない場合のエラーハンドリング
    // SupabaseのRLS(Row Level Security)でビューへのアクセス許可が必要な場合があります
    console.error("Error fetching from view:", error);
    return NextResponse.json({ error: `データベースエラー: ${error.message}` }, { status: 500 });
  }

  // フロントエンドが期待するキャメルケース(hasVoted)に変換
  const members = data?.map(member => ({
    id: member.id,
    name: member.name,
    hasVoted: member.has_voted
  })) || [];

  return NextResponse.json({ members });
}
