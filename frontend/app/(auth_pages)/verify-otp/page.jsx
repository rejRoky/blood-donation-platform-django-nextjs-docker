import VerifyOtpForm from "@/components/verify_otp_form/VerifyOtpForm";

export const metadata = {
  title: "Dial For Blood-verify OTP",
  description: "Donate your red love to save one's life",
};

export default async function VerifyOtp({ searchParams }) {
  const params = await searchParams;
  const phoneNumber = params?.num || "";

  return (
    <div className="md:p-16 p-6 flex justify-center items-center h-[80vh]">
      <VerifyOtpForm phoneNumber={phoneNumber} />
    </div>
  );
}
