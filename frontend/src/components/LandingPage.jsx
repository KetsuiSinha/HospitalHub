"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Hospital,
  Boxes,
  BellRing,
  UserCog,
  Menu,
  X,
  MoveRight,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function LandingPage({ onNavigate }) {
  const navigationItems = [
    { title: "Home", href: "#home" },
    {
      title: "Product",
      description: "Smarter healthcare powered by AI.",
      items: [
        { title: "Reports", href: "#features" },
        { title: "Statistics", href: "#features" },
        { title: "Dashboards", href: "#features" },
        { title: "Recordings", href: "#features" },
      ],
    },
    {
      title: "FAQ",
      description: "Learn more about Hospibot.",
      items: [
        { title: "About us", href: "#faq" },
        { title: "Safety", href: "#faq" },
        { title: "ERP", href: "#faq" },
      ],
    },
  ];

  const [isOpen, setOpen] = useState(false);
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["smarter", "faster", "reliable", "secure", "scalable"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTitleNumber((prev) => (prev === titles.length - 1 ? 0 : prev + 1));
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* ===== HEADER ===== */}
      <header className="w-full z-40 fixed top-0 left-0 bg-background border-b border-border">
        <div className="container mx-auto min-h-20 flex gap-4 flex-row lg:grid lg:grid-cols-3 items-center">
          {/* Navigation (Desktop) */}
          <div className="justify-start items-center gap-4 lg:flex hidden flex-row">
            <NavigationMenu>
              <NavigationMenuList className="flex gap-4">
                {navigationItems.map((item) => (
                  <NavigationMenuItem key={item.title}>
                    {item.href ? (
                      <NavigationMenuLink asChild>
                        <Link href={item.href}>
                          <Button variant="ghost">{item.title}</Button>
                        </Link>
                      </NavigationMenuLink>
                    ) : (
                      <>
                        <NavigationMenuTrigger>
                          {item.title}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent className="!w-[450px] p-4 rounded-lg shadow-lg bg-popover text-popover-foreground">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-base font-medium tracking-tight">
                                {item.title}
                              </p>
                              <p className="text-muted-foreground text-sm leading-relaxed">
                                {item.description}
                              </p>
                            </div>
                            <div className="flex flex-col text-sm">
                              {item.items?.map((subItem) => (
                                <NavigationMenuLink
                                  key={subItem.title}
                                  href={subItem.href}
                                  className="flex justify-between items-center hover:bg-muted py-2 px-4 rounded-md"
                                >
                                  <span>{subItem.title}</span>
                                  <MoveRight className="w-4 h-4 text-muted-foreground" />
                                </NavigationMenuLink>
                              ))}
                            </div>
                          </div>
                        </NavigationMenuContent>
                      </>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Logo */}
          <div className="flex lg:justify-center">
            <p className="font-bold text-lg text-primary tracking-tight">hospibot</p>
          </div>

          {/* Actions */}
          <div className="flex justify-end w-full gap-3">
            <Button
              variant="ghost"
              className="hidden md:inline"
              onClick={() => onNavigate("login")}
            >
              Sign in
            </Button>
            <Button onClick={() => onNavigate("signup")}>Sign up</Button>
          </div>

          {/* Mobile Menu */}
          <div className="flex w-12 shrink lg:hidden justify-end">
            <Button variant="ghost" onClick={() => setOpen(!isOpen)}>
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            {isOpen && (
              <div className="absolute top-20 border-t flex flex-col w-full right-0 bg-popover text-popover-foreground shadow-lg py-4 container gap-6">
                {navigationItems.map((item) => (
                  <div key={item.title} className="flex flex-col gap-2">
                    {item.href ? (
                      <Link
                        href={item.href}
                        className="flex justify-between items-center text-base font-medium"
                      >
                        <span>{item.title}</span>
                        <MoveRight className="w-4 h-4 text-muted-foreground" />
                      </Link>
                    ) : (
                      <p className="text-base font-medium">{item.title}</p>
                    )}
                    {item.items?.map((subItem) => (
                      <Link
                        key={subItem.title}
                        href={subItem.href}
                        className="flex justify-between items-center text-sm text-muted-foreground"
                      >
                        <span>{subItem.title}</span>
                        <MoveRight className="w-4 h-4" />
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section
        id="home"
        className="flex flex-col items-center justify-center gap-8 text-center pt-40 pb-20"
      >
        <Button variant="secondary" size="sm" className="gap-2">
          Made for doctors powered by engineers.
        </Button>
        <h1 className="text-4xl md:text-6xl tracking-tighter font-bold max-w-3xl">
          AI-powered healthcare made{" "}
          <span className="relative flex justify-center overflow-hidden md:pb-2 md:pt-1">
            &nbsp;
            {titles.map((title, index) => (
              <motion.span
                key={index}
                className="absolute text-primary"
                initial={{ opacity: 0, y: "-100" }}
                transition={{ type: "spring", stiffness: 50 }}
                animate={
                  titleNumber === index
                    ? { y: 0, opacity: 1 }
                    : { y: titleNumber > index ? -150 : 150, opacity: 0 }
                }
              >
                {title}
              </motion.span>
            ))}
          </span>
        </h1>
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed tracking-tight">
          Manage medicine inventory, real-time doctor alerts, and staff
          attendance—all in one minimal dashboard.
        </p>
        <div className="flex gap-3">
          <Button size="lg" variant="outline" onClick={() => onNavigate("login")}>
            Watch a Demo
          </Button>
          <Button size="lg" onClick={() => onNavigate("signup")}>
            Get Started <MoveRight className="w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" className="w-full py-20 lg:py-32 px-6 md:px-12">
        <div className="container mx-auto">
          <div className="flex flex-col gap-10">
            <div className="flex gap-4 flex-col items-start">
              <Badge>Platform</Badge>
              <div className="flex gap-2 flex-col">
                <h2 className="text-2xl md:text-4xl tracking-tighter max-w-xl font-semibold text-left">
                  Smarter healthcare management
                </h2>
                <p className="text-base md:text-lg max-w-lg leading-relaxed tracking-tight text-muted-foreground text-left">
                  Everything you need to streamline hospital operations.
                </p>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  title: "About Hospibot",
                  desc: "Smarter, AI-powered healthcare management.",
                  icon: Hospital,
                },
                {
                  title: "Inventory",
                  desc: "Auto-track stock, expiry, and alerts.",
                  icon: Boxes,
                },
                {
                  title: "AI Alerts",
                  desc: "Instant, location-aware notifications.",
                  icon: BellRing,
                },
                {
                  title: "Staff",
                  desc: "Manage attendance, roles, and shifts.",
                  icon: UserCog,
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-card text-card-foreground rounded-lg p-4 flex flex-col justify-between h-48 shadow-md"
                >
                  <item.icon className="w-6 h-6 stroke-1" />
                  <div>
                    <h3 className="text-base font-medium tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section id="faq" className="w-full py-20 lg:py-40 px-6 md:px-12">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-10">
            <div className="flex gap-10 flex-col">
              <Badge variant="outline">FAQ</Badge>
              <div className="flex gap-2 flex-col">
                <h4 className="text-2xl md:text-4xl tracking-tighter max-w-xl text-left font-semibold">
                  Frequently Asked Questions
                </h4>
                <p className="text-base md:text-lg max-w-lg leading-relaxed tracking-tight text-muted-foreground text-left">
                  Have questions? We’ve got answers. Learn how Hospibot helps
                  hospitals run smarter with AI-driven workflows.
                </p>
              </div>
            </div>

            <Accordion type="single" collapsible className="w-full">
              {[
                {
                  q: "How does Hospibot help doctors?",
                  a: "Hospibot reduces administrative burden by automating routine tasks like patient scheduling, report generation, and treatment reminders, so doctors can spend more time focusing on patients."
                },
                {
                  q: "Can Hospibot manage medicine expiry?",
                  a: "Yes, Hospibot auto-tracks your medicine inventory, alerts you about upcoming expirations, and helps prevent wastage by ensuring timely restocking."
                },
                {
                  q: "Does it track staff attendance?",
                  a: "Hospibot includes smart staff management features — it logs attendance, monitors shifts, and manages role-based access, making HR workflows smoother."
                },
                {
                  q: "Is my data secure?",
                  a: "Absolutely. Hospibot uses encrypted storage, secure authentication, and role-based permissions to ensure your hospital data stays protected at all times."
                },
                {
                  q: "Can Hospibot integrate with existing hospital systems?",
                  a: "Yes, Hospibot offers seamless integration with popular EMR and hospital management systems, so you can get started without overhauling your existing workflow."
                },
                {
                  q: "Does Hospibot provide AI-driven insights?",
                  a: "Hospibot analyzes patient records, staff performance, and operational data to provide predictive insights that help in decision-making and resource planning."
                },
                {
                  q: "Is Hospibot scalable for large hospitals?",
                  a: "Definitely. Hospibot is designed to scale — whether you're a small clinic or a multi-branch hospital chain, the system grows with your needs."
                }
              ].map((item, i) => (
                <AccordionItem key={i} value={"faq-" + i}>
                  <AccordionTrigger className="text-base font-medium tracking-tight">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>


      {/* ===== FOOTER ===== */}
      <footer className="w-full py-20 lg:py-40 bg-foreground text-background px-6 md:px-12">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            {/* Left */}
            <div className="flex gap-8 flex-col items-start">
              <div className="flex gap-2 flex-col">
                <h2 className="text-2xl md:text-4xl tracking-tighter max-w-xl font-semibold text-left">
                  hospibot
                </h2>
                <p className="text-base md:text-lg max-w-lg leading-relaxed tracking-tight text-background/75 text-left">
                  AI-driven hospital management for a smarter, healthier future.
                </p>
              </div>
              <div className="flex gap-20 flex-row">
                <div className="flex flex-col text-sm leading-relaxed tracking-tight text-background/75 text-left">
                </div>
              </div>
            </div>

            {/* Right navigation */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 items-start">
              {navigationItems.map((item) => (
                <div key={item.title} className="flex flex-col gap-2 items-start">
                  {item.href ? (
                    <Link href={item.href} className="text-base font-medium">
                      {item.title}
                    </Link>
                  ) : (
                    <p className="text-base font-medium">{item.title}</p>
                  )}
                  {item.items &&
                    item.items.map((subItem) => (
                      <Link
                        key={subItem.title}
                        href={subItem.href}
                        className="text-background/75 text-sm leading-relaxed"
                      >
                        {subItem.title}
                      </Link>
                    ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
