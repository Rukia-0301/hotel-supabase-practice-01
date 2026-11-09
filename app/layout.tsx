import Link from "next/link";
import "./globals.css";
import { Noto_Sans_JP } from "next/font/google";

const notoSansJP = Noto_Sans_JP({
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans-jp",
  display: "swap",
});

export const metadata = {
  title: "Hotel Reservation",
  description: "ホテル予約サイト",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className="overflow-y-scroll">
      <body className={`${notoSansJP.variable} min-h-screen flex flex-col`}>
        <header className="fixed w-full backdrop-blur-md bg-white/50 px-4 py-3 shadow-sm shadow-gray-700/50">
          <Link href='/' className="text-gray-700 font-bold text-xl">HoTel MagicaL</Link>
        </header>
        <main className="flex-1 flex-col main max-w-xl w-11/12 mx-auto pt-6 mt-14 mb-10 flex">
          {children}
        </main>
        <footer className="bg-[#223670] py-2">
          <small className="block text-white text-center text-xs">&copy; HoTel MagicaL 2026</small>
        </footer>
      </body>
    </html>
  );
}