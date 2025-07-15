import HeroVideoDialogDemo, {
  HeroVideoDialog,
} from "@/components/HeroVideoDialog";
import { Navbarrr } from "@/components/Navbarrr";
import ScrollingTestimonials from "@/components/TestimonialCard";
import { Button } from "@/components/ui/button";

import Squares from "@/components/ui/Squares";
import VerticalTiles from "@/components/vertical-tiles";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { InfiniteSlider } from "../../components/motion-primitives/infinite-slider";
import { ProgressiveBlur } from "../../components/motion-primitives/progressive-blur";
import Features from "@/components/Features";
import FAQs from "@/components/Faq";
import FooterSection from "@/components/Footer";
import { CountingNumber } from "@/components/animate-ui/text/counting-number";

export default function Home() {
  const testimonials = [
    {
      name: "John Doe",
      job: "Founder of XCL",
      image:
        "https://images.unsplash.com/photo-1560298803-1d998f6b5249?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "This platform helped us achieve amazing results!",
    },
    {
      name: "Sarah Smith",
      job: "CEO of Intelcia",
      image:
        "https://images.unsplash.com/photo-1566753323558-f4e0952af115?q=80&w=1921&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "An intuitive and efficient way to engage our audience.",
    },
    {
      name: "Mike Brown",
      job: "Brand Manager",
      image:
        "https://images.unsplash.com/photo-1518287010730-4386819bf3e9?q=80&w=2020&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "Our UGC strategy improved dramatically.",
    },
  ];
  return (
    <>
      <div className="min-h-screen w-full bg-white relative text-gray-800">
        {/* Crosshatch Art - Light Pattern */}
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: `
        repeating-linear-gradient(22.5deg, transparent, transparent 2px, rgba(75, 85, 99, 0.06) 2px, rgba(75, 85, 99, 0.06) 3px, transparent 3px, transparent 8px),
        repeating-linear-gradient(67.5deg, transparent, transparent 2px, rgba(107, 114, 128, 0.05) 2px, rgba(107, 114, 128, 0.05) 3px, transparent 3px, transparent 8px),
        repeating-linear-gradient(112.5deg, transparent, transparent 2px, rgba(55, 65, 81, 0.04) 2px, rgba(55, 65, 81, 0.04) 3px, transparent 3px, transparent 8px),
        repeating-linear-gradient(157.5deg, transparent, transparent 2px, rgba(31, 41, 55, 0.03) 2px, rgba(31, 41, 55, 0.03) 3px, transparent 3px, transparent 8px)
      `,
          }}
        />
        <div className="sticky top-0 z-20">
          <Navbarrr />
        </div>
        <div className="relative h-screen mx-5 rounded-xl  bg-gradient-to-b from-yellow-300 to-white bg-background text-foreground">
          {/* Navbar with sticky position */}
          <div className="flex flex-col gap-3 justify-center items-center pt-24">
            <h1 className="semi text-7xl text-center text-gray-900">
              Unleash the Power <br />
              of UGC for Your Brand
            </h1>
            <p className="text-lg text-center text-gray-700">
              Connect brands with talented creators to produce genuine,
              <br /> engaging content that resonates and converts.
            </p>
          </div>

          {/* Hero Content */}
        </div>
        <div className="px-32 lg:-mt-64 xl:-mt-80">
          <HeroVideoDialogDemo />
        </div>
        <div className="bg-white h-full w-full flex justify-center items-center  py-28">
          <div className="flex flex-col gap-3 justify-center items-center ">
            <h1 className="semi text-5xl text-center text-gray-900">
              Unleash the Power <br />
              of UGC for Your Brand
            </h1>
            <p className="text-base text-center text-gray-700">
              Connect brands with talented creators to produce genuine,
              <br /> engaging content that resonates and converts.
            </p>
            <div className="flex gap-x-10">
              <button
                className="inline-flex semi bg-yellow-300 h-12 cursor-pointer touch-manipulation items-center justify-center overflow-hidden whitespace-nowrap rounded-lg border-0 px-4 font-mono leading-none text-slate-800 no-underline shadow-[rgba(45,35,66,0.4)_0_2px_4px,rgba(45,35,66,0.3)_0_7px_13px_-3px,#D6D6E7_0_-3px_0_inset] transition-all duration-150 ease-in-out hover:-translate-y-0.5 hover:shadow-[rgba(45,35,66,0.4)_0_4px_8px,rgba(45,35,66,0.3)_0_7px_13px_-3px,#D6D6E7_0_-3px_0_inset] focus:shadow-[#D6D6E7_0_0_0_1.5px_inset,rgba(45,35,66,0.4)_0_2px_4px,rgba(45,35,66,0.3)_0_7px_13px_-3px,#D6D6E7_0_-3px_0_inset] active:translate-y-0.5 active:shadow-[#D6D6E7_0_3px_7px_inset]"
                role="button"
              >
                I'm a brand
              </button>
              <button
                className="inline-flex semi bg-yellow-300 h-12 cursor-pointer touch-manipulation items-center justify-center overflow-hidden whitespace-nowrap rounded-lg border-0 px-4 font-mono leading-none text-slate-800 no-underline shadow-[rgba(45,35,66,0.4)_0_2px_4px,rgba(45,35,66,0.3)_0_7px_13px_-3px,#D6D6E7_0_-3px_0_inset] transition-all duration-150 ease-in-out hover:-translate-y-0.5 hover:shadow-[rgba(45,35,66,0.4)_0_4px_8px,rgba(45,35,66,0.3)_0_7px_13px_-3px,#D6D6E7_0_-3px_0_inset] focus:shadow-[#D6D6E7_0_0_0_1.5px_inset,rgba(45,35,66,0.4)_0_2px_4px,rgba(45,35,66,0.3)_0_7px_13px_-3px,#D6D6E7_0_-3px_0_inset] active:translate-y-0.5 active:shadow-[#D6D6E7_0_3px_7px_inset]"
                role="button"
              >
                I'm a creator
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-hidden">
          <ScrollingTestimonials data={testimonials} />
        </div>
        <Features />
        {/* LOGOS FLOWTING */}
        {/* <section className="bg-background ">
            <div className="group relative m-auto max-w-7xl ">
              <div className="flex flex-col items-center  ">
                <div className="text-start flex pb-10">
                  <p className="semi text-4xl ">Trusted teams </p>
                  <CountingNumber
                    inView={true}
                    fromNumber={0}
                    number={45}
                    className="semi text-4xl"
                  />
                </div>
                <div className="relative py-6 md:w-[calc(100%-11rem)]">
                  <InfiniteSlider speedOnHover={20} speed={40} gap={112}>
                    <div className="flex">
                      <img
                        className="mx-auto h-5 w-fit dark:invert"
                        src="https://html.tailus.io/blocks/customers/nvidia.svg"
                        alt="Nvidia Logo"
                        height="20"
                        width="auto"
                      />
                    </div>

                    <div className="flex">
                      <img
                        className="mx-auto h-4 w-fit dark:invert"
                        src="https://html.tailus.io/blocks/customers/column.svg"
                        alt="Column Logo"
                        height="16"
                        width="auto"
                      />
                    </div>
                    <div className="flex">
                      <img
                        className="mx-auto h-4 w-fit dark:invert"
                        src="https://html.tailus.io/blocks/customers/github.svg"
                        alt="GitHub Logo"
                        height="16"
                        width="auto"
                      />
                    </div>
                    <div className="flex">
                      <img
                        className="mx-auto h-5 w-fit dark:invert"
                        src="https://html.tailus.io/blocks/customers/nike.svg"
                        alt="Nike Logo"
                        height="20"
                        width="auto"
                      />
                    </div>
                    <div className="flex">
                      <img
                        className="mx-auto h-5 w-fit dark:invert"
                        src="https://html.tailus.io/blocks/customers/lemonsqueezy.svg"
                        alt="Lemon Squeezy Logo"
                        height="20"
                        width="auto"
                      />
                    </div>
                    <div className="flex">
                      <img
                        className="mx-auto h-4 w-fit dark:invert"
                        src="https://html.tailus.io/blocks/customers/laravel.svg"
                        alt="Laravel Logo"
                        height="16"
                        width="auto"
                      />
                    </div>
                    <div className="flex">
                      <img
                        className="mx-auto h-7 w-fit dark:invert"
                        src="https://html.tailus.io/blocks/customers/lilly.svg"
                        alt="Lilly Logo"
                        height="28"
                        width="auto"
                      />
                    </div>

                    <div className="flex">
                      <img
                        className="mx-auto h-6 w-fit dark:invert"
                        src="https://html.tailus.io/blocks/customers/openai.svg"
                        alt="OpenAI Logo"
                        height="24"
                        width="auto"
                      />
                    </div>
                  </InfiniteSlider>

                  <div className="bg-linear-to-r from-background absolute inset-y-0 left-0 w-20"></div>
                  <div className="bg-linear-to-l from-background absolute inset-y-0 right-0 w-20"></div>
                  <ProgressiveBlur
                    className="pointer-events-none absolute left-0 top-0 h-full w-20"
                    direction="left"
                    blurIntensity={1}
                  />
                  <ProgressiveBlur
                    className="pointer-events-none absolute right-0 top-0 h-full w-20"
                    direction="right"
                    blurIntensity={1}
                  />
                </div>
              </div>
            </div>
          </section> */}

        {/* Stats */}
        <section className="py-12 md:py-20">
          <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
            <div className="relative z-10 mx-auto max-w-2xl space-y-6 text-center">
              <h2 className="text-4xl semi lg:text-6xl">
                Decliclab in numbers
              </h2>
              <p>
                Gemini is evolving to be more than just the models. It supports
                an entire to the APIs and platforms helping developers and
                businesses innovate.
              </p>
            </div>

            <div className="grid gap-12 divide-y *:text-center md:grid-cols-3 md:gap-2 md:divide-x md:divide-y-0">
              <div className="space-y-4">
                <div className="text-5xl font-bold">
                  <CountingNumber
                    inView={true}
                    fromNumber={0}
                    number={200}
                    className=""
                  />
                </div>
                <p>Number of campaigns</p>
              </div>
              <div className="space-y-4">
                <div className="text-5xl font-bold">
                  +
                  <CountingNumber
                    inView={true}
                    fromNumber={0}
                    number={95}
                    className=""
                  />
                  K
                </div>
                <p>Active Users</p>
              </div>
              <div className="space-y-4">
                <div className="text-5xl font-bold">
                  <CountingNumber
                    inView={true}
                    fromNumber={0}
                    number={820}
                    className=""
                  />
                </div>
                <p>Average engagement rate</p>
              </div>
            </div>
          </div>
        </section>
        <FAQs />
        <FooterSection />
      </div>
    </>
  );
}
