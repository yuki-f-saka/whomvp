// src/app/api/results/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// 返ってくるデータの型を定義する
type VoteResult = {
  memberId: string;
  memberName: string;
  points: number;
};

type RpcResponse = {
  results: VoteResult[];
  totalMembers: number;
  votedCount: number;
};


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

  if (!data) {
    // データがnullの場合は、空の結果を返す
    return NextResponse.json({ results: [], totalMembers: 0, votedCount: 0, totalVotes: 0 });
  }

  // dataを上で定義した型として扱う
  const responseData = data as RpcResponse;

  // averagePointsを計算して結果に追加する
  const resultsWithAverage = responseData.results.map((r) => ({
    ...r,
    averagePoints: responseData.votedCount > 0 
      ? (r.points / responseData.votedCount).toFixed(1) 
      : "0.0",
  }));

  const responsePayload = {
    results: resultsWithAverage,
    totalVotes: responseData.votedCount, // totalVotesはvotedCountと同じ
    votedCount: responseData.votedCount,
    totalMembers: responseData.totalMembers,
  };

  return NextResponse.json(responsePayload);
}
