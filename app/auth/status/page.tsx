// import { createClient } from "@/lib/supabase/server";

// export default async function AuthStatusPage() {
//   const supabase = await createClient();

//   const {data, error} = await supabase.auth.getClaims();

//   const isLoggedIn = !error && !!data?.claims;

//   console.log(data?.claims);

//   return (
//     <div>
//       {isLoggedIn ? (
//         <p>ログイン中</p>
//       ) : (
//         <p>ログインしていません</p>
//       )}
//     </div>
//   )
// }