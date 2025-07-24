export function StatsSection() {
    return (
        <section className="bg-primary/10">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-primary/20">
                    <div className="py-4 md:py-0">
                        <p className="text-3xl font-bold font-headline text-primary">10+</p>
                        <p className="text-muted-foreground">Universities</p>
                    </div>
                    <div className="py-4 md:py-0">
                        <p className="text-3xl font-bold font-headline text-primary">2,000+</p>
                        <p className="text-muted-foreground">Notes & Papers</p>
                    </div>
                    <div className="py-4 md:py-0">
                        <p className="text-3xl font-bold font-headline text-primary">Powered by AI</p>
                        <p className="text-muted-foreground">Smart Assistance</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
