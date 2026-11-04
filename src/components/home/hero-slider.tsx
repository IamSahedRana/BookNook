"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper/types";
import { Icon } from "@/components/shared/icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

type Slide = {
  badge: string;
  dot: string;
  title: string;
  text: string;
  background: string;
  secondary: { label: string; href: string };
  covers: [string, string];
};

const SLIDES: Slide[] = [
  {
    badge: "A Library Built by Readers",
    dot: "bg-brand",
    title: "Borrow, read, return. Repeat.",
    text: "Seven days for every book. Return it with one click when you are done, and never worry about late fees.",
    background: "from-amber-50/90 via-rose-50/80 to-neutral-100",
    secondary: { label: "How it Works", href: "#how-borrowing-works" },
    covers: ["/images/mock/cover-01.svg", "/images/mock/cover-06.svg"],
  },
  {
    badge: "Shared Shelves",
    dot: "bg-emerald-600",
    title: "Share stories with fellow readers.",
    text: "Add the books you have finished and let other readers enjoy them. Every book you share becomes part of the community shelf.",
    background: "from-stone-100 via-orange-50/70 to-neutral-100",
    secondary: { label: "Add a Book", href: "/add-book" },
    covers: ["/images/mock/cover-04.svg", "/images/mock/cover-10.svg"],
  },
  {
    badge: "100% Free & Frictionless",
    dot: "bg-brand",
    title: "Plenty of books, zero overdue fees.",
    text: "Discover fiction, science, history and stories for kids, all shared by our readers and ready to borrow.",
    background: "from-rose-50/70 via-neutral-100 to-amber-50/60",
    secondary: { label: "Top Categories", href: "#top-categories" },
    covers: ["/images/mock/cover-07.svg", "/images/mock/cover-02.svg"],
  },
];

const TILTS = [
  ["-rotate-6", "rotate-[5deg]"],
  ["-rotate-[4deg]", "rotate-6"],
  ["-rotate-[5deg]", "rotate-[4deg]"],
];

export function HeroSlider() {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);

  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 pt-6 pb-4 sm:px-8">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-neutral-900 shadow-sm">
        <Swiper
          className="hero-swiper w-full"
          modules={[Autoplay, EffectFade, Pagination]}
          effect="fade"
          loop
          speed={500}
          autoplay={{ delay: 5500, disableOnInteraction: false, pauseOnMouseEnter: true }}
          pagination={{ clickable: true }}
          onSwiper={setSwiper}
        >
          {SLIDES.map((slide, index) => (
            <SwiperSlide key={slide.title}>
              <div
                className={cn(
                  "relative flex min-h-[460px] items-center bg-gradient-to-br p-8 text-neutral-900 sm:min-h-[500px] sm:p-14 lg:p-16",
                  slide.background
                )}
              >
                <div className="relative z-10 max-w-2xl">
                  <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-neutral-200/60 bg-white/90 px-3.5 py-1.5 text-xs font-semibold text-neutral-800 shadow-sm">
                    <span className={cn("size-2 rounded-full", slide.dot)} />
                    {slide.badge}
                  </span>
                  <h2 className="text-3xl leading-[1.15] font-extrabold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl">
                    {slide.title}
                  </h2>
                  <p className="mt-4 mb-8 max-w-xl text-base leading-relaxed text-neutral-600 sm:text-lg">
                    {slide.text}
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button asChild size="lg" className="gap-2 shadow-md">
                      <Link href="/books">
                        Browse Books
                        <Icon name="arrow_forward" size={18} />
                      </Link>
                    </Button>
                    <Link
                      href={slide.secondary.href}
                      className="rounded-full border border-neutral-200 bg-white/90 px-6 py-3.5 text-sm font-semibold text-neutral-800 transition-colors hover:bg-white"
                    >
                      {slide.secondary.label}
                    </Link>
                  </div>
                </div>

                {/* Decorative covers (large screens only) */}
                <div className="absolute top-1/2 right-12 hidden -translate-y-1/2 items-center gap-5 lg:flex xl:right-20">
                  {slide.covers.map((cover, i) => (
                    <div
                      key={cover}
                      className={cn(
                        "relative aspect-[3/4] overflow-hidden rounded-2xl border-4 border-white shadow-2xl transition-transform duration-300 hover:rotate-0",
                        i === 0 ? "w-48" : "w-52",
                        TILTS[index][i]
                      )}
                    >
                      <Image src={cover} alt="" fill sizes="208px" className="object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <button
          type="button"
          aria-label="Previous slide"
          onClick={() => swiper?.slidePrev()}
          className="absolute top-1/2 left-4 z-20 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-neutral-800 shadow-md transition-all hover:scale-105 hover:bg-white sm:flex"
        >
          <Icon name="chevron_left" size={22} />
        </button>
        <button
          type="button"
          aria-label="Next slide"
          onClick={() => swiper?.slideNext()}
          className="absolute top-1/2 right-4 z-20 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-neutral-800 shadow-md transition-all hover:scale-105 hover:bg-white sm:flex"
        >
          <Icon name="chevron_right" size={22} />
        </button>
      </div>
    </section>
  );
}
