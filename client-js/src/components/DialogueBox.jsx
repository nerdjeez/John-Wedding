import { Card } from "@/components/ui/card";

export default function DialogueBox({ character }) {
  // Jika data kosong, jangan tampilkan apa-apa
  if (!character) return null;

  return (
    <Card className="max-w-2xl mx-auto mt-4 overflow-hidden border-2 border-primary bg-card text-card-foreground">
      <div className="flex flex-row h-32 md:h-40">
        
        {/* BAGIAN GAMBAR (PORTRAIT) */}
        <div className="shrink-0 w-32 md:w-40 bg-accent/20 border-r-2 border-primary flex items-center justify-center p-2">
            <img 
                src={character.portrait} 
                alt={character.name} 
                className="w-full h-full object-contain pixelated" 
                // pixelated agar gambar pixel art tetap tajam
                style={{ imageRendering: "pixelated" }} 
            />
        </div>

        {/* BAGIAN TEKS */}
        <div className="flex flex-col flex-1 p-4 md:p-6 justify-start relative">
            
            {/* Nama Karakter */}
            <h3 className="font-bold text-lg text-primary uppercase tracking-widest mb-1">
                {character.name}
            </h3>

            {/* Isi Dialog */}
            <p className="text-base md:text-lg leading-relaxed font-mono">
                "{character.text}"
            </p>

            {/* Segitiga kecil (indikator next) - Hiasan */}
            <div className="absolute bottom-4 right-4 w-3 h-3 bg-primary animate-bounce rounded-full"></div>
        </div>
      </div>
    </Card>
  );
}