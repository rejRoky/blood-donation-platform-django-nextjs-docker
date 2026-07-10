import DonnersPage from "@/components/doners/DonnersPage";
import VisitorNotifier from "@/components/visitor_notifier/VisitorNotifier";

export const metadata = {
  title: "Dial For Blood-Donners",
  description: "Donate your red love to save one's life",
};

const Donners = () => {
  return (
    <>
      <DonnersPage />

      <VisitorNotifier />
    </>
  );
};

export default Donners;
