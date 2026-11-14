import { Suspense } from "react";
import { BookingList } from "./components/BookingList";


export default function Account() {
  return (
    <>
      <h1 className="font-bold text-2xl">マイページ</h1>
      <p className="text-gray-500">ご予約の確認 ・ 管理</p>

      <h2 className="mt-8 text-lg font-bold">ご予約一覧</h2>
      <div className="mx-2">
        <Suspense fallback={<p className="my-4 text-center">予約情報を確認中です...</p>}>
          <BookingList />
        </Suspense>
      </div>

      <h2 className="mt-4 text-lg font-bold">過去のご予約</h2>
      <div className="mx-2">
        <Suspense fallback={<p className="my-4 text-center">予約情報を確認中です...</p>}>
          予約情報を確認中です...
        </Suspense>
      </div>

      <h2 className="mt-8 text-2xl font-bold">アカウント情報</h2>
      <p className="text-gray-500">登録者情報の確認 ・ 変更</p>
      <Suspense fallback={<p className="my-4 text-center">アカウント情報を取得中です...</p>}>
        アカウント情報を取得中です...
      </Suspense>
    </>
  );
}