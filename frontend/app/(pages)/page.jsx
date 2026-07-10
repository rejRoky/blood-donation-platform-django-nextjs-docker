import Banner from "@/components/banner/Banner";
import Benifit from "@/components/benefit/Benifit";
import DonnersCard from "@/components/donners_card/DonnersCard";
import VisitorNotifier from "@/components/visitor_notifier/VisitorNotifier";
import Link from "@mui/material/Link";

export default function Home() {
  return (
    <div>
      <Banner />

      <p className="text-center text-slate-700 font-bold text-sm sm:text-base mt-3">
        <em className="pe-1">ওয়েবসাইট ব্যবহারে সহায়তা পেতে,</em>
        <Link href="/user-manual">ইউজার ম্যানুয়াল দেখুন</Link>
      </p>

      <DonnersCard />

      <Benifit />

      <VisitorNotifier />
    </div>
  );
}
