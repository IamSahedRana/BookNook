import type { Metadata } from "next";
import { HeroSlider } from "@/components/home/hero-slider";
import { HowItWorks } from "@/components/home/how-it-works";
import { NewArrivals } from "@/components/home/new-arrivals";
import { TopCategories } from "@/components/home/top-categories";

export const metadata: Metadata = { title: { absolute: "BookNook | Home" } };

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <NewArrivals />
      <HowItWorks />
      <TopCategories />
    </>
  );
}
