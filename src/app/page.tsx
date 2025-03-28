import Link from "next/link";
import common from './styles/common.module.css';

export default function Home() {
  return (
    <main className={common.container}>
      <h1 className={common.title}>WhoMvp</h1>
      <p className={`${common.text} mt-2`}>順位投票ができるぞ</p>
      <Link
        href="/create-group"
        className={`${common.button} ${common.buttonPrimary} mt-4`}
      >
        新しいグループを作成
      </Link>
    </main>
  );
}
