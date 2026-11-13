import { AlertCircle, RotateCw } from "lucide-react";
import { Suspense } from "react";
import Link from "next/link";

type InsertErrorPage = {
  params: Promise<{roomSlug: string}>;
  searchParams: Promise<{
    checkIn: string;
    checkOut: string;
    guests: string;
  }>;
}

export default function InsertErrorPage({params, searchParams}: InsertErrorPage) {

  return (
    <div className="flex-1 flex flex-col justify-center items-center">
      <div className="flex items-center gap-2 mb-4 font-bold">
        <AlertCircle className=" text-red-600" />
        <p className="text-lg">エラーが発生しました</p>
      </div>
      <div className="text-center">
        <p>申し訳ございません。ご予約のお手続き中にエラーが発生しました。</p>
        <p>恐れ入りますが、もう一度お試しください。</p>
      </div>
      <Suspense>
        <SearchButton params={params} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

export async function SearchButton({params, searchParams}: InsertErrorPage) {
  const {roomSlug} = await params;
  const {checkIn, checkOut, guests} = await searchParams;

  const bookingParams = new URLSearchParams({
    checkIn,
    checkOut,
    guests,
  });

  return (
      <Link href={`/booking/${roomSlug}/confirm?${bookingParams}`} className="flex gap-3 items-center mt-10 py-2 pl-9 pr-10 bg-white border border-gray-700">
        <RotateCw className="size-4" />
        <p>リトライ</p>
      </Link>
  );
}