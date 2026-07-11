import ResetPassForm from "@/components/reset_pass_form/ResetPassForm";

export const metadata = {
  title: "Dial For Blood-Reset Password",
  description: "Donate your red love to save one's life",
};

const ResetPasswordPage = async ({ searchParams }) => {
  const params = await searchParams;
  const num = params?.num || "";
  const resetToken = params?.token || "";

  return (
    <div className="md:p-16 p-6 flex justify-center items-center h-[80vh]">
      <ResetPassForm phoneNumber={num} resetToken={resetToken} />
    </div>
  );
};

export default ResetPasswordPage;
