import { motion } from 'framer-motion';

const WORDS = [
  { kanji: '自律', label: 'DISCIPLINA' },
  { kanji: '集中', label: 'FOCO' },
  { kanji: '名誉', label: 'HONRA' },
  { kanji: '継続', label: 'CONSTÂNCIA' },
  { kanji: '成長', label: 'EVOLUÇÃO' },
  { kanji: '力', label: 'FORÇA' },
  { kanji: '知恵', label: 'SABEDORIA' },
];

export function KanjiMarquee() {
  return (
    <div className="w-full overflow-hidden bg-gold/5 dark:bg-gold/5 border-y border-gold/10 py-12 relative">
      {/* Gradientes laterais para suavizar a entrada/saída */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-paper dark:from-[#050505] to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-paper dark:from-[#050505] to-transparent z-10" />

      <motion.div
        className="flex gap-24 whitespace-nowrap"
        animate={{ x: "-50%" }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 30, // Ajuste a velocidade aqui
        }}
      >
        {/* Duplicamos a lista 4 vezes para garantir o loop infinito sem buracos */}
        {[...WORDS, ...WORDS, ...WORDS, ...WORDS].map((word, index) => (
          <div key={index} className="flex flex-col items-center justify-center group cursor-default">
            <span className="text-4xl md:text-5xl font-display font-bold text-charcoal/10 dark:text-white/10 group-hover:text-gold/40 transition-colors duration-500">
              {word.kanji}
            </span>
            <span className="text-xs font-bold tracking-[0.3em] text-gold mt-2">
              {word.label}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}