import { z } from 'zod';

// Group API
export const PostGroupBody = z.object({
  name: z.string().min(1, { message: "グループ名を入力してください" }),
});

export const PostGroupResponse = z.object({
  groupId: z.string().uuid(),
  name: z.string(),
});

// Member API (Add)
export const PostMemberBody = z.object({
  groupId: z.string().uuid({ message: "無効なグループIDです" }),
  members: z.array(z.string().min(1, { message: "メンバー名を入力してください" })).min(1, { message: "少なくとも1人のメンバーが必要です" }),
});

export const PostMemberResponse = z.object({
  success: z.boolean(),
  memberIds: z.array(z.string().uuid()),
});

// Member API (List)
export const GetMemberQuery = z.object({
  groupId: z.string().uuid({ message: "無効なグループIDです" }),
});

export const GetMemberResponse = z.object({
  members: z.array(
    z.object({
      id: z.string().uuid(),
      name: z.string(),
      hasVoted: z.boolean(),
    })
  ),
});

// Result API (Get)
export const GetResultQuery = z.object({
  groupId: z.string().uuid({ message: "無効なグループIDです" }),
});

export const GetResultResponse = z.object({
  results: z.array(
    z.object({
      memberId: z.string(),
      memberName: z.string(),
      points: z.number(),
      averagePoints: z.string(),
    })
  ),
  totalVotes: z.number(),
  votedCount: z.number(),
  totalMembers: z.number(),
});

// Vote API (Post)
export const PostVoteBody = z.object({
  groupId: z.string().uuid({ message: "無効なグループIDです" }),
  voterId: z.string().uuid({ message: "無効な投票者IDです" }),
  rankings: z.array(
    z.object({
      memberId: z.string().uuid({ message: "無効なメンバーIDです" }),
      rank: z.number().int().min(1, { message: "ランクは1以上でなければなりません" }),
    })
  ).min(1, { message: "少なくとも1つのランキングが必要です" }),
});

export const PostVoteResponse = z.object({
  success: z.boolean(),
});