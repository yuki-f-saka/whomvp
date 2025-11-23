import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { PostMemberBody, GetMemberQuery } from "@/lib/schemas";

/**
 * Add multiple members to a group
 * @description グループに複数のメンバーを追加する
 * @tag Members
 * @body PostMemberBody
 * @response 200:PostMemberResponse
 * @responseSet public
 */
export async function POST(req: Request) {
  const body = await req.json();
  
  const validation = PostMemberBody.safeParse(body);
  if (!validation.success) {
    return NextResponse.json({ error: validation.error.flatten() }, { status: 400 });
  }
  
  const { groupId, members } = validation.data;

  const { data, error } = await supabase
    .from("members")
    .insert(members.map((name) => ({ group_id: groupId, name })))
    .select('id');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const memberIds = data?.map(member => member.id) || [];

  return NextResponse.json({ success: true, memberIds });
}

/**
 * Get a list of members for a group with their vote status
 * @description グループのメンバー一覧（投票状況付き）を取得する
 * @tag Members
 * @query GetMemberQuery
 * @response 200:GetMemberResponse
 * @responseSet public
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = Object.fromEntries(searchParams.entries());

  const validation = GetMemberQuery.safeParse(query); // スキーマ名を変更
  if (!validation.success) {
    return NextResponse.json({ error: validation.error.flatten() }, { status: 400 });
  }

  const { groupId } = validation.data;

  const { data, error } = await supabase
    .from("members_with_vote_status")
    .select("id, name, has_voted")
    .eq("group_id", groupId);

  if (error) {
    console.error("Error fetching from view:", error);
    return NextResponse.json({ error: `データベースエラー: ${error.message}` }, { status: 500 });
  }

  const members = data?.map(member => ({
    id: member.id,
    name: member.name,
    hasVoted: member.has_voted
  })) || [];

  return NextResponse.json({ members });
}
