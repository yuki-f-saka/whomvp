import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { PostVoteBody } from "@/lib/schemas";
import { success } from "zod";

/**
 * Record a vote
 * @description 投票を記録する
 * @tag Votes
 * @body PostVoteBody
 * @response 200:PostVoteResponse
 * @responseSet public
 */
export async function POST(req: Request) {
  const body = await req.json();
  
  const validation = PostVoteBody.safeParse(body);
  if (!validation.success) {
    return NextResponse.json({ error: validation.error.flatten() }, { status: 400 });
  }
  
  const { groupId, rankings, voterId } = validation.data;

  const { error } = await supabase
    .from("votes")
    .insert({
      group_id: groupId,
      voter_id: voterId,
      ranked_members: rankings.map(({ memberId, rank }) => ({
        member_id: memberId,
        rank
      }))
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
