import Image from "next/image";
import openMenu from "@/public/assets/open_menu.png";
import clickDonors from "@/public/assets/click_donors.png";
import searchDonors from "@/public/assets/search_donors.png";
import donorsDesktop from "@/public/assets/donors_desktop.png";
import regiserDesktop from "@/public/assets/regiser_desktop.png";
import registerPhone from "@/public/assets/register_phone.png";
import mobileDash1 from "@/public/assets/mobile_dash_1.png";
import mobileDash2 from "@/public/assets/mobile_dash_2.png";
import mobileDash3 from "@/public/assets/mobile_dash_3.png";
import desktopDash1 from "@/public/assets/desktop_dash_1.png";
import desktopDash2 from "@/public/assets/desktop_dash_2.png";
import desktopProfile from "@/public/assets/desktop_profile.png";
import mobileProfile from "@/public/assets/mobile_profile.png";

const page = () => {
  return (
    <div className="p-4 md:p-12 bg-white rounded shadow-md text-gray-800 space-y-8 relative overflow-hidden leading-relaxed max-w-full">
      <div className="big-water-bg"></div>

      <h2 className="text-2xl md:text-3xl font-bold text-red-600 text-center">
        🩸 রক্তদাতা ও রক্তগ্রহীতার জন্য নির্দেশিকা
      </h2>

      {/* Blood Receiver Section */}
      <section className="max-w-full overflow-hidden">
        <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
          👉 রক্তগ্রহীতা (Receiver)
        </h3>
        <ul className="list-disc list-inside space-y-2">
          <li>
            রক্তগ্রহীতা সাইটে প্রবেশ করলে <b>All Donors</b> পেজ থেকে সব দাতার
            তথ্য দেখতে পারবেন।
          </li>
          <li>
            সেখানে রক্তের গ্রুপ, জেলা ও উপজেলা (এলাকা) দিয়ে সহজেই ফিল্টার করে
            পছন্দসই দাতা খুঁজে পাওয়া যাবে।
          </li>
          <li>
            পছন্দসই দাতার প্রোফাইলে দেওয়া মোবাইল নম্বরে কল করে সরাসরি যোগাযোগ
            করতে পারবেন।
          </li>
        </ul>

        <div className="mt-4 space-y-4">
          <em className="text-red-600 font-bold block">For Mobile User</em>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <Image
              src={openMenu}
              alt="open menu"
              className="w-full h-auto rounded border-2"
            />
            <Image
              src={clickDonors}
              alt="click donors"
              className="w-full h-auto rounded border-2"
            />
            <Image
              src={searchDonors}
              alt="search donors"
              className="w-full h-auto rounded border-2"
            />
          </div>

          <em className="text-red-600 font-bold block mt-4">
            For Desktop User
          </em>
          <Image
            src={donorsDesktop}
            alt="donors desktop"
            className="w-full h-auto rounded border-2"
          />
        </div>
      </section>

      {/* Blood Donor Section */}
      <section className="max-w-full overflow-hidden">
        <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
          👉 রক্তদাতা (Donor)
        </h3>
        <ul className="list-disc list-inside space-y-2">
          <li>রক্ত দিতে চাইলে আপনাকে প্রথমে সদস্য (Member) হতে হবে।</li>
          <li>
            <b>Register Page</b> বা হোমপেজে থাকা <b>“Donate Blood”</b> বাটনে
            ক্লিক করে রেজিস্ট্রেশন করলে আপনি ডোনার হয়ে যাবেন।
          </li>
          <li>
            রেজিস্ট্রেশন সম্পন্ন হলে আপনাকে <b>Login Page</b>-এ নিয়ে যাওয়া হবে।
          </li>
          <li>
            লগইন করার পর আপনি <b>User Dashboard</b>-এ প্রবেশ করবেন।
          </li>
        </ul>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <em className="text-red-600 font-bold block">For Mobile User</em>
            <Image
              src={registerPhone}
              alt="register mobile"
              className="w-full h-auto rounded border-2"
            />
          </div>
          <div>
            <em className="text-red-600 font-bold block">For Desktop User</em>
            <Image
              src={regiserDesktop}
              alt="register desktop"
              className="w-full h-auto rounded border-2"
            />
          </div>
        </div>
      </section>

      {/* Donation Section */}
      <section className="max-w-full overflow-hidden">
        <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
          👉 ড্যাশবোর্ড থেকে রক্তদান
        </h3>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <b>“Add Donation”</b> বাটনে ক্লিক করে নতুন রক্তদানের তথ্য যোগ করতে
            পারবেন।
          </li>
          <li>
            একবার রক্তদানের তথ্য যোগ করলে আপনার আইডি{" "}
            <b>১২০ দিনের জন্য স্বয়ংক্রিয়ভাবে নিষ্ক্রিয় (Disabled)</b> হয়ে যাবে।
          </li>
          <li>
            ১২০ দিন পূর্ণ হলে আপনার মোবাইলে একটি <b>SMS</b> যাবে এবং আপনার আইডি
            আবার স্বয়ংক্রিয়ভাবে সক্রিয় হবে।
          </li>
          <li>
            আইডি সক্রিয় হলে তা আবার <b>Donors Page</b>-এ দৃশ্যমান হবে।
          </li>
          <li>
            ডোনেশন হিস্ট্রি মুছতে চাইলে মোবাইলে স্ক্রল করে ডান পাশে{" "}
            <b>Delete</b> বাটন পাবেন।
          </li>
        </ul>

        <div className="mt-4 space-y-4">
          <em className="text-red-600 font-bold block">For Mobile User</em>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <Image
              src={mobileDash1}
              alt="mobile dashboard 1"
              className="w-full h-auto rounded border-2"
            />
            <Image
              src={mobileDash2}
              alt="mobile dashboard 2"
              className="w-full h-auto rounded border-2"
            />
            <Image
              src={mobileDash3}
              alt="mobile dashboard 3"
              className="w-full h-auto rounded border-2"
            />
          </div>

          <em className="text-red-600 font-bold block mt-4">
            For Desktop User
          </em>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Image
              src={desktopDash1}
              alt="desktop dashboard 1"
              className="w-full h-auto rounded border-2"
            />
            <Image
              src={desktopDash2}
              alt="desktop dashboard 2"
              className="w-full h-auto rounded border-2"
            />
          </div>
        </div>
      </section>

      {/* Profile Management Section */}
      <section className="max-w-full overflow-hidden">
        <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
          👉 প্রোফাইল ম্যানেজমেন্ট
        </h3>
        <ul className="list-disc list-inside space-y-2">
          <li>
            যদি কোনো কারণে রক্তদান করতে না চান, তবে প্রোফাইল থেকে{" "}
            <b>Deactivate</b> করতে পারবেন।
          </li>
          <li>
            আপনি চাইলে <b>Standby Mode</b> চালু করতে পারবেন। এই মোডে থাকলে আপনার
            আইডি দাতার তালিকার শীর্ষে দেখাবে।
          </li>
          <li>
            প্রোফাইল থেকে আপনার মোবাইল নম্বর, রক্তদানের স্থান, ও অন্যান্য তথ্য
            পরিবর্তন করতে পারবেন।
          </li>
        </ul>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <em className="text-red-600 font-bold block">For Mobile User</em>
            <Image
              src={mobileProfile}
              alt="mobile profile"
              className="w-full h-auto rounded border-2"
            />
          </div>
          <div>
            <em className="text-red-600 font-bold block">For Desktop User</em>
            <Image
              src={desktopProfile}
              alt="desktop profile"
              className="w-full h-auto rounded border-2"
            />
          </div>
        </div>
      </section>

      <div className="p-4 bg-red-50 border-l-4 border-red-500 mt-6 rounded">
        <p className="font-medium text-red-700">
          📌 নোট: সঠিক তথ্য দিন যাতে রক্তগ্রহীতা সহজে আপনার সাথে যোগাযোগ করতে
          পারেন।
        </p>
      </div>
    </div>
  );
};

export default page;
