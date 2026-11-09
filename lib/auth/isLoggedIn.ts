import { createClient } from "../supabase/server";

export default async function isLoggedIn(): Promise<boolean> {
  const supabase = await createClient();

  const {data, error} = await supabase.auth.getClaims();

  if (error) {
    console.error('ログイン状態の確認に失敗：', error);
    return false;
  }

  return Boolean(data?.claims);
}