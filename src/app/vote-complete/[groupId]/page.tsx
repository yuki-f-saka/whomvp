"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import styles from '../../styles/vote-complete.module.css';
import common from '../../styles/common.module.css';

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
    <main className={common.container}>
      <div className={common.card}>
        <h1 className={common.title}>投票完了</h1>
        <div className={common.cardContent}>
          <p className={styles.message}>投票が完了しました。ご協力ありがとうございます。</p>
          <button 
            onClick={viewResults}
            className={`${common.button} ${common.buttonPrimary}`}
          >
            結果を見る
          </button>
        </div>
      </div>
    </main>
  );
}