// src/app/api/results/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const groupId = searchParams.get("groupId");
  if (!groupId) {
    return NextResponse.json({ error: "グループIDが必要です" }, { status: 400 });
  }

  // 投票数を集計
  const { data, error } = await supabase
    .from("votes")
    .select("member_id, rank")
    .eq("group_id", groupId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // メンバーの投票結果を集計
  const voteCounts: Record<number, number> = {};
  data.forEach((vote) => {
    voteCounts[vote.member_id] = (voteCounts[vote.member_id] || 0) + (10 - vote.rank); // 順位が高いほどスコアが高くなる
  });

  // メンバー情報を取得
  const { data: members, error: memberError } = await supabase
    .from("members")
    .select("id, name")
    .eq("group_id", groupId);

  if (memberError) {
    return NextResponse.json({ error: memberError.message }, { status: 500 });
  }

  // 結果をメンバー名と共に返す
  const results = members
    .map((member) => ({
      name: member.name,
      votes: voteCounts[member.id] || 0,
    }))
    .sort((a, b) => b.votes - a.votes); // 得票数順にソート

  return NextResponse.json({ results });
}
