import lineImg from "@/public/assets/line.png";
import { Button } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

const Benifit = () => {
  return (
    <div className="mt-32 mb-12">
      <h2 className="text-center uppercase font-bold">Benefits</h2>
      <Image
        src={lineImg}
        alt="line image"
        className="mx-auto -translate-x-2 -translate-y-2"
      />

      <div className="parallax-bg h-[250px] md:h-[320px]">
        <div className="h-full w-full backdrop-blur-sm flex flex-col justify-center items-center bg-black/50 text-white text-2xl md:text-4xl px-6 md:px-0 font-bold text-center">
          <p className="mb-6">
            Read article about the benefits of blood donation.
          </p>
          <Link href="/benefits">
            <Button
              className="py-3 md:py-4 md:px-10"
              variant="contained"
              sx={{ bgcolor: "#B91C1C", "&:hover": { bgcolor: "#a50202" } }}
            >
              Read Article
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Benifit;
