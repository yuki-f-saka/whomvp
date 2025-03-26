import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-gray-800">WhoMvp</h1>
      <p className="text-gray-600 mt-2">簡単にMVPを決める投票アプリ！</p>

      <Link
        href="/create-group"
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        新しいグループを作成
      </Link>
    </main>
  );
}
