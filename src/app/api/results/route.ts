import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { GetResultQuery } from "@/lib/schemas";

// RPCからの応答データの型（内部使用）
type RpcResult = {
  memberId: string;
  memberName: string;
  points: number;
};

type RpcResponse = {
  results: RpcResult[];
  totalMembers: number;
  votedCount: number;
};

/**
 * Get vote results for a specific group
 * @description 指定されたグループの投票結果を取得する
 * @tag Results
 * @query GetResultQuery
 * @response 200:GetResultResponse
 * @responseSet public
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = Object.fromEntries(searchParams.entries());

  const validation = GetResultQuery.safeParse(query); // スキーマ名を変更
  if (!validation.success) {
    return NextResponse.json({ error: validation.error.flatten() }, { status: 400 });
  }

  const { groupId } = validation.data;

  const { data, error } = await supabase.rpc("get_vote_results", {
    p_group_id: groupId,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ results: [], totalMembers: 0, votedCount: 0, totalVotes: 0 });
  }

  const responseData = data as RpcResponse;

  const resultsWithAverage = responseData.results.map((r) => ({
    ...r,
    averagePoints: responseData.votedCount > 0 
      ? (r.points / responseData.votedCount).toFixed(1) 
      : "0.0",
  }));

  const responsePayload = {
    results: resultsWithAverage,
    totalVotes: responseData.votedCount,
    votedCount: responseData.votedCount,
    totalMembers: responseData.totalMembers,
  };

  return NextResponse.json(responsePayload);
}
