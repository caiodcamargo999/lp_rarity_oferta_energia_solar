'use client'

import { motion } from 'framer-motion'

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

export default function SuccessCases() {
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
      </div>
    </motion.section>
  )
}
