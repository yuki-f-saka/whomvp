import Link from "next/link";
import Image from "next/image";
import common from './styles/common.module.css';

export default function Home() {
  return (
    <main className={common.container}>
      <div className="flex flex-col items-center justify-center">
        <Image
          src="/whomvp-logo.svg"
          alt="whomvp"
          width={240}
          height={80}
          priority
          className="mb-4"
        />
        <p className={`${common.text} mt-2`}>順位投票ができるぞ</p>
        <Link
          href="/create-group"
          className={`${common.button} ${common.buttonPrimary} mt-4`}
        >
          新しいグループを作成
        </Link>
      </div>
    </main>
  );
}
