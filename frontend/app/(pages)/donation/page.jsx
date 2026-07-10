import DonationForm from "@/components/donation_form/DonationForm";

export const metadata = {
  title: "Dial For Blood-donate fund",
  description: "Donate your red love to save one's life",
};

const DonationPage = () => {
  return (
    <div className="md:p-16 p-6 flex justify-center items-center h-[80vh]">
      <div className="max-w-lg w-full bg-white/60 rounded-lg shadow-lg p-5 sm:p-16 border border-red-200 relative overflow-hidden">
        <DonationForm />
      </div>
    </div>
  );
};

export default DonationPage;
