import { Suspense } from "react";
import RoomPage from "./components/RoomPage";
import { createClient } from "@/lib/supabase/server";
import BookingAvailabilityCheck from "./components/BookingAvailabilityCheck";
import { notFound } from "next/navigation";
import Link from "next/link";

type BookingParams = {
  params: Promise<{ roomSlug: string }>;
  searchParams: Promise<{
    checkIn?: string;
    checkOut?: string;
    guests?: string;
  }>;
}

export default async function BookingPage({ params, searchParams }: BookingParams) {

  return (
    <>
      <Suspense>
        <RoomData params={params} searchParams={searchParams} />
      </Suspense>
    </>
  )
}

async function RoomData({params, searchParams}: BookingParams) {
  const { roomSlug } = await params;
  const { checkIn = '', checkOut = '', guests = '1' } = await searchParams;

  const supabase = await createClient();

  const { data: room, error: roomError } = await supabase
    .from('01__room_types')
    .select('*')
    .eq('slug', roomSlug)
    .single()
    ;

  if (roomError) {
    console.log(roomError);
    return <p className="text-center my-auto">客室情報の取得に失敗しました。</p>
  }

  if (!room) {
    notFound();
  }

  return (
    <>
      <RoomPage key={`${room.slug}-${checkIn}-${checkOut}-${guests}`} room={room} checkIn={checkIn} checkOut={checkOut} guests={guests} />
      <BookingAvailabilityCheck
        roomSlug={room.slug}
        checkIn={checkIn}
        checkOut={checkOut}
        guests={Number(guests)}
      />
      <Link href={`/?checkIn=${checkIn}&checkOut${checkOut}&guests=${guests}`} className="flex justify-center items-center mt-6 py-2 border border-gray-700">
        <span className="text-xl mr-4">&lt;</span>
        <p>客室一覧に戻る</p>
      </Link>
    </>
  );
}