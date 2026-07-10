import { Button } from "@mui/material";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

export const metadata = {
  title: "Dial For Blood-Payment Success",
  description: "Donate your red love to save one's life",
};

const PaymentSuccessPage = () => {
  return (
    <div className="md:p-16 p-6 flex justify-center items-center h-[80vh]">
      <div className="max-w-xl text-center w-full bg-white rounded-lg shadow-lg p-5 sm:p-16 border border-red-200 relative overflow-hidden">
        <div className="secondary-card p-4">
          <h1 className="text-3xl font-bold text-green-700">
            Payment Successful!
          </h1>
          <p className="mt-2 text-gray-600">Thank you for your donation.</p>

          <div className="flex justify-center items-center mt-4">
            <Link href="/">
              <Button
                variant="outlined"
                className="flex items-center gap-2"
                sx={{
                  color: "green",
                  fontWeight: "bold",
                  borderColor: "green",
                }}
              >
                <FaArrowLeft /> Go Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
