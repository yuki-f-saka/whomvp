"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import styles from '../../styles/result.module.css';
import common from '../../styles/common.module.css';

type PageProps = {
  params: Promise<{
    groupId: string;
  }>;
};

type Result = {
  memberId: string;
  memberName: string;
  points: number;
  averagePoints: number;
};

export default function ResultPage({ params }: PageProps) {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [groupId, setGroupId] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroupId = async () => {
      const resolvedParams = await params;
      setGroupId(resolvedParams.groupId);
    };
    fetchGroupId();
  }, [params]);

  useEffect(() => {
    if (!groupId) return;

    const fetchResults = async () => {
      try {
        const res = await fetch(`/api/results?groupId=${groupId}`);
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || '結果の取得に失敗しました');
        }
        
        setResults(data.results);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [groupId]);

  if (loading) {
    return (
      <main className={common.container}>
        <div className={`${common.text} text-xl`}>集計中...</div>
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

  if (results.length === 0) {
    return (
      <main className={common.container}>
        <div className={common.card}>
          <h1 className={common.title}>投票結果</h1>
          <div className={common.cardContent}>
            <p className={`${common.text} text-center`}>まだ投票が行われていません</p>
          </div>
        </div>
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
        <h1 className={common.title}>投票結果</h1>
        <div className={common.cardContent}>
          <ul className={styles.resultList}>
            {results.map((member, index) => (
              <li 
                key={index}
                className={`${styles.resultItem} ${
                  index === 0 ? styles.resultItemFirst :
                  index === 1 ? styles.resultItemSecond :
                  index === 2 ? styles.resultItemThird :
                  styles.resultItemOther
                }`}
              >
                <div className={styles.memberInfo}>
                  <span className={styles.rank}>
                    {index === 0 ? '🥇' :
                     index === 1 ? '🥈' :
                     index === 2 ? '🥉' :
                     `${index + 1}位`}
                  </span>
                  <span className={styles.memberName}>{member.memberName}</span>
                </div>
                <div className={styles.pointsContainer}>
                  <div className={styles.points}>獲得ポイント: {member.points}</div>
                  <div className={styles.averagePoints}>平均獲得ポイント: {member.averagePoints}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
