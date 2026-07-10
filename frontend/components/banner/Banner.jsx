"use client";
import map from "@/public/assets/map.png";
import Image from "next/image";
import bloodBanner from "@/public/assets/blood.png";
import { FaHandHoldingDollar } from "react-icons/fa6";
import { BiSolidDonateBlood } from "react-icons/bi";
import { Button } from "@mui/material";
import { motion } from "motion/react";
import Link from "next/link";

const intro = {
  hidden: { opacity: 0, x: -500 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      bounce: 0.4,
      staggerChildren: 0.1,
      delayChildren: 0,
    },
  },
};

const introChildren = {
  hidden: { opacity: 0, x: -500 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      bounce: 0.4,
    },
  },
};

const imgIntro = {
  hidden: { opacity: 0, y: -500 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      bounce: 0.6,
    },
  },
};

const Banner = () => {
  return (
    <>
      <div className="bg-white relative z-10 overflow-hidden -mt-7">
        <Image
          src={map}
          alt="banner"
          className="absolute w-full h-[140vh] md:h-[90vh] object-cover object-top opacity-10 -z-10"
        />
        <div className="grid grid-cols-12 mx-6 md:mx-12">
          <motion.div
            variants={intro}
            initial="hidden"
            animate="visible"
            className="col-span-12 sm:col-span-7 mt-12"
          >
            <motion.h1
              variants={introChildren}
              className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold uppercase poppins-extrabold"
            >
              Donate <span className="text-red-700">Blood </span> Save Lives
            </motion.h1>
            <motion.p
              variants={introChildren}
              className="md:text-sm lg:text-base text-slate-800 my-4"
            >
              Blood donation is the gift of life. A single donation can help
              save multiple lives, giving hope and healing to those in critical
              need. By donating blood, you are not only giving a gift of life
              but also offering a second chance to those who need it most.
            </motion.p>

            <motion.div
              variants={introChildren}
              className="flex flex-col md:flex-row md:items-center w-fit gap-3 md:gap-4 mb-5"
            >
              <Link href="/donation">
                <Button
                  variant="contained"
                  color="error"
                  className="flex items-center gap-2"
                >
                  <FaHandHoldingDollar className="text-xl" /> Donate Fund
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  variant="outlined"
                  color="error"
                  className="flex items-center gap-2"
                >
                  <BiSolidDonateBlood className="text-xl" /> Donate Blood
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            className="col-span-12 sm:col-span-5 my-auto"
            variants={imgIntro}
            initial="hidden"
            animate="visible"
          >
            <Image
              src={bloodBanner}
              className="animate-pulse"
              alt="blood banner image"
            />
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Banner;
