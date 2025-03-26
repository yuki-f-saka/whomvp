"use client";
import { useEffect, useState } from "react";

export default function ResultPage({ params }: { params: { groupId: string } }) {
  const [results, setResults] = useState<{ name: string; votes: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      const res = await fetch(`/api/results?groupId=${params.groupId}`);
      const data = await res.json();
      setResults(data.results);
      setLoading(false);
    };

    fetchResults();
  }, [params.groupId]);

  if (loading) return <p>集計中...</p>;

  return (
    <div>
      <h1>投票結果</h1>
      <ul>
        {results.map((member, index) => (
          <li key={index}>
            🏆 {index + 1}位: {member.name}（{member.votes}票）
          </li>
        ))}
      </ul>
    </div>
  );
}
