import { Logo } from "./Logo";
import Link from "next/link";
import { Github, Instagram, Linkedin, Send } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const socialLinks = [
  {
    name: "LinkedIn",
    icon: <Linkedin className="h-5 w-5" />,
    href: "https://www.linkedin.com/in/gm-katbar",
  },
  {
    name: "Instagram",
    icon: <Instagram className="h-5 w-5" />,
    href: "https://www.instagram.com/gm_katbar",
  },
  {
    name: "Github",
    icon: <Github className="h-5 w-5" />,
    href: "https://github.com/code-with-g-mustafa",
  },
];

const navLinks = {
  Platform: [
    { name: "About", href: "/#about" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Contact", href: "/#contact" },
  ],
};

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-card border-t text-card-foreground">
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-y-12 gap-x-8">
                    {/* Logo and Description */}
                    <div className="md:col-span-4 lg:col-span-4">
                        <Logo />
                        <p className="mt-4 text-muted-foreground text-base">
                            An AI-powered academic resource hub for students to collaborate, learn, and excel together.
                        </p>
                         <div className="flex items-center space-x-4 mt-6">
                            {socialLinks.map((social) => (
                                <Link key={social.name} href={social.href} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors duration-300">
                                    <span className="sr-only">{social.name}</span>
                                    {social.icon}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="md:col-span-8 lg:col-span-5 grid grid-cols-1 sm:grid-cols-1 gap-8">
                        {Object.entries(navLinks).map(([title, links]) => (
                            <div key={title}>
                                <h3 className="font-headline font-semibold tracking-wider text-foreground mb-4">{title}</h3>
                                <ul className="space-y-3">
                                    {links.map((link) => (
                                        <li key={link.name}>
                                            <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors duration-300 text-base">
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Newsletter Subscription */}
                    <div className="md:col-span-6 lg:col-span-3">
                         <h3 className="font-headline font-semibold tracking-wider text-foreground mb-4">Stay Connected</h3>
                         <p className="text-muted-foreground mb-4 text-base">
                            Subscribe to our newsletter for the latest updates.
                         </p>
                         <form className="flex gap-2">
                            <Input type="email" placeholder="Your Email" className="flex-grow"/>
                            <Button type="submit" size="icon" aria-label="Subscribe">
                                <Send className="h-5 w-5" />
                            </Button>
                         </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-16 pt-8 border-t text-center">
                    <p className="text-base text-muted-foreground">
                        &copy; {currentYear} Acadex by Ghulam Mustafa. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
