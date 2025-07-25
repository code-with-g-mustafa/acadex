import { Logo } from "./Logo";
import Link from "next/link";
import { Github, Twitter, Linkedin } from "lucide-react";
import { Button } from "./ui/button";

const footerNavs = [
  {
    label: "About",
    href: "/#about",
  },
  {
    label: "Contact",
    href: "/#contact",
  },
  {
    label: "Dashboard",
    href: "/dashboard",
  },
];

const socialLinks = [
  {
    icon: <Twitter />,
    href: "#",
  },
  {
    icon: <Linkedin />,
    href: "#",
  },
  {
    icon: <Github />,
    href: "#",
  },
];


export function Footer() {
    return (
        <footer className="bg-card border-t text-card-foreground">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-center md:text-left">
                        <Logo />
                        <p className="mt-2 text-muted-foreground max-w-md">
                            Your AI-powered hub for university notes, past papers, and smart study tools.
                        </p>
                    </div>
                    <div className="flex flex-col items-center md:items-end gap-4">
                         <ul className="flex items-center gap-4">
                            {footerNavs.map((item) => (
                                <li key={item.label} className="text-muted-foreground hover:text-foreground transition-colors">
                                    <Link href={item.href}>{item.label}</Link>
                                </li>
                            ))}
                        </ul>
                         <div className="flex items-center gap-2">
                             {socialLinks.map((item, idx) => (
                                <Button key={idx} asChild variant="ghost" size="icon">
                                    <Link href={item.href}>
                                        {item.icon}
                                    </Link>
                                </Button>
                             ))}
                        </div>
                    </div>
                </div>
                 <div className="mt-8 pt-4 border-t text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} Acadex. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}