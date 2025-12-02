"use client";
import { cn } from "@/lib/utils";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { HeartHandshake } from "lucide-react"; // Icon Logo
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "motion/react";

import React, { useRef, useState } from "react";

export const Navbar = ({
  children,
  className
}) => {
  const ref = useRef(null);
  const { scrollY } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 100) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  });

  return (
    <motion.div
      ref={ref}
      className={cn("fixed inset-x-0 top-6 z-50 w-full px-4", className)}>
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child, { visible })
          : child)}
    </motion.div>
  );
};

export const NavBody = ({
  children,
  className,
  visible
}) => {
  return (
    <motion.div
      animate={{
        // Ganti warna background saat scroll menjadi 'card' (coklat sedikit terang)
        backgroundColor: visible ? "hsl(var(--card))" : "transparent",
        backdropFilter: visible ? "blur(10px)" : "none",
        // Border muncul saat scroll
        border: visible ? "1px solid hsl(var(--border))" : "1px solid transparent",
        width: visible ? "60%" : "100%", // Lebar mengecil saat scroll
        y: visible ? 0 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 50,
      }}
      style={{
        minWidth: "300px", // Mencegah terlalu kecil di layar sempit
      }}
      className={cn(
        "relative  z-60 mx-auto hidden flex-row items-center justify-between self-start rounded-full px-6 py-3 lg:flex",
        className
      )}>
      {children}
    </motion.div>
  );
};

export const NavItems = ({
  items,
  className,
  onItemClick
}) => {
  const [hovered, setHovered] = useState(null);

  return (
    <motion.div
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "absolute inset-0 hidden flex-1 flex-row items-center justify-center space-x-2 text-sm font-medium transition duration-200 lg:flex lg:space-x-4",
        className
      )}>
      {items.map((item, idx) => (
        <a
          onMouseEnter={() => setHovered(idx)}
          onClick={onItemClick}
          className={cn(
            "relative px-4 py-2 transition-colors",
            // Warna teks default (krem) dan hover (emas)
            "text-foreground/80 hover:text-primary font-serif tracking-wide"
          )}
          key={`link-${idx}`}
          href={item.link}>
          {hovered === idx && (
            <motion.div
              layoutId="hovered"
              // Warna background saat hover (coklat tua transparan)
              className="absolute inset-0 h-full w-full rounded-full bg-primary/10" 
            />
          )}
          <span className="relative z-20">{item.name}</span>
        </a>
      ))}
    </motion.div>
  );
};

export const MobileNav = ({
  children,
  className,
  visible
}) => {
  return (
    <motion.div
      animate={{
        backgroundColor: visible ? "hsl(var(--card))" : "transparent",
        backdropFilter: visible ? "blur(10px)" : "none",
        border: visible ? "1px solid hsl(var(--border))" : "1px solid transparent",
        width: visible ? "95%" : "100%",
        padding: visible ? "12px 20px" : "12px 0px",
        borderRadius: visible ? "2rem" : "0rem",
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 50,
      }}
      className={cn(
        "relative z-50 mx-auto flex w-full max-w-[calc(100vw-2rem)] flex-col items-center justify-between bg-transparent lg:hidden",
        className
      )}>
      {children}
    </motion.div>
  );
};

export const MobileNavHeader = ({
  children,
  className
}) => {
  return (
    <div
      className={cn("flex w-full flex-row items-center justify-between", className)}>
      {children}
    </div>
  );
};

export const MobileNavMenu = ({
  children,
  className,
  isOpen,
  onClose
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={cn(
            // Dropdown menu mobile: Background Card & Border
            "absolute inset-x-0 top-16 z-50 flex w-full flex-col items-start justify-start gap-4 rounded-2xl bg-card border border-border px-6 py-8 shadow-xl",
            className
          )}>
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const MobileNavToggle = ({
  isOpen,
  onClick
}) => {
  return isOpen ? (
    <IconX className="text-foreground hover:text-primary transition-colors" onClick={onClick} />
  ) : (
    <IconMenu2 className="text-foreground hover:text-primary transition-colors" onClick={onClick} />
  );
};

export const NavbarLogo = () => {
  return (
    <a
      href="/"
      className="relative z-20 mr-4 flex items-center space-x-2 px-2 py-1 text-sm font-normal">
      
      {/* Icon Wedding / Cincin */}
      <HeartHandshake className="h-6 w-6 text-primary" />
      
      <span className="font-serif font-bold text-lg text-foreground tracking-wider">
        John<span className="text-primary">Wedding</span>
      </span>
    </a>
  );
};

export const NavbarButton = ({
  href,
  as: Tag = "a",
  children,
  className,
  variant = "primary",
  ...props
}) => {
  const baseStyles =
    "px-6 py-2 rounded-full text-sm font-bold relative cursor-pointer hover:-translate-y-0.5 transition duration-200 inline-block text-center";

  const variantStyles = {
    primary:
      // Tombol Primary: Emas, Teks Coklat Gelap
      "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md",
    secondary: 
      // Tombol Secondary: Transparan, Teks Krem, Border Tipis
      "bg-transparent text-foreground border border-border hover:bg-accent/50",
    dark: 
      "bg-secondary text-secondary-foreground shadow-md",
  };

  return (
    <Tag
      href={href || undefined}
      className={cn(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      {children}
    </Tag>
  );
};