"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from '../../styles/vote.module.css';
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