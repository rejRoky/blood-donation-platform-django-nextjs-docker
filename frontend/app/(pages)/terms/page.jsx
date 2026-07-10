export const metadata = {
  title: "Dial For Blood-Terms",
  description: "Donate your red love to save one's life",
};

const TermsPage = () => {
  return (
    <div className="p-6 md:p-12 bg-white rounded shadow-md text-gray-800 space-y-4 relative overflow-hidden">
      <div className="big-water-bg"></div>

      <h2 className="text-2xl font-bold text-red-600">
        ⚠ রক্তদানের প্রতারণা সম্পর্কে সতর্কতা ⚠
      </h2>
      <ul className="list-disc pl-6 space-y-2 text-justify">
        <li>
          🔴 এই প্ল্যাটফর্মটি শুধুমাত্র রক্তদাতাদের তথ্য সরবরাহ করে। যেকোনো
          আর্থিক লেনদেন বা প্রতারণার দায় ব্যবহারকারীর নিজস্ব।
        </li>
        <li>
          🔴 রক্তদানের পূর্বে অবশ্যই প্রাপকের পরিচয় ও প্রয়োজনীয়তা যাচাই করুন।
          সন্দেহ হলে রক্তদানের আগে চিকিৎসকের পরামর্শ নিন।
        </li>
        <li>
          🔴 নিরাপদ পরিবেশে রক্তদান করুন এবং অজানা বা অনিরাপদ স্থানে রক্তদান
          থেকে বিরত থাকুন।
        </li>
        <li>
          ❌ আমাদের প্ল্যাটফর্ম কোনো ধরনের অর্থনৈতিক চুক্তি, লেনদেন বা প্রতারণার
          জন্য দায়ী নয়।
        </li>
        <li>
          🚫 রক্তদানের বিনিময়ে অর্থ, উপহার বা কোনো সুবিধা দাবি করা সম্পূর্ণরূপে
          নিষিদ্ধ।
        </li>
      </ul>

      <h2 className="text-2xl font-bold text-green-700 pt-4">
        ✅ রক্তদাতার শর্তাবলী:
      </h2>
      <ul className="list-disc pl-6 space-y-2 text-justify">
        <li>
          🩸 রক্তদাতা হতে হলে আপনার বয়স <strong>১৮ থেকে ৬০ বছরের মধ্যে</strong>{" "}
          হতে হবে এবং ওজন <strong>৫০ কেজি বা তার বেশি</strong> হতে হবে।
        </li>
        <li>
          🕒 শেষ রক্তদানের পর কমপক্ষে <strong>৯০ দিন (৩ মাস)</strong> পার হতে
          হবে।
        </li>
        <li>
          🤒 আপনি যদি জ্বর, ইনফেকশন, হেপাটাইটিস, টিউবারকুলোসিস, HIV/AIDS বা অন্য
          কোনো সংক্রামক রোগে আক্রান্ত হন, তবে আপনি রক্তদান করতে পারবেন না।
        </li>
        <li>
          💉 রক্তদানের আগে ধূমপান, মদ্যপান এবং ওষুধ গ্রহণ থেকে বিরত থাকুন।
        </li>
      </ul>

      <h2 className="text-2xl font-bold text-blue-700 pt-4">
        📢 অন্যান্য শর্তাবলী:
      </h2>
      <ul className="list-disc pl-6 space-y-2 text-justify">
        <li>
          📞 রক্তদানের জন্য প্রাপক ও দাতার মধ্যে যোগাযোগ তাদের নিজ দায়িত্বে হবে।
        </li>
        <li>
          📝 দাতার দেয়া তথ্য সম্পূর্ণ সত্য এবং নিজস্ব সম্মতিতে প্রদান করা হয়েছে।
        </li>
        <li>
          🔐 আমাদের ওয়েবসাইটে দেয়া সব তথ্য গোপনীয়তা রক্ষা করে রাখা হয়, তবে
          প্রয়োজনে কর্তৃপক্ষ যাচাই করতে পারে।
        </li>
      </ul>

      <div className="pt-4">
        <p className="text-center text-red-500 font-semibold">
          🔔 দয়া করে সতর্ক থাকুন, সচেতন থাকুন এবং রক্তদানের মহৎ কাজে অংশ নিন।
        </p>
      </div>
    </div>
  );
};

export default TermsPage;
