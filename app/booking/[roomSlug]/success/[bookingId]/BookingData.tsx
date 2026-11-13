
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { formatDate } from "@/app/components/formatDate";


type BookingData = {
  params: Promise<{bookingId: string}>;
}

export async function BookingData({params}: BookingData) {
  const supabase = await createClient();
  const {data: userData, error: userDataError} = await supabase.auth.getClaims();
  if (!userData || userDataError) {
    console.error('ユーザーデータの取得に失敗しました。');
    return;
  }

  const userId = await userData.claims.sub;

  if(!userId) {
    return (
      <>
        <p className="text-center mt-10">予約情報を表示するにはログインが必要です。</p>
        <Link href={`/`} className="block w-full text-center mt-12 p-3 font-bold border border-gray-700 bg-gray-700 text-white">ログイン</Link>
      </>
    );
  }

  let {bookingId} = await params;

  const {data: bookingData, error: bookingDataError} = await supabase
    .from('01__bookings')
    .select('*')
    .eq('id', bookingId)
    .single()
  ;
  if (!bookingData || bookingDataError) {
    console.error('予約情報の取得に失敗しました。');
    return (
      <>
        <p className="text-center mt-10">予約情報の取得に失敗しました。</p>
        <Link href={`/account`} className="block w-full text-center mt-12 p-3 font-bold border border-gray-700 bg-gray-700 text-white">マイページへ</Link>
      </>
    );
  }

  bookingId = bookingData.id;
  const roomTypeId = bookingData.room_type_id;

  const {data: roomTypeData, error: roomTypeDataError} = await supabase
    .from('01__room_types')
    .select('name')
    .eq('id', roomTypeId)
    .single()
  ;
  if (!roomTypeData || roomTypeDataError) {
    console.error('予約情報の取得に失敗しました。');
    return (
      <>
        <p className="text-center mt-10">予約情報の取得に失敗しました。</p>
        <Link href={`/account`} className="block w-full text-center mt-12 p-3 font-bold border border-gray-700 bg-gray-700 text-white">マイページへ</Link>
      </>
    );
  }

  const diffDays = (Date.parse(bookingData.check_out_date) - Date.parse(bookingData.check_in_date)) / 86400000;

  return (
    <>
      {/* <p className="text-gray-500 mb-4">予約ID： {bookingData.id}</p> */}
      <dl className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-[max-content_1fr]">
        <dt className="font-bold">客室名</dt>
        <dd className="pb-4 border-b border-gray-300 sm:border-0 sm:pb-0"><span className="hidden px-[1px] h-full mr-4 bg-gray-300 sm:inline"></span>{roomTypeData.name}</dd>
        <dt className="mt-2 font-bold sm:mt-0">人数</dt>
        <dd className="pb-4 border-b border-gray-300 sm:border-0 sm:pb-0"><span className="hidden px-[1px] h-full mr-4 bg-gray-300 sm:inline"></span>{bookingData.guests_count}名</dd>
        <dt className="mt-2 font-bold sm:mt-0">チェックイン</dt>
        <dd className="pb-4 border-b border-gray-300 sm:border-0 sm:pb-0"><span className="hidden px-[1px] h-full mr-4 bg-gray-300 sm:inline"></span>{formatDate(bookingData.check_in_date)}　15:00 ～</dd>
        <dt className="mt-2 font-bold sm:mt-0">チェックアウト</dt>
        <dd className="pb-4 border-b border-gray-300 sm:border-0 sm:pb-0"><span className="hidden px-[1px] h-full mr-4 bg-gray-300 sm:inline"></span>{formatDate(bookingData.check_out_date)}　11:00</dd>
        <dt className="mt-2 font-bold sm:mt-0">宿泊日数</dt>
        <dd className="pb-4 border-b border-gray-300 sm:border-0 sm:pb-0"><span className="hidden px-[1px] h-full mr-4 bg-gray-300 sm:inline"></span>{diffDays}泊{diffDays + 1}日</dd>
        <dt className="mt-2 font-bold sm:mt-0">料金</dt>
        <dd className="pb-4 border-b border-gray-300 sm:border-0 sm:pb-0"><span className="hidden px-[1px] h-full mr-4 bg-gray-300 sm:inline"></span>{Number(bookingData.total_price).toLocaleString()} 円</dd>
      </dl>
      <Link href={`/account`} className="block w-full text-center mt-12 p-3 font-bold border border-gray-700 bg-gray-700 text-white">マイページへ</Link>
      <Link href={`/`} className="block w-full text-center mt-4 p-3 text-[#bf4d36] border border-[#bf4d36]">予約内容を変更 ・ キャンセル</Link>
    </>
  );
}