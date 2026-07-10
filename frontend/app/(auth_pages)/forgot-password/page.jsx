import ForgotPassForm from "@/components/forgot_pass_form/ForgotPassForm";

export const metadata = {
  title: "Dial For Blood-forgot password",
  description: "Donate your red love to save one's life",
};

const ForgotPasswordPage = () => {
  return (
    <div className="md:p-16 p-6 flex justify-center items-center h-[80vh]">
      <ForgotPassForm />
    </div>
  );
};

export default ForgotPasswordPage;
