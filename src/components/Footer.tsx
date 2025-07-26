import { Logo } from "./Logo";
import Link from "next/link";
import { Github, Instagram, Linkedin } from "lucide-react";

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
    Navigate: [
        { name: "Home", href: "/" },
        { name: "About", href: "/#about" },
        { name: "Dashboard", href: "/dashboard" },
        { name: "Contact", href: "/#contact" },
    ],
    Legal: [
        { name: "Terms of Service", href: "#" },
        { name: "Privacy Policy", href: "#" },
    ]
}

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-card border-t text-card-foreground">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Logo and Description */}
                    <div className="md:col-span-4">
                        <Logo />
                        <p className="mt-4 text-muted-foreground max-w-xs">
                            An AI-powered academic resource hub for students to collaborate, learn, and excel together.
                        </p>
                    </div>

                    {/* Navigation Links */}
                    <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
                        {Object.entries(navLinks).map(([title, links]) => (
                            <div key={title}>
                                <h3 className="font-headline font-semibold tracking-wider text-foreground mb-4">{title}</h3>
                                <ul className="space-y-3">
                                    {links.map((link) => (
                                        <li key={link.name}>
                                            <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors duration-300">
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted-foreground">
                        &copy; {currentYear} Acadex by Ghulam Mustafa. All rights reserved.
                    </p>
                    <div className="flex items-center space-x-4">
                        {socialLinks.map((social) => (
                            <Link key={social.name} href={social.href} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors duration-300">
                                <span className="sr-only">{social.name}</span>
                                {social.icon}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}