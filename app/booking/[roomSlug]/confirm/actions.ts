'use server';

import { isValidDateString } from "@/app/components/isValidDateString";
import { getRoomAvailability } from "@/lib/rooms/getRoomAvailability";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function createBooking(formData: FormData) {
  const supabase = await createClient();
  const {data: userData, error: userDataError} = await supabase.auth.getClaims();
  if (!userData) {
    throw new Error('ユーザーデータの取得に失敗しました。');
  }
  if (userDataError) {
    console.error('ユーザーデータの取得に失敗しました。');
    return;
  }

  const userId = userData.claims.sub;
  const roomId = formData.get('roomId')?.toString();
  console.log(roomId);
  const roomSlug = formData.get('roomSlug')?.toString();
  const checkIn = formData.get('checkIn')?.toString();
  const checkOut = formData.get('checkOut')?.toString();
  const guests = Number(formData.get('guests'));

  const today = new Date();
  const todayString = today.toLocaleDateString('sv-SE', {timeZone: 'Asia/Tokyo'});

  if (!userId || !roomId || !roomSlug || !checkIn || !checkOut || !guests || !Number.isInteger(guests) || checkIn >= checkOut || checkIn < todayString || checkOut <= todayString || !isValidDateString(checkIn) || !isValidDateString(checkOut) || guests < 1) {
    return;
  }

  const {data: roomData, error: roomDataError} = await supabase
    .from('01__room_types')
    .select('*')
    .eq('slug', roomSlug)
    .single()
  ;
  if (roomDataError || !roomData) {
    console.error(roomDataError);
    throw new Error('客室情報の取得に失敗しました。');
  }

  if (String(roomData.id) !== roomId) {
    return;
  }

  const diffDays = (Date.parse(checkOut) - Date.parse(checkIn)) / 86400000; 
  const totalPrice = Number(roomData.price_per_night * guests * diffDays);

  if (guests > Number(roomData.capacity) || !Number.isFinite(diffDays) || !Number.isFinite(totalPrice) || totalPrice <= 0) {
    return;
  }

  const bookingParams = new URLSearchParams({
    checkIn,
    checkOut,
    guests: guests.toString(),
  });

  let availableRoomIds;

  try {
    const availability = await getRoomAvailability({checkIn, checkOut});
    if (!availability) {
      throw new Error('空室状況の取得に失敗しました。');
    }
    const room = availability[roomId];
    if (!room) {
      throw new Error('該当する部屋が見つかりません。');
    }
    availableRoomIds = room.availableRoomIds;
  } catch(error) {
    console.error(error);
    return;
  }

  if (availableRoomIds.length === 0) {
    redirect(`/booking/${roomSlug}/unavailable?${bookingParams}`);
  }

  const selectedRoomId = availableRoomIds[0];

  const {error: bookingInsertError} = await supabase
    .from('01__bookings')
    .insert({
      'user_id': userId,
      'room_id': selectedRoomId,
      'check_in_date': checkIn,
      'check_out_date': checkOut,
      'guests_count': guests,
      'total_price': totalPrice,
      'status': 'confirmed',
    })
  ;
  if(bookingInsertError) {
    console.error(bookingInsertError);
    return;
  };
} 