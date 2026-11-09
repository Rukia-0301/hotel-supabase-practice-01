import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getRoomAvailability } from "@/lib/rooms/getRoomAvailability";
import { CircleAlert } from "lucide-react";

type BookingAvailabilityCheck = {
  roomSlug: string;
  checkIn: string;
  checkOut: string;
  guests: number;
};

export default async function BookingAvailabilityCheck({ roomSlug, checkIn, checkOut, guests }: BookingAvailabilityCheck) {
  const supabase = await createClient();

  const {data: roomTypeData, error: roomTypeDataError} = await supabase
    .from('01__room_types')
    .select('id')
    .eq('slug', roomSlug)
    .single()
  ;
  if (roomTypeDataError) {
    console.error();
    return <p>客室情報の取得に失敗しました。</p>
  }

  const roomTypeId = roomTypeData.id;

  console.log(roomTypeData);

  if (!roomSlug || !checkIn || !checkOut || !guests) {
    return (
      <div className="w-full text-center bg-gray-400 text-white py-3">予約内容の確認へ</div>
    );
  }

  let remainingRoom;
  try {
    const availability = await getRoomAvailability({checkIn, checkOut});
    if (!availability) {
      throw new Error('客室情報の取得に失敗しました');
    }
    remainingRoom = availability[roomTypeId].remaining ?? 0;
  } catch(error) {
    console.error(error);
  }

  if (remainingRoom === 0) {
    return (
      <div className="w-full flex justify-center items-center font-bold bg-red-200 text-red-700 py-3">
        <CircleAlert className="mr-2 size-5" />
        <p>満室です</p>
      </div>
    );
  }

  return (
    <Link href={`/booking/${roomSlug}/confirm?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`}>
      <div className="w-full text-center bg-gray-700 text-white py-3">予約内容の確認へ</div>
    </Link>
  );
}