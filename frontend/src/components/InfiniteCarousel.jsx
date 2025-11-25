"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const images = [
    "/caraousel/hosp_1.png",
    "/caraousel/hosp_2.png",
    "/caraousel/hosp_3.png",
    "/caraousel/hosp_4.png",
    "/caraousel/hosp_5.png",
    "/caraousel/hosp_6.png",
];

export function InfiniteCarousel() {
    return (
        <div className="w-full overflow-hidden bg-background py-10">
            <div className="container mx-auto px-4 md:px-6 mb-8 text-center">
                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
                    Trusted by innovative healthcare providers
                </p>
            </div>
            <div className="relative w-full flex">
                <div className="absolute left-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-r from-background to-transparent" />
                <div className="absolute right-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-l from-background to-transparent" />

                <motion.div
                    className="flex gap-16 items-center flex-nowrap"
                    animate={{
                        x: ["0%", "-50%"],
                    }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: "loop",
                            duration: 30,
                            ease: "linear",
                        },
                    }}
                    style={{ width: "max-content" }}
                >
                    {/* Double the images to create seamless loop */}
                    {[...images, ...images].map((src, index) => (
                        <div
                            key={index}
                            className="relative w-40 h-20 flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-500 opacity-70 hover:opacity-100"
                        >
                            <Image
                                src={src}
                                alt={`Partner ${index + 1}`}
                                fill
                                className="object-contain"
                            />
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
