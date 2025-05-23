"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from '../../styles/select-voter.module.css';
import common from '../../styles/common.module.css';

type PageProps = {
  params: Promise<{
    groupId: string;
  }>;
};

type Member = {
  id: string;
  name: string;
  hasVoted: boolean;
};

export default function SelectVoterPage({ params }: PageProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [groupId, setGroupId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchGroupId = async () => {
      const resolvedParams = await params;
      setGroupId(resolvedParams.groupId);
    };
    fetchGroupId();
  }, [params]);

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
      <main className={common.container}>
        <div className={`${common.text} text-xl`}>読み込み中...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className={common.container}>
        <div className="text-xl text-red-600">エラー: {error}</div>
      </main>
    );
  }

  return (
    <main className={common.container}>
      <Link href="/" className={styles.logoLink}>
        <Image
          src="/whomvp-logo.svg"
          alt="WhomVP Logo"
          width={200}
          height={60}
          priority
        />
      </Link>
      <div className={common.card}>
        <h1 className={common.title}>投票者の選択</h1>
        
        <div className={styles.shareUrlContainer}>
          <p className={styles.shareUrlText}>このページを他のメンバーと共有してください：</p>
          <button
            onClick={copyShareUrl}
            className={styles.shareUrlButton}
          >
            <span className={styles.copyText}>
              {typeof window !== 'undefined' ? `${window.location.origin}/select-voter/${groupId}` : ''}
            </span>
            <span className={styles.copyStatus}>
              {copied ? '✓ コピーしました' : 'URLをコピー'}
            </span>
          </button>
        </div>

        <div className={common.cardContent}>
          <p className={`${common.text} mb-4`}>投票を行うメンバーを選択してください</p>
          <ul className={styles.voterList}>
            {members.map((member) => (
              <li key={member.id}>
                <button
                  onClick={() => selectVoter(member.id)}
                  className={`${styles.voterButton} ${
                    member.hasVoted ? styles.voterButtonDisabled : ''
                  }`}
                  disabled={member.hasVoted}
                >
                  {member.name}
                  {member.hasVoted && (
                    <span className={styles.votedBadge}>投票済み</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}