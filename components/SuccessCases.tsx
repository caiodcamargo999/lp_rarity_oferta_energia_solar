'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState, useEffect } from 'react'

interface SuccessCasesProps {
  version?: "1" | "2"
}

const successData = [
  {
    title: "Vendas Mensais",
    metric: "+347%",
    description: "Empresa de energia solar"
  },
  {
    title: "ROI em Marketing",
    metric: "+2.8x",
    description: "Retorno sobre investimento"
  },
  {
    title: "Custo de Aquisição",
    metric: "-65%",
    description: "Redução de custos"
  }
]

export default function SuccessCases({ version = "1" }: SuccessCasesProps) {
  const [showUrgency, setShowUrgency] = useState(false)
  const [showCTA, setShowCTA] = useState(false)

  useEffect(() => {
    if (version === "1") {
      // Versão 1: mostrar tudo desde o começo
      setShowUrgency(true)
      setShowCTA(true)
    } else if (version === "2") {
      // Versão 2: mostrar com delays
      const timer1 = setTimeout(() => setShowUrgency(true), 60000) // 1:00
      const timer2 = setTimeout(() => setShowCTA(true), 80000)    // 1:20
      
      return () => {
        clearTimeout(timer1)
        clearTimeout(timer2)
      }
    }
  }, [version])

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 2, ease: "easeOut" }}
      className="py-12 px-4"
    >
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-4xl md:text-5xl font-bold text-center mb-12"
        >
          <span className="gradient-text">Resultados Comprovados</span>
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {successData.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.2, duration: 0.8 }}
              whileHover={{ 
                y: -5,
                transition: { duration: 0.3 }
              }}
              className="card-enhanced rounded-xl p-6 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-500 mb-3 text-center">{item.metric}</div>
                <h3 className="text-lg font-semibold text-text-primary text-center">{item.title}</h3>
                <p className="text-gray-300 text-sm mt-2">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Seção de Urgência - Posicionada abaixo de "Resultados Comprovados" */}
        {showUrgency && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="mt-16 px-4 md:px-0"
          >
            <div className="bg-gradient-to-r from-primary-500/20 to-secondary-500/20 border border-primary-500/30 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
              <div className="text-center">
                <div className="flex flex-col md:flex-row items-center justify-center mb-6 gap-4">
                  <div className="w-12 h-12 bg-primary-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                                                <h3 className="text-xl md:text-2xl font-bold text-primary-400 text-center">
                                ATENÇÃO: ÚLTIMA CHANCE ESTE MÊS
                              </h3>
                            </div>
                            <p className="text-text-secondary text-base md:text-lg mb-6 max-w-4xl mx-auto leading-relaxed px-2">
                              <strong className="text-primary-400 text-lg md:text-xl">Somente 3 empresas de energia solar</strong> serão selecionadas para implementar nosso sistema agora.
                              <br /><br />
                              <span className="text-primary-300 font-semibold text-base md:text-lg">Regra simples: quem implementar primeiro, vende primeiro.</span>
                              <br /><br />
                              <span className="text-text-primary">👉 Garanta sua vaga antes que outro ocupe o lugar.</span>
                </p>
                
                {/* Botão CTA na seção de urgência */}
                {showCTA && (
                  <Link
                    href="/strategy-call"
                    className="btn-minimal px-6 md:px-10 py-4 md:py-5 text-lg md:text-xl font-bold inline-block bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 transform hover:scale-105 transition-all duration-300 w-full md:w-auto"
                  >
                    QUERO IMPLEMENTAR NA MINHA EMPRESA
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.section>
  )
}
