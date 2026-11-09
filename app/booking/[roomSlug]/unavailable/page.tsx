import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { Search } from "lucide-react";
import { Suspense } from "react";

type UnavailablePage = {
  searchParams: Promise<{
    checkIn: string;
    checkOut: string;
    guests: string;
  }>;
}

export default function UnavailablePage({searchParams}: UnavailablePage) {
  return (
    <div className="flex-1 flex flex-col justify-center items-center">
      <div className="flex items-center gap-2 mb-4 font-bold">
        <AlertCircle className=" text-red-600" />
        <p className="text-lg">ご予約を確定できませんでした</p>
      </div>
      <div className="text-center">
        <p>申し訳ございません。ご予約のお手続き中に、ご希望のお部屋が満室となりました。</p>
        <p>恐れ入りますが、別のお部屋または日程をご検討ください。</p>
      </div>
      <Suspense>
        <SearchButton searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function SearchButton({searchParams}: UnavailablePage) {
  const {checkIn, checkOut, guests} = await searchParams;

  const bookingParams = new URLSearchParams({
    checkIn,
    checkOut,
    guests,
  });

  return (
      <Link href={`/?${bookingParams}`} className="flex gap-2 items-center mt-10 py-3 px-10 bg-white border border-gray-700">
        <Search className="size-5" />
        <p>他のお部屋を探す</p>
      </Link>
  );
}