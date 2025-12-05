import { Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { KanjiMarquee } from '../../components/landing/KanjiMarquee'; // <--- Importe do Carrossel
import { Trophy, Zap, Target, ArrowRight, LayoutDashboard } from 'lucide-react';
import { Logo } from '../../components/ui/Logo';
import { useAuth } from '../../context/AuthContext';

export function LandingPage() {
  const { session } = useAuth();

  // Variantes de animação tipadas
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.8, 
        ease: "easeOut" 
      } 
    }
  };

  return (
    <div className="min-h-screen bg-paper dark:bg-[#050505] transition-colors duration-500 overflow-hidden">
      
      {/* --- Navbar --- */}
      <nav className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
        <Link to="/" className="hover:opacity-80 transition-opacity">
          {/* Logo na Navbar */}
          <Logo size="sm" className="flex-row gap-2" textClassName="text-xl" />
        </Link>
        
        <div className="flex gap-4">
          {session ? (
            <Link to="/dashboard">
              <Button variant="secondary" size="sm">
                <LayoutDashboard size={16} className="mr-2" />
                Ir para Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">Entrar</Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="shadow-glow">Começar Agora</Button>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <main className="max-w-4xl mx-auto px-6 pt-20 pb-24 text-center">
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          <motion.div variants={item} className="inline-block">
            <span className="px-3 py-1 rounded-full border border-gold/30 bg-gold/5 text-gold text-xs font-bold uppercase tracking-widest">
              Sistema de Hábitos Gamificado
            </span>
          </motion.div>

          <motion.h1 variants={item} className="text-5xl md:text-7xl font-display font-bold text-charcoal dark:text-white leading-tight">
            Transforme disciplina <br />
            em <span className="text-gradient-gold">Arte</span>.
          </motion.h1>

          <motion.p variants={item} className="text-lg md:text-xl text-charcoal-light dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            O Izanagi combina a simplicidade do minimalismo com a motivação dos jogos. 
            Rastreie hábitos, ganhe XP e conquiste sua melhor versão.
          </motion.p>

          <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/register" className="w-full sm:w-auto">
              <Button size="lg" fullWidth className="shadow-glow text-lg px-8">
                Iniciar Jornada <ArrowRight size={20} className="ml-2" />
              </Button>
            </Link>
            {!session && (
              <Link to="/login" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" fullWidth>
                  Já tenho conta
                </Button>
              </Link>
            )}
          </motion.div>
        </motion.div>
      </main>

      {/* --- Kanji Marquee (Carrossel Infinito) --- */}
      <KanjiMarquee />

      {/* --- Features Section --- */}
      <section className="bg-white dark:bg-[#0A0A0A] py-24 border-t border-gold/10">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Feature 1 */}
            <Card className="text-center p-8 hover:border-gold/30 transition-colors h-full">
              <div className="w-14 h-14 bg-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-gold">
                <Target size={32} />
              </div>
              <h3 className="text-xl font-display font-bold text-charcoal dark:text-white mb-3">Foco Absoluto</h3>
              <p className="text-charcoal-light dark:text-gray-400">
                Interface limpa e livre de distrações. Gerencie hábitos diários e semanais com clareza mental.
              </p>
            </Card>

            {/* Feature 2 */}
            <Card className="text-center p-8 hover:border-gold/30 transition-colors h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-5">
                <Trophy size={100} />
              </div>
              <div className="w-14 h-14 bg-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-gold">
                <Trophy size={32} />
              </div>
              <h3 className="text-xl font-display font-bold text-charcoal dark:text-white mb-3">Gamificação Real</h3>
              <p className="text-charcoal-light dark:text-gray-400">
                Ganhe XP a cada check. Suba de nível. Desbloqueie conquistas douradas ao manter sua constância.
              </p>
            </Card>

            {/* Feature 3 */}
            <Card className="text-center p-8 hover:border-gold/30 transition-colors h-full">
              <div className="w-14 h-14 bg-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-gold">
                <Zap size={32} />
              </div>
              <h3 className="text-xl font-display font-bold text-charcoal dark:text-white mb-3">Evolução Visual</h3>
              <p className="text-charcoal-light dark:text-gray-400">
                Acompanhe seu progresso com gráficos elegantes e veja sua disciplina se transformar em dados.
              </p>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="py-8 text-center text-charcoal-light dark:text-gray-600 text-sm bg-paper dark:bg-[#050505]">
        <p>© 2025 Izanagi System. Construído com disciplina.</p>
      </footer>
    </div>
  );
}