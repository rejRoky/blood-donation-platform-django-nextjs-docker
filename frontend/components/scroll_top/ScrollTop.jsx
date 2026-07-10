"use client";
import ScrollToTop from "react-scroll-to-top";

const ScrollTop = () => {
    return (
        <div className="relative z-[100]">
            <ScrollToTop smooth className="ps-[5px] animate-bounce" />
        </div>
    )
}

export default ScrollTop