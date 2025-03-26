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

    return NextResponse.json( data[0] );
}
