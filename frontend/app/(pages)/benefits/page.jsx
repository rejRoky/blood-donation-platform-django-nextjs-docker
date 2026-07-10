export const metadata = {
  title: "Dial For Blood-Benefits",
  description: "Donate your red love to save one's life",
};

const BenefitsPage = () => {
  return (
    <div className="m-4 md:m-12 relative overflow-hidden">
      <div className="big-water-bg"></div>

      <article className="p-6 bg-white rounded shadow-md text-gray-800 space-y-6">
        <header>
          <h1 className="text-xl md:text-3xl font-bold text-red-600 mb-2">
            রক্তদানের উপকারিতা
          </h1>
          <p className="text-sm text-gray-600">
            শেষ আপডেট: <strong>২২ জুলাই ২০২৫</strong>
          </p>
        </header>

        <section>
          <p className="text-base md:text-lg leading-relaxed">
            রক্তদান একটি মহান মানবিক কাজ যা শুধুমাত্র একজন রোগীর জীবন বাঁচায়
            না, দাতার নিজের জন্যও স্বাস্থ্যগতভাবে উপকারী হতে পারে। নিয়মিত
            রক্তদান করলে শরীর সুস্থ থাকে, এবং এটি সামাজিক সচেতনতা বৃদ্ধি করে।
          </p>
        </section>
        <section>
          <h2 className="text-xl md:text-2xl font-semibold text-green-700">
            ✅ রক্তদানের শারীরিক উপকারিতা
          </h2>
          <ul className="list-disc pl-6 mt-3 space-y-2">
            <li>
              <strong>হৃদযন্ত্র সুস্থ থাকে:</strong> নিয়মিত রক্তদান করলে শরীরে
              অতিরিক্ত আয়রন কমে যায় যা হৃদরোগের ঝুঁকি হ্রাস করে।
            </li>
            <li>
              <strong>রক্ত সঞ্চালন উন্নত হয়:</strong> নতুন রক্ত তৈরি হয়, ফলে
              রক্তসঞ্চালন প্রক্রিয়া কার্যকর হয়।
            </li>
            <li>
              <strong>হিমোগ্লোবিন নিয়ন্ত্রণে থাকে:</strong> নিয়মিত রক্তদান
              হিমোগ্লোবিন ব্যালান্স বজায় রাখতে সাহায্য করে।
            </li>
            <li>
              <strong>ফ্রি হেলথ চেকআপ:</strong> রক্তদানের আগে আপনার ব্লাড
              প্রেসার, পালস রেট, হিমোগ্লোবিন লেভেল ইত্যাদি পরীক্ষা করা হয়।
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold text-blue-700">
            🧠 মানসিক ও সামাজিক উপকারিতা
          </h2>
          <ul className="list-disc pl-6 mt-3 space-y-2">
            <li>
              <strong>মানসিক শান্তি:</strong> কারো জীবন বাঁচাতে পারা একটি অনন্য
              অভিজ্ঞতা, যা আত্মতৃপ্তি এনে দেয়।
            </li>
            <li>
              <strong>সামাজিক সংযোগ:</strong> রক্তদানের মাধ্যমে সমাজে একটি
              শক্তিশালী বন্ধন সৃষ্টি হয় এবং সহমর্মিতা বাড়ে।
            </li>
            <li>
              <strong>নেতৃত্বের গুণাবলী গড়ে ওঠে:</strong> নিয়মিত রক্তদানের
              মাধ্যমে নেতৃত্ব ও দায়িত্ববোধের মানসিকতা গড়ে ওঠে।
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold text-purple-700">
            💬 রক্তদাতাদের অভিজ্ঞতা
          </h2>
          <blockquote className="border-l-4 border-red-500 pl-4 italic text-gray-700">
            “প্রথমবার রক্তদানের পর আমি শুধু একজন মানুষের জীবন বাঁচাইনি, বরং
            নিজের মধ্যেও পরিবর্তন অনুভব করেছি। এটি একটি গর্বের অনুভূতি।” —{" "}
            <p className="font-semibold">রাহাত হোসেন, ঢাকা</p>
          </blockquote>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold text-red-700">
            🔔 রক্তদানের পর যা করবেন:
          </h2>
          <ul className="list-disc pl-6 mt-3 space-y-2">
            <li>⏳ রক্তদানের পর অন্তত ১৫-২০ মিনিট বিশ্রাম নিন।</li>
            <li>🥤 প্রচুর পানি ও তরল খাবার গ্রহণ করুন।</li>
            <li>
              ⛔ অতিরিক্ত কাজ বা ভারী জিনিস তোলা থেকে বিরত থাকুন ২৪ ঘণ্টা।
            </li>
          </ul>
        </section>

        <footer className="pt-6 border-t text-center">
          <p className="text-gray-600 text-sm">
            রক্তদান একটি মহৎ কাজ — এটি করতে কোনো মূল্যের প্রয়োজন নেই, কিন্তু এটি
            কারো জীবন ফিরিয়ে দিতে পারে।
          </p>
          <p className="text-red-500 mt-2 font-semibold">
            “একজন রক্তদাতা, এক জীবন রক্ষাকারী।”
          </p>
        </footer>
      </article>
    </div>
  );
};

export default BenefitsPage;
