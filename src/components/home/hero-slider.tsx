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
  covers: string[];
};

const SLIDES: Slide[] = [
  {
    badge: "A Library Built by Readers",
    dot: "bg-brand",
    title: "Borrow, read, return. Repeat.",
    text: "Seven days for every book. Return it with one click when you are done, and never worry about late fees.",
    background: "from-amber-50/90 via-rose-50/80 to-neutral-100",
    secondary: { label: "How it Works", href: "#how-borrowing-works" },
    covers: [
      "/images/mock/cover-01.jpg",
      "/images/mock/cover-02.jpg",
      "/images/mock/cover-03.jpg",
    ],
  },
  {
    badge: "Shared Shelves",
    dot: "bg-emerald-600",
    title: "Share stories with fellow readers.",
    text: "Add the books you have finished and let other readers enjoy them. Every book you share becomes part of the community shelf.",
    background: "from-stone-100 via-orange-50/70 to-neutral-100",
    secondary: { label: "Add a Book", href: "/add-book" },
    covers: [
      "/images/mock/cover-04.jpg",
      "/images/mock/cover-05.jpg",
      "/images/mock/cover-06.jpg",
    ],
  },
  {
    badge: "100% Free & Frictionless",
    dot: "bg-brand",
    title: "Plenty of books, zero overdue fees.",
    text: "Discover fiction, science, history and stories for kids, all shared by our readers and ready to borrow.",
    background: "from-rose-50/70 via-neutral-100 to-amber-50/60",
    secondary: { label: "Top Categories", href: "#top-categories" },
    covers: [
      "/images/mock/cover-07.jpg",
      "/images/mock/cover-08.jpg",
      "/images/mock/cover-09.jpg",
    ],
  },
];

const POSITIONS = [
  { cls: "left-0 top-14 w-36 h-56", ry: -20, delay: "0s" },
  { cls: "left-28 top-0 w-40 h-60 z-10 shadow-2xl", ry: -12, delay: "-1.6s" },
  { cls: "left-60 top-16 w-36 h-56", ry: -24, delay: "-3.2s" },
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
          fadeEffect={{ crossFade: true }}
          loop
          speed={500}
          autoplay={{ delay: 5500, disableOnInteraction: false, pauseOnMouseEnter: true }}
          pagination={{ clickable: true }}
          onSwiper={setSwiper}
        >
          {SLIDES.map((slide) => (
            <SwiperSlide key={slide.title}>
              <div
                className={cn(
                  "relative flex min-h-[480px] items-center bg-gradient-to-br px-8 py-12 text-neutral-900 sm:min-h-[520px] sm:px-14 lg:px-16",
                  slide.background
                )}
              >
                <div className="mx-auto grid w-full max-w-7xl items-center gap-10 md:grid-cols-2">
                  <div className="relative z-10 max-w-xl text-left">
                    <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-neutral-200/60 bg-white/90 px-3.5 py-1.5 text-xs font-semibold text-neutral-800 shadow-sm">
                      <span className={cn("size-2 rounded-full", slide.dot)} />
                      {slide.badge}
                    </span>
                    <h2 className="text-3xl leading-[1.15] font-extrabold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl">
                      {slide.title}
                    </h2>
                    <p className="mt-4 mb-8 max-w-lg text-base leading-relaxed text-neutral-600 sm:text-lg">
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

                  {/* 3D Animated Book Covers Stack */}
                  <div className="hidden justify-center md:flex">
                    <div className="relative h-[340px] w-[420px]">
                      {slide.covers.map((cover, i) => {
                        const pos = POSITIONS[i] || POSITIONS[0];
                        return (
                          <div
                            key={cover + i}
                            className={cn(
                              "book-3d absolute overflow-hidden rounded-2xl border-4 border-white shadow-2xl transition-transform duration-300 hover:rotate-0 hover:scale-105",
                              pos.cls
                            )}
                            style={{
                              "--ry": `${pos.ry}deg`,
                              animationDelay: pos.delay,
                            } as React.CSSProperties}
                          >
                            <Image
                              src={cover}
                              alt="Book cover"
                              fill
                              sizes="160px"
                              className="object-cover"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
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
