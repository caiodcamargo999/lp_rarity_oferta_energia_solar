'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import LeadCaptureModal from './LeadCaptureModal'

interface SuccessCasesProps {
  version?: "1" | "2" | "4"
  showUrgency?: boolean
  showCTA?: boolean
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

export default function SuccessCases({ version = "1", showUrgency = false, showCTA = false }: SuccessCasesProps) {
  const [localShowUrgency, setLocalShowUrgency] = useState(false)
  const [localShowCTA, setLocalShowCTA] = useState(false)
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false)

  useEffect(() => {
    if (version === "1") {
      // Versão 1: mostrar tudo desde o começo
      setLocalShowUrgency(true)
      setLocalShowCTA(true)
    } else if (version === "2" || version === "4") {
      // Versão 2 e 4: usar estados do VideoSection
      setLocalShowUrgency(showUrgency)
      setLocalShowCTA(showCTA)
    }
  }, [version, showUrgency, showCTA])

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 2, ease: "easeOut" }}
      className="py-16 px-4" /* Ajustado espaçamento para ficar igual ao deploy */
    >
      <div className="max-w-6xl mx-auto">
        {/* Título da Seção */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-4xl md:text-5xl font-bold text-center mb-16" /* Ajustado espaçamento */
        >
          <span className="gradient-text">Resultados Comprovados</span>
        </motion.h2>
        
        {/* Cards de Resultados */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"> {/* Ajustado espaçamento */}
          {successData.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.2, duration: 0.8 }}
              whileHover={{ y: -5 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 hover:border-primary-500/30 transition-all duration-300" /* Ajustado padding */
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-500 mb-4">{item.metric}</div> {/* Ajustado espaçamento */}
                <h3 className="text-lg font-semibold text-white mb-3">{item.title}</h3> {/* Ajustado espaçamento */}
                <p className="text-sm text-gray-300">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Seção de Urgência - Layout Original */}
        {localShowUrgency && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="bg-gradient-to-r from-primary-500/20 to-secondary-500/20 border border-primary-500/30 rounded-2xl p-8"
          >
            <div className="text-center">
              {/* Ícone e Título */}
              <div className="flex items-center justify-center mb-6">
                <div className="w-12 h-12 bg-primary-500/20 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <svg className="w-6 h-6 text-primary-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-primary-400 leading-none flex items-center transform translate-y-0.5">
                  ATENÇÃO: ÚLTIMA CHANCE ESTE MÊS
                </h3>
              </div>
              
              {/* Texto de Urgência */}
              <p className="text-lg text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
                <strong className="text-primary-400">Somente 3 empresas de energia solar</strong> serão selecionadas para implementar nosso sistema agora.
                <br /><br />
                <span className="text-primary-300 font-semibold">Regra simples: quem implementar primeiro, vende primeiro.</span>
                <br /><br />
                <span className="text-white">Garanta sua vaga antes que outro ocupe o lugar.</span>
              </p>
              
              {/* Botão CTA */}
              {localShowCTA && (
                <button
                  onClick={() => setIsLeadModalOpen(true)}
                  className="btn-minimal px-8 py-4 text-lg font-bold bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 transform hover:scale-105 transition-all duration-300"
                >
                  QUERO IMPLEMENTAR NA MINHA EMPRESA
                </button>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Modal de Captação de Leads */}
      <LeadCaptureModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
      />
    </motion.section>
  )
}
