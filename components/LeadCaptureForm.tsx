'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Calendar, Clock, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react'

// Schema de validação
const formSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  whatsapp: z.string().regex(/^\(\d{2}\) \d{5}-\d{4}$/, 'Formato: (11) 99999-9999'),
  email: z.string().email('Email inválido'),
  painPoint: z.string().min(10, 'Descreva sua dor em pelo menos 10 caracteres'),
  scheduledDate: z.string().min(1, 'Selecione uma data'),
  scheduledTime: z.string().min(1, 'Selecione um horário')
})

type FormData = z.infer<typeof formSchema>

// Próximas 7 datas disponíveis
const getAvailableDates = () => {
  const dates = []
  const today = new Date()
  
  for (let i = 1; i <= 14; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    
    // Excluir finais de semana
    if (date.getDay() !== 0 && date.getDay() !== 6) {
      dates.push({
        value: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('pt-BR', { 
          weekday: 'long', 
          day: '2-digit', 
          month: 'long' 
        })
      })
    }
  }
  
  return dates
}

export default function LeadCaptureForm() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [timeSlots, setTimeSlots] = useState<string[]>([])
  const [isFetchingSlots, setIsFetchingSlots] = useState(false)
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid }
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange'
  })

  const watchedValues = watch()
  const availableDates = getAvailableDates()
  const scheduledDate = watch('scheduledDate')

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (!scheduledDate) return

      console.log('Fetching slots for date:', scheduledDate);

      setIsFetchingSlots(true)
      setTimeSlots([])
      setValue('scheduledTime', '')

      try {
        const response = await fetch(`/api/test-instant-slots?date=${scheduledDate}`)
        const data = await response.json()

        if (data.success) {
          setTimeSlots(data.data.slots);
        } else {
          console.error('Failed to fetch slots:', data.message)
        }
      } catch (error) {
        console.error('Error fetching slots:', error)
      } finally {
        setIsFetchingSlots(false)
      }
    }

    fetchAvailableSlots()
  }, [scheduledDate, setValue])

  const steps = [
    { id: 'intro', title: 'Introdução' },
    { id: 'personal', title: 'Dados Pessoais' },
    { id: 'business', title: 'Desafios do Negócio' },
    { id: 'schedule', title: 'Agendamento' },
    { id: 'confirmation', title: 'Confirmação' }
  ]

  const progress = ((currentStep + 1) / steps.length) * 100

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    
    try {
      // Enviar dados para a API
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        setIsSuccess(true)
        setCurrentStep(4) // Ir para confirmação
      } else {
        throw new Error('Falha ao enviar dados')
      }
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao enviar dados. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0: // Introdução
        return (
          <motion.div
            key="intro"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="text-center"
          >
            <div className="w-20 h-20 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-10 h-10 text-primary-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Consultoria Estratégica Gratuita
            </h2>
            <p className="text-gray-300 mb-8 leading-relaxed">
              Descubra como empresas de energia solar estão multiplicando vendas usando IA, 
              automação e estratégias comprovadas. Agende sua sessão de 30 minutos e receba 
              um plano personalizado para seu negócio.
            </p>
            <div className="bg-white/5 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-primary-400 mb-2">O que você receberá:</h3>
              <ul className="text-gray-300 text-left space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  Análise personalizada do seu negócio
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  Estratégias de IA e automação
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  Plano de ação para multiplicar vendas
                </li>
              </ul>
            </div>
          </motion.div>
        )

      case 1: // Dados Pessoais
        return (
          <motion.div
            key="personal"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Dados Pessoais</h2>
              <p className="text-gray-300">Precisamos de algumas informações para personalizar sua consultoria</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nome Completo *
                </label>
                <input
                  {...register('name')}
                  type="text"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 transition-colors"
                  placeholder="Digite seu nome completo"
                />
                {errors.name && (
                  <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  WhatsApp *
                </label>
                <input
                  {...register('whatsapp')}
                  type="text"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 transition-colors"
                  placeholder="(11) 99999-9999"
                />
                {errors.whatsapp && (
                  <p className="text-red-400 text-sm mt-1">{errors.whatsapp.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email *
                </label>
                <input
                  {...register('email')}
                  type="email"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 transition-colors"
                  placeholder="seu@email.com"
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>
            </div>
          </motion.div>
        )

      case 2: // Desafios do Negócio
        return (
          <motion.div
            key="business"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Desafios do Negócio</h2>
              <p className="text-gray-300">Conte-nos sobre sua maior dificuldade para crescer</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Qual sua maior dor para crescer seu negócio de energia solar? *
              </label>
              <textarea
                {...register('painPoint')}
                rows={4}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 transition-colors resize-none"
                placeholder="Descreva seu principal desafio, problema ou objetivo de crescimento..."
              />
              {errors.painPoint && (
                <p className="text-red-400 text-sm mt-1">{errors.painPoint.message}</p>
              )}
            </div>

            <div className="bg-primary-500/10 border border-primary-500/20 rounded-lg p-4">
              <p className="text-primary-300 text-sm">
                💡 <strong>Dica:</strong> Seja específico sobre seus desafios. Isso nos ajudará a 
                preparar uma consultoria mais direcionada e valiosa para você.
              </p>
            </div>
          </motion.div>
        )

      case 3: // Agendamento
        return (
          <motion.div
            key="schedule"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Agendamento</h2>
              <p className="text-gray-300">Escolha a data e horário que melhor funcionam para você</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Data *
                </label>
                <select
                  {...register('scheduledDate')}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-primary-500 transition-colors"
                >
                  <option value="">Selecione uma data</option>
                  {availableDates.map((date) => (
                    <option key={date.value} value={date.value}>
                      {date.label}
                    </option>
                  ))}
                </select>
                {errors.scheduledDate && (
                  <p className="text-red-400 text-sm mt-1">{errors.scheduledDate.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Horário *
                </label>
                <select
                  {...register('scheduledTime')}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-primary-500 transition-colors"
                  disabled={isFetchingSlots || !scheduledDate}
                >
                  <option value="">Selecione um horário</option>
                  {isFetchingSlots && <option>Carregando...</option>}
                  {!isFetchingSlots && timeSlots.length > 0 && timeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time} (Horário de Brasília)
                    </option>
                  ))}
                  {!isFetchingSlots && timeSlots.length === 0 && scheduledDate && (
                    <option disabled>Nenhum horário disponível</option>
                  )}
                </select>
                {errors.scheduledTime && (
                  <p className="text-red-400 text-sm mt-1">{errors.scheduledTime.message}</p>
                )}
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-blue-300 text-sm font-medium mb-1">Informações da Consultoria:</p>
                  <ul className="text-blue-200 text-sm space-y-1">
                    <li>• Duração: 30 minutos</li>
                    <li>• Plataforma: Google Meet</li>
                    <li>• Lembretes automáticos: 24h, 2h e 15min antes</li>
                    <li>• Email de confirmação automático</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )

      case 4: // Confirmação
        return (
          <motion.div
            key="confirmation"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Consultoria Agendada com Sucesso!
            </h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Parabéns! Sua consultoria estratégica foi agendada. Você receberá um email de 
              confirmação com todos os detalhes e o link do Google Meet.
            </p>
            
            <div className="bg-white/5 rounded-lg p-6 mb-6 text-left">
              <h3 className="text-lg font-semibold text-primary-400 mb-4">Resumo do Agendamento:</h3>
              <div className="space-y-2 text-gray-300">
                <p><strong>Nome:</strong> {watchedValues.name}</p>
                <p><strong>Data:</strong> {watchedValues.scheduledDate && new Date(watchedValues.scheduledDate).toLocaleDateString('pt-BR')}</p>
                <p><strong>Horário:</strong> {watchedValues.scheduledTime}</p>
                <p><strong>Email:</strong> {watchedValues.email}</p>
              </div>
            </div>

            <div className="bg-primary-500/10 border border-primary-500/20 rounded-lg p-4">
              <p className="text-primary-300 text-sm">
                📧 <strong>Próximos passos:</strong> Verifique seu email para confirmar o agendamento. 
                Lembretes automáticos serão enviados 24h, 2h e 15min antes da consultoria.
              </p>
            </div>
          </motion.div>
        )

      default:
        return null
    }
  }

  if (isSuccess && currentStep === 4) {
    return (
      <div className="max-w-2xl mx-auto">
        {renderStep()}
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Barra de Progresso */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">
            Passo {currentStep + 1} de {steps.length}
          </span>
          <span className="text-sm text-primary-400 font-medium">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Conteúdo da Etapa */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>

        {/* Navegação */}
        {currentStep < 4 && (
          <div className="flex justify-between mt-8">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
                currentStep === 0
                  ? 'bg-gray-600/30 text-gray-400 cursor-not-allowed'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </button>

            {currentStep === 3 ? (
              <button
                onClick={handleSubmit(onSubmit)}
                disabled={!isValid || isSubmitting}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
                  !isValid || isSubmitting
                    ? 'bg-gray-600/30 text-gray-400 cursor-not-allowed'
                    : 'bg-primary-500 text-white hover:bg-primary-600'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Agendando...
                  </>
                ) : (
                  <>
                    Agendar Consultoria
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                Próximo
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
