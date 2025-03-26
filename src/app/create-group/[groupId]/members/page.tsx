"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function MembersPage({ params }: { params: { groupId: string } }) {
  const [members, setMembers] = useState<string[]>([]);
  const [memberName, setMemberName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const addMember = () => {
    if (!memberName.trim()) return;
    setMembers([...members, memberName]);
    setMemberName("");
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

    // 投票ページに遷移
    router.push(`/vote/${params.groupId}`);
  };

  return (
    <div>
      <h1>メンバー追加</h1>
      <input
        type="text"
        value={memberName}
        onChange={(e) => setMemberName(e.target.value)}
        placeholder="メンバー名"
      />
      <button onClick={addMember}>追加</button>

      <ul>
        {members.map((member, index) => (
          <li key={index}>{member}</li>
        ))}
      </ul>

      <button onClick={saveMembers} disabled={loading}>
        {loading ? "保存中..." : "メンバー確定"}
      </button>
    </div>
  );
}
