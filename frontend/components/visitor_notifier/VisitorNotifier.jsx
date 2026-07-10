"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Swal from "sweetalert2";

const VisitorNotifier = () => {
  const router = useRouter();

  useEffect(() => {
    const hasVisited = sessionStorage.getItem("visited");

    if (!hasVisited) {
      const timer = setTimeout(() => {
        Swal.fire({
          title: "জরুরী সতর্কতা!",
          text: "এই নম্বরটি শুধুমাত্র জরুরি রক্ত গ্রহীতাদের সেবা প্রদানের জন্য ব্যবহৃত হয়। যেকোনো অযাচিত কল, বিরক্তিকর বা হয়রানিমূলক আচরণের জন্য কঠোর আইনগত ব্যবস্থা নেওয়া হবে।",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "I Agree",
          cancelButtonText: "Deny",
        }).then((result) => {
          if (result.isConfirmed) {
            sessionStorage.setItem("visited", "true");
          } else {
            router.push("/fraud");
          }
        });
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [router]);

  return null;
};

export default VisitorNotifier;
