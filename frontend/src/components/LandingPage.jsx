"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Hospital,
  Boxes,
  BellRing,
  UserCog,
  Menu,
  X,
  MoveRight,
  ArrowRight,
  Play,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { InfiniteCarousel } from "@/components/InfiniteCarousel";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function LandingPage() {
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
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTitleNumber((prev) => (prev === titles.length - 1 ? 0 : prev + 1));
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      {/* ===== HEADER ===== */}
      <header className="w-full z-50 fixed top-0 left-0 bg-background/80 backdrop-blur-md border-b border-border/40 supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto h-16 flex items-center justify-between px-4 md:px-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href="#home" className="flex items-center gap-2">
              <Image
                src="/logo_hospibot.png"
                alt="Hospibot Logo"
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <span className="font-bold text-xl tracking-tight">Hospibot</span>
            </Link>
          </div>

          {/* Navigation (Desktop) */}
          <div className="hidden lg:flex items-center gap-6">
            <NavigationMenu>
              <NavigationMenuList className="gap-2">
                {navigationItems.map((item) => (
                  <NavigationMenuItem key={item.title}>
                    {item.href ? (
                      <NavigationMenuLink asChild>
                        <Link href={item.href}>
                          <Button variant="ghost" className="text-sm font-medium">{item.title}</Button>
                        </Link>
                      </NavigationMenuLink>
                    ) : (
                      <>
                        <NavigationMenuTrigger className="text-sm font-medium bg-transparent">
                          {item.title}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent className="min-w-[300px] p-4 rounded-xl shadow-xl bg-popover border border-border">
                          <div className="grid gap-4">
                            <div className="space-y-1">
                              <h4 className="font-medium leading-none">{item.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {item.description}
                              </p>
                            </div>
                            <div className="grid gap-1">
                              {item.items?.map((subItem) => (
                                <Link
                                  key={subItem.title}
                                  href={subItem.href}
                                  className="group flex items-center justify-between rounded-lg px-3 py-2 hover:bg-muted/50 transition-colors"
                                >
                                  <span className="text-sm font-medium">{subItem.title}</span>
                                  <MoveRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>
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

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="mr-2"
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Button
              variant="ghost"
              className="hidden md:inline-flex"
              asChild
            >
              <Link href="/login">Log in</Link>
            </Button>
            <Button className="shadow-lg shadow-primary/20" asChild>
              <Link href="/signup">Get Started</Link>
            </Button>

            {/* Mobile Menu Toggle */}
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(!isOpen)}>
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-16 left-0 w-full bg-background border-b border-border p-4 lg:hidden shadow-2xl"
          >
            <div className="flex flex-col gap-4">
              {navigationItems.map((item) => (
                <div key={item.title} className="space-y-2">
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="block font-medium text-lg"
                      onClick={() => setOpen(false)}
                    >
                      {item.title}
                    </Link>
                  ) : (
                    <div className="font-medium text-lg text-muted-foreground">{item.title}</div>
                  )}
                  {item.items && (
                    <div className="pl-4 border-l-2 border-muted space-y-2">
                      {item.items.map((subItem) => (
                        <Link
                          key={subItem.title}
                          href={subItem.href}
                          className="block text-muted-foreground hover:text-foreground transition-colors"
                          onClick={() => setOpen(false)}
                        >
                          {subItem.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                <Button variant="outline" asChild onClick={() => setOpen(false)}>
                  <Link href="/login">Log in</Link>
                </Button>
                <Button asChild onClick={() => setOpen(false)}>
                  <Link href="/signup">Get Started</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </header>

      {/* ===== HERO ===== */}
      <section id="home" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl -z-10 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-[100px] mix-blend-multiply animate-blob" />
          <div className="absolute top-20 right-10 w-72 h-72 bg-purple-500/20 rounded-full blur-[100px] mix-blend-multiply animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-500/20 rounded-full blur-[100px] mix-blend-multiply animate-blob animation-delay-4000" />
        </div>

        <div className="container mx-auto px-4 md:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-6"
          >

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
              Healthcare management made{" "}
              <span className="relative inline-flex flex-col h-[1.1em] overflow-hidden align-bottom">
                <span className="invisible">smarter</span>
                <span className="absolute top-0 left-0 w-full">
                  {titles.map((title, index) => (
                    <motion.span
                      key={index}
                      className="absolute left-0 right-0 text-primary block"
                      initial={{ opacity: 0, y: "100%" }}
                      animate={
                        titleNumber === index
                          ? { y: 0, opacity: 1 }
                          : { y: titleNumber > index ? "-100%" : "100%", opacity: 0 }
                      }
                      transition={{ type: "spring", stiffness: 50 }}
                    >
                      {title}
                    </motion.span>
                  ))}
                </span>
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
              Streamline operations, manage inventory, and coordinate staff with an intelligent, all-in-one platform designed for modern hospitals.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Button size="lg" className="h-12 px-8 text-base shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all cursor-pointer" asChild>
                <Link href="/signup">
                  Get Started Free <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 text-base backdrop-blur-sm bg-background/50 cursor-pointer" asChild>
                <Link href="/login">
                  <Play className="mr-2 w-4 h-4 fill-current" /> Watch Demo
                </Link>
              </Button>
            </div>

            {/* Social Proof / Trust */}
          </motion.div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center text-center gap-4 mb-16">
            <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5">Features</Badge>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Everything you need to run smoothly</h2>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Powerful tools integrated into one seamless interface.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Smart Inventory",
                desc: "Real-time tracking of medicine stock, expiry dates, and automated reordering suggestions.",
                icon: Boxes,
                color: "text-blue-500",
                bg: "bg-blue-500/10",
              },
              {
                title: "Instant Alerts",
                desc: "Critical notifications for low stock, staff shortages, or emergency situations delivered instantly.",
                icon: BellRing,
                color: "text-red-500",
                bg: "bg-red-500/10",
              },
              {
                title: "Staff Management",
                desc: "Comprehensive scheduling, attendance tracking, and role-based access control for your team.",
                icon: UserCog,
                color: "text-green-500",
                bg: "bg-green-500/10",
              },
              {
                title: "Analytics Dashboard",
                desc: "Deep insights into hospital operations with customizable charts and exportable reports.",
                icon: Hospital,
                color: "text-purple-500",
                bg: "bg-purple-500/10",
              },
            ].map((item, idx) => (
              <Card key={idx} className="border-border/50 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 bg-background/50 backdrop-blur-sm">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${item.bg}`}>
                    <item.icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {item.desc}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section id="faq" className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="flex flex-col gap-6 sticky top-24">
              <Badge variant="outline" className="w-fit">FAQ</Badge>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                Common questions
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Everything you need to know about the product and billing. Can't find the answer you're looking for? Please chat to our friendly team.
              </p>
              <Button className="w-fit" variant="outline">Contact Support</Button>
            </div>

            <div className="w-full">
              <Accordion type="single" collapsible className="w-full space-y-4">
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
                    q: "Can Hospibot integrate with existing systems?",
                    a: "Yes, Hospibot offers seamless integration with popular EMR and hospital management systems, so you can get started without overhauling your existing workflow."
                  },
                ].map((item, i) => (
                  <AccordionItem key={i} value={"faq-" + i} className="border border-border/50 rounded-lg px-4 bg-card/50">
                    <AccordionTrigger className="text-base font-medium hover:no-underline py-4">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-4 leading-relaxed">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-soft-light"></div>
        <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Ready to modernize your hospital?</h2>
          <p className="text-primary-foreground/80 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Join hundreds of healthcare providers who trust Hospibot for their daily operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="h-14 px-8 text-lg text-primary font-semibold" asChild>
              <Link href="/signup">Get Started Now</Link>
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg bg-transparent border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10" asChild>
              <Link href="/login">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-12 bg-background border-t border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <Link href="#home" className="flex items-center gap-2 mb-4">
                <Image
                  src="/logo_hospibot.png"
                  alt="Hospibot Logo"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
                <span className="font-bold text-lg">Hospibot</span>
              </Link>
              <p className="text-muted-foreground max-w-xs leading-relaxed">
                AI-driven hospital management for a smarter, healthier future. Built with ❤️ for healthcare heroes.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">Features</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Security</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Roadmap</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-border gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Hospibot Inc. All rights reserved.
            </p>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
