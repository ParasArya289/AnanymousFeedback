"use client";
import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

import messages from "@/messages.json";
export default function Home() {
  return (
    <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12">
      <section className="text-center mb-8 md:mb-12">
        <h1 className="text-3xl md:text-5xl font-bold">
          {" "}
          Dive into the world of <br />
          Anonymous Conversation
        </h1>
        <p className="mt-3 text-gray-600 text-base md:mt-4 md:text-lg">
          Share your thoughts, ideas, and feelings with anyone, anywhere,
          anonymously.
        </p>
      </section>
      <Carousel
        plugins={[Autoplay({ delay: 2000 })]}
        className="w-full max-w-xs"
      >
        <CarouselContent>
          {messages.map((message, index) => (
            <CarouselItem key={index}>
              <div className="p-4">
                <Card className="bg-white min-h-[200px]">
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm text-gray-600">
                      {message.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 border-t border-gray-100">
                    <p className="text-lg text-gray-800">{message.content}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {message.received}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </main>
  );
}
