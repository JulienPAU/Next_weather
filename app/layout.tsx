"use client";

import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { useState } from "react";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

// export const metadata: Metadata = {
//     title: "Météo",
//     description: "Météo et prévisions",
// };

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [isDark, setIsDark] = useState(false);

    return (
        <html lang="fr" className={isDark ? "dark" : ""}>
            <head>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
                <title>Météo</title>
                <meta name="description" content="Météo et prévisions" />
                <link rel="icon" type="image/png" href="/favicon.png" />
            </head>

            <body className={`${geistSans.variable} ${geistMono.variable} antialiased h-full sm:h-full lg:h-screen max-w-full mx-auto  ${isDark ? "bg-slate-900 text-white" : "bg-white text-black"}`}>
                <div className="text-center py-3">
                    <label htmlFor="flexSwitchCheckDefault" className="flex items-center justify-center gap-2 cursor-pointer">
                        {/* Icône dynamique */}
                        <i className={`fas ${isDark ? null : "fa-sun"} text-xl`}></i>
                        <input
                            className="mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-primary checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-neutral-600 dark:after:bg-neutral-400 dark:checked:bg-primary dark:checked:after:bg-primary dark:focus:before:shadow-[3px_-1px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca]"
                            type="checkbox"
                            role="switch"
                            id="flexSwitchCheckDefault"
                            onClick={() => {
                                setIsDark(!isDark);
                            }}
                        />
                        <i className={`fas ${isDark ? "fa-moon" : null} text-xl`}></i>
                    </label>
                </div>

                {children}
            </body>
        </html>
    );
}
