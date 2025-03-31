"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from '../../../styles/members.module.css';
import common from '../../../styles/common.module.css';

type PageProps = {
  params: Promise<{
    groupId: string;
  }>;
};

export default function MembersPage({ params }: PageProps) {
  const [members, setMembers] = useState<string[]>([]);
  const [memberName, setMemberName] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [groupId, setGroupId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchGroupId = async () => {
      const resolvedParams = await params;
      setGroupId(resolvedParams.groupId);
    };
    fetchGroupId();
  }, [params]);

  const addMember = () => {
    if (!memberName.trim()) return;
    setMembers([...members, memberName]);
    setMemberName("");
  };

  const removeMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const copyShareUrl = () => {
    if (typeof window !== 'undefined' && groupId) {
      const url = `${window.location.origin}/select-voter/${groupId}`;
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const saveMembers = async () => {
    if (!groupId) return;
    if (members.length === 0) {
      alert("メンバーを追加してください");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ groupId, members }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      alert(data.error);
      return;
    }

    router.push(`/select-voter/${groupId}`);
  };

  return (
    <main className={common.container}>
      <div className={common.card}>
        <h1 className={common.title}>メンバー追加</h1>
        <div className={common.cardContent}>
          <div className={styles.inputContainer}>
            <input
              type="text"
              value={memberName}
              onChange={(e) => setMemberName(e.target.value)}
              placeholder="メンバー名"
              className={`${common.input} ${styles.inputField}`}
            />
            <button 
              onClick={addMember}
              className={`${common.button} ${common.buttonSecondary}`}
            >
              追加
            </button>
          </div>

          {members.length > 0 && (
            <ul className={styles.memberList}>
              {members.map((member, index) => (
                <li key={index} className={styles.memberItem}>
                  <span>{member}</span>
                  <button
                    onClick={() => removeMember(index)}
                    className={styles.deleteButton}
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
            className={`${common.button} ${loading ? common.buttonPrimaryDisabled : common.buttonPrimary} mb-4`}
          >
            {loading ? "保存中..." : "メンバー確定"}
          </button>

          {members.length > 0 && (
            <div className={styles.shareUrlContainer}>
              <p className={styles.shareUrlText}>このURLをメンバーに共有してください：</p>
              <button
                onClick={copyShareUrl}
                className={styles.shareUrlButton}
              >
                <span className={styles.copyText}>
                  {groupId ? `${typeof window !== 'undefined' ? window.location.origin : ''}/select-voter/${groupId}` : ''}
                </span>
                <span className={styles.copyStatus}>
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
