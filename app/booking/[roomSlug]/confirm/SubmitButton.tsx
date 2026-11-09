'use client';
import { useFormStatus } from "react-dom";

export default function SubmitButton() {
  const {pending} = useFormStatus();

  return (
    <button
      type="submit"
      className="block w-full text-center py-3 border border-gray-700 bg-gray-700 text-white mt-4 disabled:bg-gray-400 disabled:border-gray-400 disabled:text-white"
      disabled={pending}>
      {pending ? '予約処理中...' : '予約を確定'}
    </button>
  );
}