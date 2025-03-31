"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import common from '../../styles/common.module.css';

type PageProps = {
  params: Promise<{
    groupId: string;
  }>;
};

export default function VoteCompletePage({ params }: PageProps) {
  const [groupId, setGroupId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchGroupId = async () => {
      const resolvedParams = await params;
      setGroupId(resolvedParams.groupId);
    };
    fetchGroupId();
  }, [params]);

  const goToResult = () => {
    if (groupId) {
      router.push(`/result/${groupId}`);
    }
  };

  return (
    <main className={common.container}>
      <div className={common.card}>
        <h1 className={common.title}>投票完了</h1>
        <div className={common.cardContent}>
          <p className={`${common.text} mb-4`}>投票が完了しました！</p>
          <button
            onClick={goToResult}
            className={`${common.button} ${common.buttonPrimary}`}
          >
            結果を確認する
          </button>
        </div>
      </div>
    </main>
  );
}