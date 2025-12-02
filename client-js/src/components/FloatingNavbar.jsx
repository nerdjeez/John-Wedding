"use client";
import React, { useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
// 1. Tambahkan import icon LogIn
import { HeartHandshake, Menu, X, ShoppingBag, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FloatingNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (latest > previous && latest > 100) {
      setVisible(false);
    } else {
      setVisible(true);
    }
  });

  const handleScrollToAbout = (e) => {
    e.preventDefault();
    setIsOpen(false);

    if (location.pathname === "/") {
      const element = document.getElementById("about");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate("/#about"); 
    }
  };

  const navLinks = [
    { name: "Home", link: "/" },
    { name: "About", link: "/#about", isScroll: true },
    { name: "Paket", link: "/paket" },
    { 
      name: <ShoppingBag className="w-5 h-5" />, 
      link: "/keranjang" 
    }
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: visible ? 0 : -100 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 inset-x-0 z-50 px-4 py-4 w-full flex justify-center pointer-events-none"
      >
        <div className="pointer-events-auto relative w-full max-w-3xl flex items-center justify-between rounded-full border border-primary/20 bg-card/90 px-6 py-2.5 shadow-xl backdrop-blur-md">
          
          {/* === KIRI: LOGO === */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-1.5 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
              <HeartHandshake className="h-5 w-5 text-primary" />
            </div>
            <span className="font-serif font-bold text-lg text-foreground tracking-tight">
              John<span className="text-primary">Wedding</span>
            </span>
          </Link>

          {/* === TENGAH: MENU (Home, Paket, Keranjang) === */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((item, idx) => (
              <Link
                key={idx}
                to={item.link}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary font-serif tracking-wide flex items-center",
                  item.link === "/keranjang" 
                    ? "p-2 rounded-full hover:bg-primary/10 text-foreground"
                    : isActive(item.link) ? "text-primary font-bold" : "text-foreground/80"
                )}
                title={item.link === "/keranjang" ? "Lihat Keranjang" : item.name}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* === KANAN: TOMBOL LOGIN & HAMBURGER === */}
          <div className="flex items-center gap-2">
            
            {/* 2. TOMBOL LOGIN (Desktop Only) */}
            <Link to="/login" className="hidden md:block">
                <Button 
                    size="sm" 
                    className="rounded-full font-bold shadow-md bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 px-5"
                >
                    <LogIn className="w-4 h-4" /> {/* Logo */}
                    <span>Login</span> {/* Teks */}
                </Button>
            </Link>

            {/* 3. HAMBURGER (Mobile Only) */}
            <button 
                className="md:hidden p-2 text-foreground hover:text-primary"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </motion.nav>

      {/* MENU MOBILE (Dropdown) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 inset-x-4 z-40 md:hidden pointer-events-auto"
          >
            <div className="bg-card border border-primary/20 rounded-2xl shadow-2xl p-4 flex flex-col gap-2">
              {navLinks.map((item, idx) => (
                <Link
                  key={idx}
                  to={item.link}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "px-4 py-3 rounded-xl text-center font-serif text-lg font-medium transition-colors hover:bg-muted text-foreground flex justify-center items-center gap-2",
                    isActive(item.link) ? "bg-primary/10 text-primary" : ""
                  )}
                >
                  {item.link === "/keranjang" ? (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      <span>Keranjang</span>
                    </>
                  ) : (
                    item.name
                  )}
                </Link>
              ))}
              
              <div className="h-px bg-border/50 my-1" />
              
              {/* TOMBOL LOGIN (Mobile Version) */}
              <Link to="/login" onClick={() => setIsOpen(false)}>
                  <Button className="w-full rounded-xl font-bold text-md py-6 bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2">
                    <LogIn className="w-5 h-5" />
                    Login Member
                  </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}