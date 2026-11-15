'use client';
import { ChangeEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isValidDateString } from "./isValidDateString";

type DateSearchProps = {
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialGuests?: string;
  searchPath?: string;
}

export function DateSearch({ initialCheckIn = '', initialCheckOut = '', initialGuests = '2', searchPath = '/' }: DateSearchProps) {

  if(!isValidDateString(initialCheckIn)) {
    initialCheckIn = '';
  }

  if(!isValidDateString(initialCheckOut)) {
    initialCheckOut = '';
  }

  const today = new Date();
  const todayString = today.toLocaleDateString('sv-SE', {timeZone: 'Asia/Tokyo'});

  const defaultCheckInDate = !initialCheckIn || initialCheckIn < todayString ? todayString : initialCheckIn; 

  const baseCheckOutDate = new Date(defaultCheckInDate);
  const defaultCheckOutDate = !initialCheckOut || defaultCheckInDate >= initialCheckOut ? new Date(baseCheckOutDate.setDate(baseCheckOutDate.getDate() + 1)).toLocaleDateString('sv-SE') : initialCheckOut;

  const baseMinDate = new Date(today);
  const defaultMinCheckOutDate = new Date(baseMinDate.setDate(baseMinDate.getDate() + 1)).toLocaleDateString('sv-SE');


  const [checkInDate, setCheckInDate] = useState(defaultCheckInDate);
  const [checkOutDate, setCheckOutDate] = useState(defaultCheckOutDate);

  const router = useRouter();
  useEffect(() => {
    if (!checkInDate || !checkOutDate || checkInDate >= checkOutDate) {
      return;
    }
    if (checkInDate === initialCheckIn && checkOutDate === initialCheckOut) {
      return;
    }
    router.replace(`${searchPath}?checkIn=${checkInDate}&checkOut=${checkOutDate}&guests=${initialGuests}`, {scroll: false});
  }, [checkInDate, checkOutDate, initialCheckIn, initialCheckOut, initialGuests, searchPath, router]);

  const handleCheckInDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newDate = e.currentTarget.value;
    if (newDate < todayString) {
      return;
    }
    if (newDate >= checkOutDate) {
      const nextDay = new Date(newDate);
      nextDay.setDate(nextDay.getDate() + 1);
      console.log(nextDay);
      setCheckOutDate(nextDay.toLocaleDateString('sv-SE'));
    }
    setCheckInDate(newDate);
  };

  const handleCheckOutDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newDate = e.currentTarget.value;
    if (newDate < defaultMinCheckOutDate) {
      return;
    }
    if (newDate <= checkInDate) {
      const prevDate = new Date(newDate);
      prevDate.setDate(prevDate.getDate() - 1);
      setCheckInDate(prevDate.toLocaleDateString('sv-SE'));
    }
    setCheckOutDate(newDate);
  };

  return (
    <div className="flex flex-col items-start gap-4 mb-4">
      <label className="flex flex-col items-start">
        <p className="inline-block font-bold">チェックイン</p>
        <input type="date" min={todayString} value={checkInDate} onChange={handleCheckInDateChange} className="px-4 py-2 border border-gray-400 rounded-full cursor-pointer" />
      </label>
      <label className="flex flex-col items-start">
        <p className="inline-block font-bold">チェックアウト</p>
        <input type="date" min={defaultMinCheckOutDate} value={checkOutDate} onChange={handleCheckOutDateChange} className="px-4 py-2 border border-gray-400 rounded-full cursor-pointer" />
      </label>
    </div>
  );
}