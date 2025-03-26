"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function VotePage({ params }: { params: { groupId: string } }) {
  const [members, setMembers] = useState<{ id: number; name: string }[]>([]);
  const [rankings, setRankings] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Supabaseからメンバー一覧を取得
    const fetchMembers = async () => {
      const res = await fetch(`/api/members?groupId=${params.groupId}`);
      const data = await res.json();
      setMembers(data.members);
      setRankings(Array(data.members.length).fill(0));
    };
    fetchMembers();
  }, [params.groupId]);

  const submitVote = async () => {
    setLoading(true);
    const res = await fetch("/api/votes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ groupId: params.groupId, rankings }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      alert(data.error);
      return;
    }

    // 投票完了後、結果ページへ遷移
    router.push(`/result/${params.groupId}`);
  };

  return (
    <div>
      <h1>投票</h1>
      {members.map((member, index) => (
        <div key={member.id}>
          <span>{member.name}</span>
          <input
            type="number"
            min="1"
            max={members.length}
            value={rankings[index]}
            onChange={(e) => {
              const newRankings = [...rankings];
              newRankings[index] = Number(e.target.value);
              setRankings(newRankings);
            }}
          />
        </div>
      ))}
      <button onClick={submitVote} disabled={loading}>
        {loading ? "投票中..." : "投票する"}
      </button>
    </div>
  );
}
