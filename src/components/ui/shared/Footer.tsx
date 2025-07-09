import Image from "next/image";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="border-t py-4 px-16 ">
      <div className="flex flex-col md:flex-row justify-between items-center max-w-80 md:max-w-2xl lg:max-w-6xl m-auto">
        <Link href={"/"}>
          <Image
            src="/assets/images/logo.svg"
            alt="logo"
            width={128}
            height={38}
          />
        </Link>
        <p>2025 Evently. All Rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
