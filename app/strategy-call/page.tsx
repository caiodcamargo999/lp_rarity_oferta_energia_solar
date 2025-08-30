'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, MessageCircle, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import LeadCaptureForm from '@/components/LeadCaptureForm'

export default function StrategyCallPage() {
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      id: 'intro',
      title: 'Introduction',
      description: 'Let\'s get to know your business',
      icon: MessageCircle
    },
    {
      id: 'details',
      title: 'Business Details',
      description: 'Tell us about your challenges',
      icon: CheckCircle
    },
    {
      id: 'schedule',
      title: 'Schedule Call',
      description: 'Pick your preferred time',
      icon: Calendar
    }
  ]

  return (
    <main className="min-h-screen w-full">
      {/* Header */}
      <motion.header 
        className="p-4 border-b border-white/10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link 
            href="/"
            className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
          <div className="text-center">
            <h1 className="text-xl font-semibold text-text-primary">Strategy Call</h1>
            <p className="text-sm text-text-secondary">Book your free consultation</p>
          </div>
          <div className="w-20"></div> {/* Spacer for centering */}
        </div>
      </motion.header>

      {/* Progress Steps */}
      <motion.section 
        className="py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-8 mb-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  index <= currentStep 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-white/10 text-text-secondary'
                }`}>
                  <step.icon className="w-5 h-5" />
                </div>
                <div className="hidden sm:block">
                  <h3 className="text-sm font-medium text-text-primary">{step.title}</h3>
                  <p className="text-xs text-text-secondary">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 ${
                    index < currentStep ? 'bg-primary-500' : 'bg-white/10'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Main Content */}
      <motion.section 
        className="flex-1 py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="max-w-2xl mx-auto">
          <LeadCaptureForm 
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            steps={steps}
          />
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="text-center py-8 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <p className="text-text-secondary text-sm">
            Questions? Contact us at{' '}
            <Link 
              href="https://www.instagram.com/rarity.brasil/" 
              className="text-primary-500 hover:text-primary-400 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              @rarity.brasil
            </Link>
          </p>
        </div>
      </footer>
    </main>
  )
}
