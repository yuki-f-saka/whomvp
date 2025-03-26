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
    <div>
      <h1>グループ作成</h1>
      <input
        type="text"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        placeholder="グループ名"
      />
      <button onClick={handleCreateGroup} disabled={loading}>
        {loading ? "作成中..." : "作成"}
      </button>
    </div>
  );
}
