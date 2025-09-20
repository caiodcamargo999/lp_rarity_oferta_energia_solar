'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function NavigationPage() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center">
      <div className="text-center">
        <motion.h1 
          className="text-4xl md:text-6xl font-bold text-text-primary mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Rarity Agency
        </motion.h1>
        
        <motion.p 
          className="text-xl text-text-secondary mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          Escolha a versão do site que deseja visualizar
        </motion.p>
        
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Link 
              href="/"
              className="block bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-bold py-6 px-12 rounded-2xl text-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg"
            >
              Versão Raiz (/) - Todas as Seções Visíveis
            </Link>
            <p className="text-text-secondary mt-3">
              Seção de urgência e CTA aparecem desde o começo
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <Link 
              href="/2"
              className="block bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold py-6 px-12 rounded-2xl text-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg"
            >
              Versão /2 - Com Delays e Timing
            </Link>
            <p className="text-text-secondary mt-3">
              Seções aparecem após 1:00 e 1:20 de vídeo
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <Link 
              href="/4"
              className="block bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-6 px-12 rounded-2xl text-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg"
            >
              Versão /4 - Com Delays de 4 Minutos
            </Link>
            <p className="text-text-secondary mt-3">
              Seções aparecem após 4:00 e 4:20 de vídeo
            </p>
          </motion.div>
        </div>
        
        <motion.div 
          className="mt-16 text-text-secondary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <p className="text-sm">
            Rarity Agency © 2025 | Growth for Startups
          </p>
        </motion.div>
      </div>
    </main>
  )
}
