import { formatDate } from "@/app/components/formatDate";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export async function BookingList() {
  const supabase = await createClient();
  const { data: userData, error: userDataError } = await supabase.auth.getClaims();
  if (!userData || userDataError) {
    console.error('予約情報の取得に失敗しました');
    return <p className="my-4 text-center">予約情報の取得に失敗しました</p>;
  }

  const userId = userData.claims.sub;
  const todayString = new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Tokyo' });

  const { data: bookingData, error: bookingDataError } = await supabase
    .from('01__bookings')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'confirmed')
    .gt('check_out_date', todayString)
    .order('check_in_date')
    ;
  if (bookingDataError) {
    console.error('予約情報の取得に失敗しました')
    return <p className="my-4 text-center">予約情報の取得に失敗しました</p>;
  }
  if (!bookingData || bookingData.length === 0) {
    return <p className="my-4 text-center">現在ご予約中の客室はありません</p>
  }

  const validBookedRoomTypeIds = bookingData.map((room) => {
    return room.room_type_id;
  });

  const { data: roomTypesData, error: roomTypesDataError } = await supabase
    .from('01__room_types')
    .select('*')
    .in('id', validBookedRoomTypeIds)
    ;
  if (!roomTypesData || roomTypesDataError) {
    console.error('客室情報の取得に失敗しました');
    return <p className="my-4 text-center">客室情報の取得に失敗しました</p>;
  }

  const roomList = bookingData.map((room) => {
    const roomType = roomTypesData.find((roomType) => {
      return roomType.id === room.room_type_id;
    });
    if (!roomType) return null;

    return (
      <li key={room.id} className="">
        <div className="w-full h-48 rounded-t-lg bg-gray-400"></div>
        <div className="border-x border-gray-300">
          <h3 className="p-4 text-xl font-bold">{roomType.name}</h3>
          <div className="flex flex-col gap-4 p-4 pt-2 font-bold sm:grid sm:grid-cols-2 sm:px-6">
            <div className="flex items-center gap-4 sm:border-r sm:flex-col sm:items-start">
              <p className="text-sm text-gray-500 sm:text-base">チェックイン</p>
              <p>{formatDate(room.check_in_date)}</p>
            </div>
            <div className="flex items-center gap-4 sm:pl-2 sm:flex-col sm:items-start">
              <p className="text-sm text-gray-500 sm:text-base">チェックアウト</p>
              <p>{formatDate(room.check_out_date)}</p>
            </div>
          </div>
          <div className="flex items-center font-bold p-4 border-t border-gray-300">
            <p>宿泊料金合計</p>
            <p className="ml-auto text-xl">{(room.total_price).toLocaleString()}円</p>
          </div>
        </div>
        <Link href={`/`} className="block p-4 rounded-b-lg text-center bg-gray-700 text-white">詳細を見る &rarr;</Link>
      </li>
    );
  });

  return (
    <ul className="mt-2 flex flex-col gap-4">
      {roomList}
    </ul>
  );
}