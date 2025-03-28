"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function MembersPage({ params }: { params: { groupId: string } }) {
  const [members, setMembers] = useState<string[]>([]);
  const [memberName, setMemberName] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const addMember = () => {
    if (!memberName.trim()) return;
    setMembers([...members, memberName]);
    setMemberName("");
  };

  const removeMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const copyShareUrl = () => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/select-voter/${params.groupId}`;
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const saveMembers = async () => {
    if (members.length === 0) {
      alert("メンバーを追加してください");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ groupId: params.groupId, members }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      alert(data.error);
      return;
    }

    router.push(`/select-voter/${params.groupId}`);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">メンバー追加</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={memberName}
              onChange={(e) => setMemberName(e.target.value)}
              placeholder="メンバー名"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              onClick={addMember}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              追加
            </button>
          </div>

          {members.length > 0 && (
            <ul className="mb-4 space-y-2">
              {members.map((member, index) => (
                <li key={index} className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-lg group">
                  <span>{member}</span>
                  <button
                    onClick={() => removeMember(index)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500"
                    title="削除"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}

          <button 
            onClick={saveMembers} 
            disabled={loading || members.length === 0}
            className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 mb-4"
          >
            {loading ? "保存中..." : "メンバー確定"}
          </button>

          {members.length > 0 && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600 mb-2">このURLをメンバーに共有してください：</p>
              <button
                onClick={copyShareUrl}
                className="w-full px-4 py-2 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition flex items-center justify-between"
              >
                <span className="text-gray-600 truncate">
                  {typeof window !== 'undefined' ? `${window.location.origin}/select-voter/${params.groupId}` : ''}
                </span>
                <span className="text-blue-600 ml-2">
                  {copied ? '✓ コピーしました' : 'URLをコピー'}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
