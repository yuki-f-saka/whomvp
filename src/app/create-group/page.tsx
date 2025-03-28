"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from '../styles/create-group.module.css';
import common from '../styles/common.module.css';

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

    router.push(`/create-group/${data.groupId}/members`);
  };

  return (
    <main className={common.container}>
      <div className={common.card}>
        <h1 className={common.title}>グループ作成</h1>
        <div className={common.cardContent}>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="グループ名"
            className={styles.inputField}
          />
          <button
            onClick={handleCreateGroup}
            disabled={loading}
            className={`${common.button} ${loading ? common.buttonPrimaryDisabled : common.buttonPrimary}`}
          >
            {loading ? "作成中..." : "作成"}
          </button>
        </div>
      </div>
    </main>
  );
}
