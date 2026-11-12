import { createClient } from "../supabase/server";

type getRoomAvailability = {
  checkIn: string;
  checkOut: string;
}

export async function getRoomAvailability({checkIn, checkOut}: getRoomAvailability) {
  if (!checkIn || !checkOut) return null;
  const supabase = await createClient();

  const {data: allRooms, error: allRoomsError} = await supabase
    .from('01__rooms')
    .select('id, room_type_id')
  ;
  if (allRoomsError) {
    throw new Error('客室情報の取得に失敗しました', { cause: allRoomsError});
  }

  const { data: bookedRooms, error: bookingsError } = await supabase
  .rpc('get_booked_room_ids', {
    p_check_in: checkIn,
    p_check_out: checkOut,
  })
  ;

  if (bookingsError) {
    throw new Error('予約情報の取得に失敗しました', {cause: bookingsError});
  }

  const availability: Record<string, {total: number; remaining: number; availableRoomIds: string[]}> = {}; // { roomTypeID : { total: 全部屋数, remaining: 残り数 }, roomTypeId : { total: ...}}という形のオブジェクトと宣言し、空のオブジェクトを作る

  const bookedRoomIds = new Set(
    bookedRooms.map((booked) => booked.room_id) // 予約されている部屋のid(uuid)を[101, 105, 204...]という形で配列に入れていく。Array(普通の配列)とは違って重複は許されないのがSet
  );

  allRooms.forEach((room) => {
    const typeId = room.room_type_id;

    if (!availability[typeId]) { // 予約済みの配列にこのroom_type_idがなければ
      availability[typeId] = {
        total: 0,
        remaining: 0,
        availableRoomIds: [],
      };
    }

    availability[typeId].total++;

    if (!bookedRoomIds.has(room.id)) {
      availability[typeId].remaining++;
      availability[typeId].availableRoomIds.push(room.id);
    }
  });

  return availability;
}