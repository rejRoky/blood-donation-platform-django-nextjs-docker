import RegisterForm from "@/components/register/RegisterForm";
import { Button } from "@mui/material";
import Link from "next/link";
import React from "react";
import { FaArrowLeft } from "react-icons/fa";

const Register = () => {
  return (
    <div className="h-screen w-full lg:grid lg:grid-cols-2">
      <div className="bg-[#AC0102] flex justify-center items-center min-h-[30vh] md:min-h-[50vh]">
        <div className="flex justify-center items-center flex-col">
          <Link href="/" className="mb-5">
            <Button
              variant="outlined"
              className="flex justify-center items-center gap-2"
              sx={{ color: "white", fontWeight: "bold", borderColor: "white" }}
            >
              <FaArrowLeft /> Go Home
            </Button>
          </Link>
          <h1 className="text-4xl font-semibold text-white">Dial for Blood</h1>
          <p className="text-white text-xs my-2">
            Donate your blood to save ones life
          </p>
        </div>
      </div>
      <div className="bg-white pt-8 lg:pt-0">
        <RegisterForm />
      </div>
    </div>
  );
};

export default Register;
