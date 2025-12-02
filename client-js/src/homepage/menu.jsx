import { Link } from "react-router-dom";
import DialogueBox from "@/components/DialogueBox";
import { HeartHandshake, Star, Users, CalendarCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Home(){
    return (
        <div className="flex flex-col w-full">
            {/* 1. HERO SECTION (Gambar Bunga) */}
            <HomeMenu/>

            {/* 2. ABOUT SECTION (Apa itu John Wedding?) */}
            <AboutSection />

            {/* 3. TESTIMONIAL SECTION (Dialogue Box) */}
            <TestimonialSection />
        </div>
    )
}

// === DATA DUMMY TESTIMONI ===
const omori = {
    "Sunny": {
        "name": "Bimo",
        "portrait": "https://lilithdev.neocities.org/headspace/sprites/faces/DKSUNNY.png",
        "text": "enak banget bangke"
    },
    "Basil": {
        "name": "Bimo",
        "portrait": "https://lilithdev.neocities.org/headspace/sprites/faces/FABASIL21.png",
        "text": "Kalo mesen disini aku kecup nih, soalnya terbaik pokoknya"
    }
}

function AboutSection() {
    const features = [
        {
            icon: <HeartHandshake className="w-8 h-8 text-primary" />,
            title: "Terpercaya",
            desc: "Melayani ratusan pasangan sejak 2015 dengan reputasi bintang lima."
        },
        {
            icon: <Users className="w-8 h-8 text-primary" />,
            title: "Tim Profesional",
            desc: "Didukung oleh tim ahli yang siap mengatur setiap detail acara Anda."
        },
        {
            icon: <CalendarCheck className="w-8 h-8 text-primary" />,
            title: "Tepat Waktu",
            desc: "Manajemen waktu yang presisi agar acara berjalan lancar tanpa hambatan."
        }
    ];

    return (
        <section className="py-20 px-6 bg-background text-foreground scroll-mt-24">
            <div className="max-w-6xl mx-auto space-y-16">
                
                {/* Intro Text */}
                <div className="text-center space-y-6 max-w-3xl mx-auto">
                    <h2 id="about" className="text-3xl md:text-5xl font-serif font-bold text-primary tracking-tight">
                        Apa itu John Wedding?
                    </h2>
                    <div className="w-24 h-1.5 bg-primary/30 mx-auto rounded-full"></div>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        <span className="font-bold text-primary">John Wedding</span> adalah partner pernikahan impian Anda. 
                        Kami bukan sekadar Wedding Organizer, kami adalah sahabat yang membantu Anda merangkai momen sakral 
                        menjadi kenangan abadi. Dengan sentuhan personal dan desain elegan, kami memastikan hari bahagia Anda 
                        berjalan sempurna.
                    </p>
                </div>

                {/* Feature Cards */}
                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature, idx) => (
                        <Card key={idx} className="bg-card border-primary/20 hover:border-primary transition-all duration-300 shadow-sm hover:shadow-md group">
                            <CardContent className="p-8 flex flex-col items-center text-center gap-4">
                                <div className="p-4 bg-primary/10 rounded-full group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="font-serif text-xl font-bold text-foreground">{feature.title}</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

            </div>
        </section>
    )
}

// === KOMPONEN BARU: TESTIMONIAL SECTION ===
function TestimonialSection() {
    return (
        <section className="py-20 px-6 bg-muted/30 border-t border-border">
            <div className="max-w-4xl mx-auto flex flex-col gap-10">
                
                <div className="text-center space-y-2">
                    <div className="flex justify-center gap-1 mb-2">
                        {[1,2,3,4,5].map((i) => <Star key={i} className="w-5 h-5 text-primary fill-primary" />)}
                    </div>
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary">
                        Kata Pelanggan Kami
                    </h2>
                    <p className="text-muted-foreground">Cerita bahagia dari mereka yang telah kami bantu.</p>
                </div>

                {/* Menggunakan DialogueBox (Unsur yang diminta tetap ada) */}
                <div className="space-y-6">
                    <DialogueBox character={omori.Basil}/>
                </div>

            </div>
        </section>
    )
}

// === COMPONENT HERO (TETAP SAMA SEPERTI SEBELUMNYA) ===
function HomeMenu(){
    return (
        <div className="relative w-full h-[100vh] bg-cover bg-center bg-no-repeat flex items-center justify-center" style={{ backgroundImage: "url('/images/bunga.jpg')" }}>
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/20"></div>

                {/* Box Container */}
                <div className="relative z-10 w-[90%] max-w-md mx-auto shadow-2xl p-2 md:p-3 rounded-xl" style={{ backgroundColor: "#c0a080" }}>
                    <div className="border-2 rounded-lg border-white/50 p-8 md:p-10 flex flex-col items-center justify-center text-center">
                        <h1 className="text-white text-3xl md:text-4xl font-bold mb-3 font-serif tracking-wide drop-shadow-md">
                            John Wedding
                        </h1>
                        <p className="text-white/90 text-sm md:text-base mb-10 leading-relaxed font-light">
                            Wujudkan pernikahan impian Anda dengan sentuhan elegan dan profesional.
                        </p>
                        
                        <Link to="/paket" className="group">
                            <div className="bg-white/20 hover:bg-white/30 active:scale-95 transition-all px-8 py-3 rounded-full backdrop-blur-md cursor-pointer border border-white/40 shadow-lg group-hover:shadow-white/20">
                                <span className="text-white font-bold tracking-wider text-sm uppercase">Lihat Paket</span>
                            </div>   
                        </Link>

                    </div>             
                </div>
        </div>
    )
}