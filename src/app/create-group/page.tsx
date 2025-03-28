"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateGroupPage() {
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      alert("グループ名を入力してください");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/groups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: groupName }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      alert(data.error);
      return;
    }

    // グループ作成後、メンバー作成ページへ遷移
    router.push(`/create-group/${data.id}/members`);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">グループ作成</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="グループ名"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          />
          <button
            onClick={handleCreateGroup}
            disabled={loading}
            className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {loading ? "作成中..." : "作成"}
          </button>
        </div>
      </div>
    </main>
  );
}
