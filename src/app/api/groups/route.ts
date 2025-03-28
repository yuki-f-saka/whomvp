import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
    const { name } = await req.json();

    // 空の名前は許可しない
    if (!name || name.trim() === "") {
        return NextResponse.json({ error: "グループ名を入力してください" }, { status: 400 });
    }

    const { data, error } = await supabase.from("groups").insert([{ name }]).select();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // データが存在しない場合のエラーハンドリング
    if (!data || data.length === 0) {
        return NextResponse.json({ error: "グループの作成に失敗しました" }, { status: 500 });
    }

    return NextResponse.json({ 
        groupId: data[0].id,
        name: data[0].name 
    });
}
