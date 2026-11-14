import isLoggedIn from "@/lib/auth/isLoggedIn";
import Link from "next/link";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import SubmitButton from "./SubmitButton";
import { createBooking } from "./actions";
import { isValidDateString } from "@/app/components/isValidDateString";
import { isNumber } from "@/app/components/isNumber";
import { formatDate } from "@/app/components/formatDate";

type BookingConfirmPage = {
  params: Promise<{ roomSlug: string }>;
  searchParams: Promise<{
    checkIn: string;
    checkOut: string;
    guests: string;
  }>;
}

export default async function BookingConfirmPage({ params, searchParams }: BookingConfirmPage) {

  return (
    <>
      <h1 className="pl-3 my-4 font-bold text-xl border-l-4 border-gray-700">予約内容の確認</h1>
      <p className="ml-4 text-gray-500">以下の内容で予約を行います。内容をよくご確認の上、確定ボタンを押してください。</p>
      <Suspense fallback={<p className="text-center mt-10">予約内容を確認中...</p>}>
        <BookingDetails
          params={params}
          searchParams={searchParams}
        />
      </Suspense>
    </>
  );
}

async function BookingDetails({ params, searchParams }: BookingConfirmPage) {
  const { roomSlug } = await params;
  let { checkIn, checkOut, guests } = await searchParams;
  const loggedIn = await isLoggedIn();
  const supabase = await createClient();

  const todayString = new Date().toLocaleDateString('sv-SE', {
    timeZone: 'Asia/Tokyo',
  });

  const guestsNumber = Number(guests);

  if (!isValidDateString(checkIn) || checkIn < todayString) {
    checkIn = '';
  }

  if (!isValidDateString(checkOut) || checkOut <= todayString) {
    checkOut = '';
  }

  const { data: room, error } = await supabase
    .from('01__room_types')
    .select('*')
    .eq('slug', roomSlug)
    .single()
    ;
  if (!room) {
    throw new Error('客室情報の取得に失敗しました。');
  }
  if (error) {
    console.error(error);
    return <p>客室情報の取得に失敗しました。</p>
  }

  const diffDays = (Date.parse(checkOut) - Date.parse(checkIn)) / 86400000;
  const totalAmount = room.price_per_night * diffDays * guestsNumber;

  const confirmButton = <SubmitButton />;

  const bookingParams = new URLSearchParams({
    checkIn,
    checkOut,
    guests,
  });

  const authButton =
    <>
      <Link href={`/login?next=${encodeURIComponent(`/booking/${roomSlug}/confirm?${bookingParams}`)}`} className="block w-full text-center mt-4 py-3 font-bold border border-[#bf4d36] bg-white text-[#bf4d36]">新規登録 ・ ログイン</Link>
      <p className="text-center text-sm mt-2 text-gray-500">※予約を確定するにはログインする必要があります。</p>
    </>
    ;
  const invalidDateMessage =
    <div className="flex items-center justify-center mt-4 text-red-600">不正な日付が含まれています。予約内容を修正してください。</div>
    ;

  const formatNumber = (value: number) => {
    return isNumber(value) ? value.toLocaleString() : '－';
  }

  const isBookingValid =
    isValidDateString(checkIn) &&
    isValidDateString(checkOut) &&
    checkIn >= todayString &&
    checkIn < checkOut &&
    Number.isInteger(guestsNumber) &&
    guestsNumber >= 1 &&
    isNumber(totalAmount);

  return (
    <>
      <div className="mt-4 border border-gray-300 p-4 rounded-lg">
        <div className="w-full h-64 bg-gray-400"></div>
        <h2 className="font-bold mt-3 mb-2">客室名</h2>
        <p>{room.name}</p>
        {/* <p className="scrollbar-hidden h-16 text-gray-500 overflow-auto">{room.description}</p> */}
        <div className="mt-4 pt-3 border-t border-gray-300">
          <h2 className="font-bold mb-1">ご宿泊期間</h2>
          <p><span className="inline-block w-24">チェックイン</span>{formatDate(checkIn)} {formatDate(checkIn) ? '15:00 ～' : '－'}</p>
          <p><span className="inline-block w-24">チェックアウト</span>{formatDate(checkOut)} {formatDate(checkOut) ? '11:00' : '－'}</p>
          <p className="mt-2 text-right text-lg text-gray-500">{formatNumber(diffDays)}泊{formatNumber(diffDays + 1)}日</p>
        </div>
        <div className="mt-4 pt-3 border-t border-gray-300">
          <h2 className="font-bold mb-1">宿泊料金合計</h2>
          <p className="text-right">{formatNumber(diffDays)}泊 1室</p>
          <p className="text-right">大人 &yen;{Number(room.price_per_night).toLocaleString()} &times; {guests}名様</p>
          <p className="text-right font-bold text-xl mt-4">合計　{formatNumber(totalAmount)}円</p>
        </div>

        {!isBookingValid ? invalidDateMessage :
          loggedIn ? (
            <form action={createBooking}>
              <input type="hidden" name="roomId" value={room.id} />
              <input type="hidden" name="roomSlug" value={roomSlug} />
              <input type="hidden" name="checkIn" value={checkIn} />
              <input type="hidden" name="checkOut" value={checkOut} />
              <input type="hidden" name="guests" value={guestsNumber} />
              {confirmButton}
            </form>) : authButton
        }
      </div>
      <Link href={`/booking/${roomSlug}?${bookingParams}`} className="flex items-center justify-center mx-4 mt-4 text-center py-2 border border-gray-700">
        <span className="text-xl mr-4">&lt;</span>
        <p>予約内容を修正</p>
      </Link>
    </>
  );
}