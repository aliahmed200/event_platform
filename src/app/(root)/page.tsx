import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <section className="py-5 md:py-10 bg-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-10 max-w-80 md:max-w-2xl lg:max-w-6xl m-auto">
          <div className="flex flex-col gap-8">
            <h1 className="font-bold text-[40px] leading-[48px] lg:text-[48px] lg:leading-[60px]  xl:text-[58px] xl:leading-[74px]">
              Host, Connect, Celebrate: Your Events, Our Platform!
            </h1>
            <p className="font-bold text-[20px] leading-[30px] tracking-[2%] md:font-normal md:text-[24px] md:leading-[36px]">
              Book and learn helpful tips from 3,168+ mentors in world-class
              companies with our global community.
            </p>
            <Button
              size="lg"
              asChild
              className="w-full sm:w-fit rounded-full bg-blue-700 py-6  "
            >
              <Link className="font-medium text-lg" href={"#events"}>
                Explore Now
              </Link>
            </Button>
          </div>
          <Image
            src="/assets/images/hero.png"
            alt="hero"
            width={1000}
            height={1000}
            className="max-h-[70vh] object-contain object-center xl:max-h-[60vh]"
          />
        </div>
      </section>
      <section
        id="events"
        className="max-w-80 md:max-w-2xl lg:max-w-6xl m-auto my-8 flex flex-col gap-8 md:gap-12"
      >
        <h2 className="font-bold text-[32px] leading-[40px] lg:text-[36px] lg:leading-[44px] xl:text-[40px] xl:leading-[48px]">
          Trust by <br /> Thousands of Events
        </h2>
        <div className="flex w-full flex-col gap-5 md:flex-row">
          searc cateoryfilter
        </div>
      </section>
    </>
  );
}
