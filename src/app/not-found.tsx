import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found">
      <span>৪০৪</span>
      <h1>পৃষ্ঠাটি পাওয়া যায়নি</h1>
      <p>আপনি যে পৃষ্ঠাটি খুঁজছেন সেটি নেই অথবা সরানো হয়েছে।</p>
      <Link className="button" href="/">
        হোম পেজে ফিরে যান
      </Link>
    </main>
  );
}
