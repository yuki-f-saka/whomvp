// src/app/api/results/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const groupId = searchParams.get("groupId");

  if (!groupId) {
    return NextResponse.json({ error: "グループIDが必要です" }, { status: 400 });
  }

  // RPCを呼び出す
  const { data, error } = await supabase.rpc("get_vote_results", {
    p_group_id: groupId,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // RPCからの結果データ (data) には、results, totalMembers, votedCount が含まれる
  // averagePointsを計算して結果に追加する
  const resultsWithAverage = data.results.map((r: any) => ({
    ...r,
    averagePoints: data.votedCount > 0 
      ? (r.points / data.votedCount).toFixed(1) 
      : "0.0",
  }));

  const responsePayload = {
    results: resultsWithAverage,
    totalVotes: data.votedCount, // totalVotesはvotedCountと同じ
    votedCount: data.votedCount,
    totalMembers: data.totalMembers,
  };

  return NextResponse.json(responsePayload);
}