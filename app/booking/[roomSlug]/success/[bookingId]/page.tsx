import { Suspense } from "react";
import { BookingData } from "./BookingData";

type InsertSuccessPage = {
  params: Promise<{bookingId: string}>;
}

export default function InsertSuccessPage({params}: InsertSuccessPage) {
  return (
    <>
    <h1 className="pl-3 my-4 font-bold text-xl border-l-4 border-gray-700">予約を確定しました</h1>
    <p className="text-gray-500">予約内容の確認や変更 ・ キャンセルはあとからマイページでも行えます。</p>
    <div className="mt-8 p-4 border border-gray-300 rounded-lg">
      <Suspense fallback={<p className="mt-10">予約情報を読み込み中です...</p>}>
        <BookingData params={params} />
      </Suspense>
    </div>
    </>
  );
}