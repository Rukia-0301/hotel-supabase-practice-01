import { Suspense } from "react";
import {RoomList} from "./components/RoomList";
import { DateSearch } from "./components/DateSearch";

type HotelPageProps = {
  searchParams: Promise<{
    checkIn?: string;
    checkOut?: string;
    guests?: string;
  }>
}

export default function HotelPage({searchParams}: HotelPageProps) {

  return (
    <>
      <Suspense>
        <SelectedDateSearch searchParams={searchParams} />
      </Suspense>
      <h1 className="pl-3 my-4 font-bold text-xl border-l-4 border-gray-700">客室一覧</h1>
      <Suspense>
        <FilterdRoomList searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function SelectedDateSearch({searchParams}: HotelPageProps) {
  const {checkIn, checkOut, guests} = await searchParams;
  return (
    <DateSearch key={`${checkIn}-${checkOut}-${guests}`} initialCheckIn={checkIn} initialCheckOut={checkOut} initialGuests={guests} />
  );
}

async function FilterdRoomList({searchParams}: HotelPageProps) {
  const {checkIn, checkOut, guests} = await searchParams;
  return(
    <RoomList key={`${checkIn}-${checkOut}-${guests}`} checkIn={checkIn} checkOut={checkOut} guests={guests} />
  );
}