import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { getRoomAvailability } from "@/lib/rooms/getRoomAvailability";

type RoomListProps = {
  checkIn?: string;
  checkOut?: string;
  guests?: string;
}

export async function RoomList({ checkIn = '', checkOut = '', guests = '1' }: RoomListProps) {
  const supabase = await createClient();
  const { data: roomTypesData, error: roomTypesDataError } = await supabase
    .from('01__room_types')
    .select('*')
    .order('price_per_night')
    ;
  if (roomTypesDataError) {
    console.log(`Error: ${roomTypesDataError}`);
    return <p className="text-center mt-10">客室情報の取得に失敗しました。</p>
  };

  let availability;

  try {
    availability = await getRoomAvailability({checkIn, checkOut});

    if (!availability) {
      throw new Error('客室情報の取得に失敗しました:');
    }
  } catch (error) {
    console.error(error);
    return <p className="text-center mt-10">客室情報の取得に失敗しました。</p>;
  }

  const roomList = roomTypesData.map((room) => {
    const roomAvailability = availability[room.id];

    const totalRooms = roomAvailability.total ?? 0;
    const remainingRooms = roomAvailability.remaining ?? 0;

    console.log(remainingRooms);

    const bookingParams = new URLSearchParams({
      checkIn,
      checkOut,
      guests,
    });

    return (
      <li key={room.id} className="p-4 rounded-lg shadow-[0_0_10px] shadow-gray-400/50 transition hover:backdrop-brightness-95">
        <Link href={`/booking/${room.slug}?${bookingParams}`}>
          <div className="bg-gray-400 w-full h-60 rounded-md"></div>
          <div className="flex items-center mt-4">
            <h2 className="font-bold sm:text-xl">{room.name}</h2>
              {
                remainingRooms <= 0 ?
                <p className="text-sm ml-auto font-bold py-1 px-3 rounded-full bg-red-100 text-red-700 sm:text-base">満室</p> :
                remainingRooms < totalRooms / 3 || remainingRooms <= 1 ?
                <p className="text-sm ml-auto font-bold py-1 px-3 rounded-full bg-orange-100 text-orange-700 sm:text-base">残り{remainingRooms}部屋</p> :
                <p className="text-sm ml-auto font-bold py-1 px-3 rounded-full bg-green-100 text-green-700 sm:text-base">残り{remainingRooms}部屋</p>
              }
          </div>
          <p className="mt-2">{room.description}</p>
        </Link>
      </li>
    );
  });

  return (
    <ul className="flex flex-col gap-4">
      {roomList}
    </ul>
  );
}
