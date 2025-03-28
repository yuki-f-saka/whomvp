"use client";
import { useEffect, useState } from "react";

interface Result {
  name: string;
  points: number;
  averagePoints: string;
}

export default function ResultPage({ params }: { params: { groupId: Promise<string> } }) {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [groupId, setGroupId] = useState<string | null>(null);

  // groupIdを非同期で取得
  useEffect(() => {
    const fetchGroupId = async () => {
      const id = await params.groupId;
      setGroupId(id);
    };
    fetchGroupId();
  }, [params.groupId]);

  useEffect(() => {
    if (!groupId) return;

    const fetchResults = async () => {
      try {
        const res = await fetch(`/api/results?groupId=${groupId}`);
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || '結果の取得に失敗しました');
        }
        
        setResults(data.results);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [groupId]);

  if (loading) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="text-xl text-gray-600">集計中...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="text-xl text-red-600">エラー: {error}</div>
      </main>
    );
  }

  if (results.length === 0) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">投票結果</h1>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-center">まだ投票が行われていません</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">投票結果</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <ul className="space-y-4">
            {results.map((member, index) => (
              <li 
                key={index}
                className={`flex items-center justify-between p-4 rounded-lg ${
                  index === 0 ? 'bg-yellow-50' :
                  index === 1 ? 'bg-gray-50' :
                  index === 2 ? 'bg-orange-50' :
                  'bg-white border border-gray-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">
                    {index === 0 ? '🥇' :
                     index === 1 ? '🥈' :
                     index === 2 ? '🥉' :
                     `${index + 1}位`}
                  </span>
                  <span className="font-medium text-gray-800">{member.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">獲得ポイント: {member.points}</div>
                  <div className="text-sm text-gray-500">平均獲得ポイント: {member.averagePoints}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
