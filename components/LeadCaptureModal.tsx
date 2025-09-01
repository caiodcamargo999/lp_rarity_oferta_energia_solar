'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, Clock, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

interface FormData {
  name: string
  whatsapp: string
  email: string
  painPoint: string
}

interface TimeSlot {
  id: string
  time: string
  available: boolean
}

interface DaySlot {
  id: string
  date: Date
  dayName: string
  dayNumber: string
  month: string
  available: boolean
}

// Gerar próximos 7 dias úteis (excluindo domingos)
const generateAvailableDays = (): DaySlot[] => {
  const days: DaySlot[] = []
  const today = new Date()
  
  // Ajustar para horário de Brasília (UTC-3)
  const brasiliaOffset = -3
  const brasiliaTime = new Date(today.getTime() + (brasiliaOffset * 60 * 60 * 1000))
  
  let currentDate = new Date(brasiliaTime)
  let daysAdded = 0
  
  while (daysAdded < 7) {
    // Pular domingos (0 = domingo)
    if (currentDate.getDay() !== 0) {
      const dayName = currentDate.toLocaleDateString('pt-BR', { weekday: 'short' })
      const dayNumber = currentDate.getDate().toString().padStart(2, '0')
      const month = currentDate.toLocaleDateString('pt-BR', { month: 'short' })
      
      days.push({
        id: currentDate.toISOString().split('T')[0],
        date: new Date(currentDate),
        dayName,
        dayNumber,
        month,
        available: true
      })
      daysAdded++
    }
    
    // Avançar para o próximo dia
    currentDate.setDate(currentDate.getDate() + 1)
  }
  
  return days
}

interface LeadCaptureModalProps {
  isOpen: boolean
  onClose: () => void
}

const timeSlots: TimeSlot[] = [
  { id: '08:00', time: '08:00', available: true },
  { id: '09:00', time: '09:00', available: true },
  { id: '10:00', time: '10:00', available: true },
  { id: '11:00', time: '11:00', available: true },
  { id: '12:00', time: '12:00', available: true },
  { id: '13:00', time: '13:00', available: true },
  { id: '14:00', time: '14:00', available: true },
  { id: '15:00', time: '15:00', available: true },
  { id: '16:00', time: '16:00', available: true },
  { id: '17:00', time: '17:00', available: true },
]

const steps = [
  { id: 'name', title: 'Qual é o seu nome?', field: 'name' as keyof FormData },
  { id: 'whatsapp', title: 'Qual é o seu WhatsApp?', field: 'whatsapp' as keyof FormData },
  { id: 'email', title: 'Qual é o seu e-mail?', field: 'email' as keyof FormData },
  { id: 'pain', title: 'Qual sua maior dor para crescer seu negócio de energia solar?', field: 'painPoint' as keyof FormData },
  { id: 'schedule', title: 'Escolha um horário para sua sessão estratégica' },
]

export default function LeadCaptureModal({ isOpen, onClose }: LeadCaptureModalProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    whatsapp: '',
    email: '',
    painPoint: ''
  })
  const [selectedDay, setSelectedDay] = useState<string>('')
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errors, setErrors] = useState<Partial<FormData>>({})

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const validateField = (field: keyof FormData, value: string): string => {
    switch (field) {
      case 'name':
        return value.trim().length < 2 ? 'Nome deve ter pelo menos 2 caracteres' : ''
      case 'whatsapp':
        // Validação mais flexível para WhatsApp
        const clean = value.replace(/\D/g, '')
        return clean.length < 10 ? 'WhatsApp deve ter pelo menos 10 dígitos' : ''
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return !emailRegex.test(value) ? 'E-mail deve ter um formato válido' : ''
      case 'painPoint':
        return value.trim().length < 10 ? 'Descreva melhor sua dor (mínimo 10 caracteres)' : ''
      default:
        return ''
    }
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    const error = validateField(field, value)
    if (error) {
      setErrors(prev => ({ ...prev, [field]: error }))
    } else {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleNext = () => {
    const currentField = steps[currentStep].field
    if (currentField && currentField !== 'schedule' as any) {
      const error = validateField(currentField, formData[currentField])
      if (error) {
        setErrors(prev => ({ ...prev, [currentField]: error }))
        return
      }
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    if (!selectedTimeSlot) {
      return
    }

    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
                 body: JSON.stringify({
           ...formData,
           scheduledDate: selectedDay,
           scheduledTime: selectedTimeSlot,
         }),
      })

      if (response.ok) {
        setIsSuccess(true)
        // Reset form after 3 seconds
        setTimeout(() => {
          onClose()
          setCurrentStep(0)
          setFormData({ name: '', whatsapp: '', email: '', painPoint: '' })
                     setSelectedDay('')
           setSelectedTimeSlot('')
          setIsSuccess(false)
        }, 3000)
      } else {
        throw new Error('Falha ao enviar formulário')
      }
    } catch (error) {
      console.error('Erro ao enviar formulário:', error)
      alert('Erro ao enviar formulário. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Formatação do WhatsApp mais flexível
  const formatWhatsApp = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '')
    
    // Se não tem números, retorna vazio
    if (numbers.length === 0) return ''
    
    // Se começa com 55, remove para permitir edição
    let formatted = numbers
    if (numbers.startsWith('55') && numbers.length > 2) {
      formatted = numbers.substring(2)
    }
    
    // Aplica formatação brasileira
    if (formatted.length <= 2) {
      return `(${formatted}`
    } else if (formatted.length <= 7) {
      return `(${formatted.substring(0, 2)}) ${formatted.substring(2)}`
    } else if (formatted.length <= 11) {
      return `(${formatted.substring(0, 2)}) ${formatted.substring(2, 7)}-${formatted.substring(7)}`
    } else {
      return `(${formatted.substring(0, 2)}) ${formatted.substring(2, 7)}-${formatted.substring(7, 11)}`
    }
  }

  // Função para limpar formatação e obter apenas números
  const cleanWhatsApp = (value: string) => {
    return value.replace(/\D/g, '')
  }

  // Validação do WhatsApp
  const validateWhatsApp = (value: string) => {
    const clean = cleanWhatsApp(value)
    // Deve ter pelo menos 10 dígitos (mais flexível)
    return clean.length >= 10
  }

  // Handler para mudança no WhatsApp
  const handleWhatsAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const formatted = formatWhatsApp(value)
    setFormData(prev => ({ ...prev, whatsapp: formatted }))
    
         // Validação em tempo real
     if (formatted.length > 0) {
       const isValid = validateWhatsApp(formatted)
       setErrors(prev => ({ ...prev, whatsapp: isValid ? '' : 'WhatsApp deve ter pelo menos 10 dígitos' }))
     } else {
       setErrors(prev => ({ ...prev, whatsapp: '' }))
     }
  }

  // Handler para tecla Enter
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (currentStep < steps.length - 1) {
        handleNext()
      }
    }
  }

  const progress = ((currentStep + 1) / steps.length) * 100

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg max-h-[85vh] bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-xl rounded-3xl border border-gray-700/50 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative p-6 border-b border-gray-700/30">
                         <button
               onClick={onClose}
               className="absolute top-6 right-4 p-2 text-gray-400 hover:text-white transition-all duration-200 hover:bg-gray-800/50 rounded-full"
             >
               <X size={16} />
             </button>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-800/50 rounded-full h-1.5 mb-4">
              <motion.div
                className="bg-gradient-to-r from-primary-500 to-secondary-500 h-1.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            
            <div className="text-center">
              <h2 className="text-xl font-semibold text-white mb-1">
                Sessão Estratégica Gratuita
              </h2>
              <p className="text-gray-400 text-xs font-normal">
                Passo {currentStep + 1} de {steps.length}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 min-h-[350px] flex flex-col overflow-y-auto max-h-[60vh]">
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center py-12"
              >
                                 <div className="w-12 h-12 bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
                   <CheckCircle className="w-6 h-6 text-gray-300" />
                 </div>
                 <h3 className="text-lg font-light text-white mb-3">
                   Agendamento Confirmado
                 </h3>
                 <p className="text-gray-400 text-sm mb-4 max-w-md font-light">
                   Sua sessão estratégica foi agendada com sucesso. Você receberá um e-mail de confirmação com o link do Google Meet.
                 </p>
                 <div className="text-xs text-gray-500 font-light">
                   <p>{new Date(selectedDay).toLocaleDateString('pt-BR', { 
                     weekday: 'long', 
                     year: 'numeric', 
                     month: 'long', 
                     day: 'numeric' 
                   })}</p>
                   <p>{selectedTimeSlot} (Brasília)</p>
                   <p>Check-in: 15 minutos antes</p>
                 </div>
              </motion.div>
            ) : (
              <>
                {/* Step Title - Apenas a pergunta atual */}
                <motion.div
                  key={`step-title-${currentStep}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="text-center mb-6"
                >
                  <h3 className="text-lg font-medium text-white mb-3">
                    {steps[currentStep].title}
                  </h3>
                </motion.div>

                {/* Step Content - Apenas o conteúdo do passo atual */}
                <motion.div
                  key={`step-content-${currentStep}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1"
                >
                  {currentStep === 0 && (
                    <div className="space-y-3">
                                             <Input
                         type="text"
                         value={formData.name}
                         onChange={(e) => handleInputChange('name', e.target.value)}
                         onKeyPress={handleKeyPress}
                         placeholder="Digite seu nome completo"
                         className="w-full h-11 text-base bg-gray-800/50 border-gray-600/50 text-white placeholder-gray-400/20 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 rounded-xl transition-all"
                       />
                                             {errors.name && (
                         <p className="text-red-300/60 text-xs opacity-70">{errors.name}</p>
                       )}
                    </div>
                  )}

                  {currentStep === 1 && (
                    <div className="space-y-3">
                                             <Input
                         type="tel"
                         value={formData.whatsapp}
                         onChange={handleWhatsAppChange}
                         onKeyPress={handleKeyPress}
                         placeholder="(XX) XXXXX-XXXX"
                         className="w-full h-11 text-base bg-gray-800/50 border-gray-600/50 text-white placeholder-gray-400/20 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 rounded-xl transition-all"
                       />
                                             {errors.whatsapp && (
                         <p className="text-red-300/60 text-xs opacity-70">{errors.whatsapp}</p>
                       )}
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-3">
                                             <Input
                         type="email"
                         value={formData.email}
                         onChange={(e) => handleInputChange('email', e.target.value)}
                         onKeyPress={handleKeyPress}
                         placeholder="seu@email.com"
                         className="w-full h-11 text-base bg-gray-800/50 border-gray-600/50 text-white placeholder-gray-400/20 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 rounded-xl transition-all"
                       />
                                             {errors.email && (
                         <p className="text-red-300/60 text-xs opacity-70">{errors.email}</p>
                       )}
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-3">
                                             <textarea
                         value={formData.painPoint}
                         onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('painPoint', e.target.value)}
                         onKeyPress={handleKeyPress}
                         placeholder="Descreva sua maior dificuldade para crescer no mercado de energia solar..."
                         rows={3}
                         className="w-full text-base bg-gray-800/50 border-gray-600/50 text-white placeholder-gray-400/20 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 rounded-xl transition-all resize-none px-4 py-3 border rounded-xl"
                       />
                                             {errors.painPoint && (
                         <p className="text-red-300/60 text-xs opacity-70">{errors.painPoint}</p>
                       )}
                    </div>
                  )}

                  {currentStep === 4 && (
                    <div className="space-y-6">
                      {/* Seleção de Dia */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-gray-300 text-center mb-4">
                          Escolha o dia para sua sessão
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {generateAvailableDays().map((day) => (
                            <button
                              key={day.id}
                              onClick={() => setSelectedDay(day.id)}
                              className={`p-4 rounded-xl border transition-all text-center ${
                                selectedDay === day.id
                                  ? 'border-primary-500 bg-primary-500/20 text-white shadow-lg'
                                  : 'border-gray-600/50 bg-gray-800/30 text-gray-300 hover:border-primary-500/50 hover:bg-primary-500/10 hover:shadow-md'
                              }`}
                            >
                              <div className="space-y-1">
                                <div className="text-xs text-gray-400 uppercase tracking-wide">
                                  {day.dayName}
                                </div>
                                <div className="text-lg font-bold">
                                  {day.dayNumber}
                                </div>
                                <div className="text-xs text-gray-400">
                                  {day.month}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Seleção de Horário */}
                      {selectedDay && (
                        <div className="space-y-3">
                          <h4 className="text-sm font-medium text-gray-300 text-center mb-4">
                            Escolha o horário para sua sessão
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {timeSlots.map((slot) => (
                              <button
                                key={slot.id}
                                onClick={() => setSelectedTimeSlot(slot.time)}
                                disabled={!slot.available}
                                className={`p-3 rounded-xl border transition-all ${
                                  selectedTimeSlot === slot.time
                                    ? 'border-primary-500 bg-primary-500/20 text-white shadow-lg'
                                    : slot.available
                                    ? 'border-gray-600/50 bg-gray-800/30 text-gray-300 hover:border-primary-500/50 hover:bg-primary-500/10 hover:shadow-md'
                                    : 'border-gray-700/50 bg-gray-900/50 text-gray-600 cursor-not-allowed'
                                }`}
                              >
                                <div className="flex items-center justify-center space-x-2">
                                  <Clock size={14} />
                                  <span className="text-sm font-medium">{slot.time}</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      
                    </div>
                  )}
                </motion.div>

                {/* Navigation */}
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-700/30">
                  <Button
                    onClick={handleBack}
                    disabled={currentStep === 0}
                    variant="ghost"
                    className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all ${
                      currentStep === 0
                        ? 'text-gray-600 cursor-not-allowed'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                    }`}
                  >
                    <ArrowLeft size={16} />
                    <span>Voltar</span>
                  </Button>

                  {currentStep < steps.length - 1 ? (
                    <Button
                      onClick={handleNext}
                      disabled={!formData[steps[currentStep].field as keyof FormData]?.trim()}
                      className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                    >
                      <span>Próximo</span>
                      <ArrowRight size={16} />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                                             disabled={!selectedDay || !selectedTimeSlot || isSubmitting}
                      className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                    >
                                             {isSubmitting ? (
                         <>
                           <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                           <span>Agendando...</span>
                         </>
                       ) : (
                         <>
                           <Calendar size={16} />
                           <span>Sessão Estratégica</span>
                         </>
                       )}
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
