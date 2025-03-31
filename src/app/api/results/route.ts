// src/app/api/results/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const groupId = searchParams.get("groupId");
  if (!groupId) {
    return NextResponse.json({ error: "グループIDが必要です" }, { status: 400 });
  }

  // 投票データを取得
  const { data: votes, error } = await supabase
    .from("votes")
    .select("ranked_members")
    .eq("group_id", groupId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // メンバーの投票結果を集計
  const voteCounts: Record<string, number> = {};
  const totalVotes = votes.length;

  votes.forEach((vote) => {
    const rankings = vote.ranked_members as { member_id: string; rank: number }[];
    rankings.forEach((ranking) => {
      voteCounts[ranking.member_id] = (voteCounts[ranking.member_id] || 0) + ranking.rank;
    });
  });

  // メンバー情報を取得
  const { data: members, error: memberError } = await supabase
    .from("members")
    .select("id, name")
    .eq("group_id", groupId);

  if (memberError) {
    return NextResponse.json({ error: memberError.message }, { status: 500 });
  }

  if (!members || members.length === 0) {
    return NextResponse.json({ results: [], totalVotes: 0 });
  }

  // 結果をメンバー名と共に返す
  const results = members
    .map((member) => ({
      memberId: member.id,
      memberName: member.name,
      points: voteCounts[member.id] || 0,
      averagePoints: totalVotes > 0 
        ? Number((voteCounts[member.id] || 0) / totalVotes).toFixed(1)
        : "0.0"
    }))
    .sort((a, b) => a.points - b.points);

  return NextResponse.json({ results, totalVotes });
}
