"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function VoteCompletePage({ params }: { params: { groupId: Promise<string> } }) {
  const router = useRouter();
  const [groupId, setGroupId] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroupId = async () => {
      const id = await params.groupId;
      setGroupId(id);
    };
    fetchGroupId();
  }, [params.groupId]);

  const viewResults = () => {
    if (groupId) {
      router.push(`/result/${groupId}`);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">投票完了</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-center mb-6">投票が完了しました。ご協力ありがとうございます。</p>
          <button 
            onClick={viewResults}
            className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            結果を見る
          </button>
        </div>
      </div>
    </main>
  );
}