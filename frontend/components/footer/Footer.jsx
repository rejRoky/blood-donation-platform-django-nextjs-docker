import { MdLocationPin } from "react-icons/md";
import { FaPhoneVolume } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="bg-red-600 grid grid-cols-12 gap-3 p-6 md:p-12 pb-8 text-white">
      <div className="col-span-12 md:col-span-8 text-justify me-6">
        <h5 className="text-white font-bold mb-2">
          ⚠ রক্তদানের প্রতারণা সম্পর্কে সতর্কতা ⚠
        </h5>

        <p className="text-sm">
          🔴 যেকোনো লেনদেন সম্পূর্ণ আপনার দায়িত্বে। আমরা শুধুমাত্র রক্তদাতার
          যোগাযোগের তথ্য প্রদান করি।
        </p>

        <p className="text-sm">
          ✅ রক্তদানের আগে প্রাপকের তথ্য নিশ্চিত করুন এবং প্রয়োজনে চিকিৎসকের
          পরামর্শ নিন। নিরাপদ পরিবেশে রক্তদান করুন এবং নিজের সুরক্ষার বিষয়ে
          সতর্ক থাকুন।
        </p>
      </div>

      <div className="col-span-12 md:col-span-4 lg:ms-16">
        <h5 className="text-white font-bold mb-2">যোগাযোগ</h5>
        <p className="flex items-center gap-2 text-sm">
          <MdLocationPin /> Rajshahi-6204, Boalia, Rajshahi
        </p>
        <p className="flex items-center gap-2 text-sm">
          <FaPhoneVolume /> <a href="tel:+8801521120421">+88 01521120421</a>
        </p>
        <p className="flex items-center gap-2 text-sm">
          {" "}
          <MdEmail />{" "}
          <a href="mailto:jamilakterup@gmail.com">jamilakterup@gmail.com</a>
        </p>
      </div>
    </div>
  );
};

export default Footer;
