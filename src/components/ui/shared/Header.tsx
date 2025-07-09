import Image from "next/image";
import Link from "next/link";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "../button";
import NavItems from "./NavItems";
import MobileNav from "./MobileNav";

const Header = () => {
  return (
    <header className="border-b py-4">
      <div className="flex justify-between items-center max-w-80 md:max-w-2xl lg:max-w-6xl m-auto">
        <Link href={"/"}>
          <Image src="/assets/images/logo.svg" alt="" width={128} height={32} />
        </Link>
        <SignedIn>
          <nav className="hidden md:flex w-full max-w-xs">
            <NavItems />
          </nav>
        </SignedIn>
        <div>
          <SignedIn>
            <div className="flex gap-4 ">
              <UserButton afterSwitchSessionUrl="/" />
              <MobileNav />
            </div>
          </SignedIn>
          <SignedOut>
            <Button asChild className="rounded-full " size="lg">
              <Link href="/sign-in">Login </Link>
            </Button>
          </SignedOut>
        </div>
      </div>
    </header>
  );
};

export default Header;
