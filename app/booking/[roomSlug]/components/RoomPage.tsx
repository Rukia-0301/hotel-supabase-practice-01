'use client';

import { DateSearch } from "@/app/components/DateSearch";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isNumber } from "@/app/components/isNumber";

type Room = {
  capacity: number;
  created_at: string;
  description: string | null;
  id: string;
  image_url: string | null;
  name: string;
  price_per_night: number;
  slug: string;
}

type RoomPageProps = {
  room: Room;
  roomSlug?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: string;
};

export default function RoomPage({ room, checkIn = '', checkOut = '', guests = '1' }: RoomPageProps) {

  const [guestsString, setGuestsString] = useState(Number(guests) > room.capacity ? '1' : guests);

  const bookingParams = new URLSearchParams({
    checkIn,
    checkOut,
    guests: guestsString,
  }).toString();

  const router = useRouter();
  useEffect(() => {
    if (guests === guestsString) {
      return;
    }
    router.replace(`/booking/${room.slug}?${bookingParams}`, { scroll: false });
  },
    [
      router,
      room.slug,
      bookingParams,
      guests,
      guestsString,
    ]
  );

  const createGuestOptions = () => {
    let options: React.JSX.Element[] = [];
    for (let i = 1; i <= Number(room.capacity); i++) {
      options.push(
        <option key={i} value={i}>{i}名</option>
      );
    }
    return options;
  }

  const diffDays = (Date.parse(checkOut) - Date.parse(checkIn)) / 86400000;
  const totalAmount = room.price_per_night * diffDays * Number(guestsString);
  console.log(totalAmount);

  const formatNumber = (value: number) => {
    return isNumber(value) ? value.toLocaleString() : '－';
  }

  return (
    <>
      <h1 className="pl-3 my-4 font-bold text-xl border-l-4 border-gray-700">{room.name}</h1>
      <div className="bg-gray-400 w-full h-64"></div>
      <div className="p-4 mb-4 border-b border-gray-300">
        <p>{room.description}</p>
        <div className="flex items-center mt-4">
          <p>人数 1～{room.capacity}名</p>
          <p className="text-lg font-bold ml-auto">1名 {Number(room.price_per_night).toLocaleString()}円～</p>
        </div>
      </div>
      <div className="px-4">
        <DateSearch
          key={`${room.slug}-${checkIn}-${checkOut}-${guestsString}`}
          searchPath={`/booking/${room.slug}`}
          initialCheckIn={checkIn}
          initialCheckOut={checkOut}
          initialGuests={guestsString}
        />
        <label className="flex flex-col items-start mb-4">
          <p className="inline-block font-bold">人数</p>
          <select name="guests" onChange={(e) => { setGuestsString(e.currentTarget.value.toString()) }} value={guestsString} className="p-2 w-32 border border-gray-400 cursor-pointer">
            {createGuestOptions()}
          </select>
        </label>
      </div>
      <div className="text-right mt-10 mx-4 mb-4">
        <p className="text-gray-500 mb-2">
          {formatNumber(Number(room.price_per_night) * Number(guestsString))}円 &times; {formatNumber(diffDays)}泊 {formatNumber(diffDays + 1)}日
        </p>
        <p className="font-bold text-xl">合計： {formatNumber(totalAmount)}円</p>
      </div>
    </>
  )
}
