import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

export function ContactSection() {
    return (
        <section id="contact" className="container mx-auto px-4 py-16 md:py-24 bg-primary/5">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold font-headline">Contact Us</h2>
                <p className="text-lg text-muted-foreground mt-2">Have questions? We'd love to hear from you.</p>
            </div>
            <Card className="max-w-2xl mx-auto shadow-lg">
                <CardHeader>
                    <CardTitle className="font-headline">Get in Touch</CardTitle>
                    <CardDescription>Fill out the form below and we'll get back to you as soon as possible.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                             <Input placeholder="Your Name" />
                             <Input type="email" placeholder="Your Email" />
                        </div>
                        <Input placeholder="Subject" />
                        <Textarea placeholder="Your Message" rows={5} />
                        <Button type="submit" className="w-full">Send Message</Button>
                    </form>
                </CardContent>
            </Card>
        </section>
    );
}
