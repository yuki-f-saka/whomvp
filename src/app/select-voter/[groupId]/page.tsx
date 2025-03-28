"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SelectVoterPage({ params }: { params: { groupId: Promise<string> } }) {
  const [members, setMembers] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [groupId, setGroupId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchGroupId = async () => {
      const id = await params.groupId;
      setGroupId(id);
    };
    fetchGroupId();
  }, [params.groupId]);

  useEffect(() => {
    if (!groupId) return;

    const fetchMembers = async () => {
      try {
        const res = await fetch(`/api/members?groupId=${groupId}`);
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || 'メンバー情報の取得に失敗しました');
        }
        
        setMembers(data.members);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [groupId]);

  const selectVoter = (voterId: string) => {
    router.push(`/vote/${groupId}?voterId=${voterId}`);
  };

  const copyShareUrl = () => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/select-voter/${groupId}`;
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="text-xl text-gray-600">読み込み中...</div>
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

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">投票者の選択</h1>
        
        {/* 共有URL */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-600 mb-2">このページを他のメンバーと共有してください：</p>
          <button
            onClick={copyShareUrl}
            className="w-full px-4 py-2 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition flex items-center justify-between"
          >
            <span className="text-gray-600 truncate">
              {typeof window !== 'undefined' ? `${window.location.origin}/select-voter/${groupId}` : ''}
            </span>
            <span className="text-blue-600 ml-2">
              {copied ? '✓ コピーしました' : 'URLをコピー'}
            </span>
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 mb-4">投票を行うメンバーを選択してください</p>
          <ul className="space-y-2">
            {members.map((member) => (
              <li key={member.id}>
                <button
                  onClick={() => selectVoter(member.id)}
                  className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
                >
                  {member.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}