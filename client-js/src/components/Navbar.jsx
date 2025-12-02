"use client";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { HeartHandshake, Menu, X, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home", link: "/" },
    { name: "Paket", link: "/paket" },
    { name: "Hubungi", link: "#" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* NAVBAR UTAMA (Fixed Top) */}
      <nav className="fixed top-0 inset-x-0 z-50 px-4 py-4 w-full">
        <div className="relative mx-auto max-w-2xl flex items-center justify-between rounded-full border border-primary/20 bg-card/90 px-5 py-2.5 shadow-xl backdrop-blur-md">
          
          {/* 1. LOGO */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-1.5 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
              <HeartHandshake className="h-5 w-5 text-primary" />
            </div>
            <span className="font-serif font-bold text-lg text-foreground tracking-tight">
              John<span className="text-primary">Wedding</span>
            </span>
          </Link>

          {/* 2. MENU DESKTOP (Hidden di HP) */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((item, idx) => (
              <Link
                key={idx}
                to={item.link}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary font-serif tracking-wide",
                  isActive(item.link) ? "text-primary font-bold" : "text-foreground/80"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* 3. TOMBOL KERANJANG (Desktop) */}
          <div className="hidden md:block">
            <Button size="sm" className="rounded-full font-bold shadow-md bg-primary text-primary-foreground hover:bg-primary/90">
              Keranjang
            </Button>
          </div>

          {/* 4. TOMBOL HAMBURGER (Muncul Cuma di HP) */}
          <button 
            className="md:hidden p-2 text-foreground hover:text-primary"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>
      </nav>

      {/* MENU MOBILE (Slide Down) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 inset-x-4 z-40 md:hidden"
          >
            <div className="bg-card border border-primary/20 rounded-2xl shadow-2xl p-4 flex flex-col gap-2">
              {navLinks.map((item, idx) => (
                <Link
                  key={idx}
                  to={item.link}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "px-4 py-3 rounded-xl text-center font-serif text-lg font-medium transition-colors",
                    isActive(item.link) 
                      ? "bg-primary/10 text-primary" 
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  {item.name}
                </Link>
              ))}
              <div className="h-px bg-border/50 my-1" />
              <Button className="w-full rounded-xl font-bold text-md py-6">
                <ShoppingBag className="w-5 h-5 mr-2" />
                Lihat Keranjang
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}