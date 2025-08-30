'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@chakra-ui/react'
import { ChevronLeft, ChevronRight, Send, CheckCircle } from 'lucide-react'

interface LeadCaptureFormProps {
  currentStep: number
  setCurrentStep: (step: number) => void
  steps: Array<{
    id: string
    title: string
    description: string
    icon: any
  }>
}

interface FormData {
  name: string
  whatsapp: string
  email: string
  instagram: string
  industry: string
  struggle: string
  budget: 'yes' | 'no'
  budgetAmount: string
  scheduledDateTime: string
}

export default function LeadCaptureForm({ currentStep, setCurrentStep, steps }: LeadCaptureFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    whatsapp: '',
    email: '',
    instagram: '',
    industry: '',
    struggle: '',
    budget: 'yes',
    budgetAmount: '',
    scheduledDateTime: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

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

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Handle budget logic
      if (formData.budget === 'no') {
        // Redirect to WhatsApp for non-budget users
        window.open(`https://wa.me/5511999999999?text=Olá! Gostaria de saber mais sobre os serviços da Rarity Agency Brasil.`, '_blank')
      }
      
      setIsSubmitted(true)
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Introduction
        return (
          <motion.div
            key="intro"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="text-center"
          >
            <h2 className="text-2xl font-bold text-text-primary mb-4">
              Welcome to Your Growth Journey
            </h2>
            <p className="text-text-secondary mb-6">
              We're excited to help you unlock your business potential. Let's start by understanding your current situation and goals.
            </p>
            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-text-primary mb-3">What You'll Get:</h3>
              <ul className="text-text-secondary space-y-2 text-left">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary-500" />
                  Personalized growth strategy
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary-500" />
                  AI & automation roadmap
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary-500" />
                  Implementation timeline
                </li>
              </ul>
            </div>
          </motion.div>
        )

      case 1: // Business Details
        return (
          <motion.div
            key="details"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-text-primary text-center mb-6">
              Tell Us About Your Business
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-text-primary text-sm font-medium mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-text-primary placeholder-text-secondary focus:border-primary-500 focus:outline-none transition-colors"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-text-primary text-sm font-medium mb-2">
                  WhatsApp Number *
                </label>
                <input
                  type="tel"
                  value={formData.whatsapp}
                  onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-text-primary placeholder-text-secondary focus:border-primary-500 focus:outline-none transition-colors"
                  placeholder="+55 (11) 99999-9999"
                  required
                />
              </div>

              <div>
                <label className="block text-text-primary text-sm font-medium mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-text-primary placeholder-text-secondary focus:border-primary-500 focus:outline-none transition-colors"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-text-primary text-sm font-medium mb-2">
                  Instagram Handle
                </label>
                <input
                  type="text"
                  value={formData.instagram}
                  onChange={(e) => handleInputChange('instagram', e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-text-primary placeholder-text-secondary focus:border-primary-500 focus:outline-none transition-colors"
                  placeholder="@yourusername"
                />
              </div>

              <div>
                <label className="block text-text-primary text-sm font-medium mb-2">
                  Industry/Sector *
                </label>
                <select
                  value={formData.industry}
                  onChange={(e) => handleInputChange('industry', e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-text-primary focus:border-primary-500 focus:outline-none transition-colors"
                  required
                >
                  <option value="">Select your industry</option>
                  <option value="saas">SaaS/Tech</option>
                  <option value="ecommerce">E-commerce</option>
                  <option value="b2b">B2B Services</option>
                  <option value="consulting">Consulting</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="education">Education</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-text-primary text-sm font-medium mb-2">
                  Main Business Challenge *
                </label>
                <textarea
                  value={formData.struggle}
                  onChange={(e) => handleInputChange('struggle', e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-text-primary placeholder-text-secondary focus:border-primary-500 focus:outline-none transition-colors"
                  placeholder="Describe your biggest business challenge..."
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-text-primary text-sm font-medium mb-2">
                  Do you have a budget for growth services? *
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="budget"
                      value="yes"
                      checked={formData.budget === 'yes'}
                      onChange={(e) => handleInputChange('budget', e.target.value)}
                      className="text-primary-500"
                    />
                    <span className="text-text-primary">Yes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="budget"
                      value="no"
                      checked={formData.budget === 'no'}
                      onChange={(e) => handleInputChange('budget', e.target.value)}
                      className="text-primary-500"
                    />
                    <span className="text-text-primary">No</span>
                  </label>
                </div>
              </div>

              {formData.budget === 'yes' && (
                <div>
                  <label className="block text-text-primary text-sm font-medium mb-2">
                    Budget Range (USD)
                  </label>
                  <select
                    value={formData.budgetAmount}
                    onChange={(e) => handleInputChange('budgetAmount', e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-text-primary focus:border-primary-500 focus:outline-none transition-colors"
                  >
                    <option value="">Select budget range</option>
                    <option value="1000-5000">$1,000 - $5,000</option>
                    <option value="5000-10000">$5,000 - $10,000</option>
                    <option value="10000-25000">$10,000 - $25,000</option>
                    <option value="25000-50000">$25,000 - $50,000</option>
                    <option value="50000+">$50,000+</option>
                  </select>
                </div>
              )}
            </div>
          </motion.div>
        )

      case 2: // Schedule Call
        return (
          <motion.div
            key="schedule"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="text-center"
          >
            <h2 className="text-2xl font-bold text-text-primary mb-4">
              Schedule Your Strategy Call
            </h2>
            <p className="text-text-secondary mb-6">
              Choose a time that works best for you. Our calls typically last 30-45 minutes.
            </p>
            
            <div className="bg-white/5 rounded-lg p-6 border border-white/10 mb-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Available Time Slots:</h3>
              <div className="grid grid-cols-2 gap-3">
                {['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM'].map((time) => (
                  <button
                    key={time}
                    onClick={() => handleInputChange('scheduledDateTime', time)}
                    className={`p-3 rounded-lg border transition-colors ${
                      formData.scheduledDateTime === time
                        ? 'border-primary-500 bg-primary-500/20 text-primary-500'
                        : 'border-white/10 hover:border-primary-500/50'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-left bg-white/5 rounded-lg p-4 border border-white/10">
              <h4 className="font-semibold text-text-primary mb-2">What to Expect:</h4>
              <ul className="text-text-secondary text-sm space-y-1">
                <li>• Deep dive into your business challenges</li>
                <li>• Custom growth strategy recommendations</li>
                <li>• Implementation roadmap and timeline</li>
                <li>• Q&A session</li>
              </ul>
            </div>
          </motion.div>
        )

      default:
        return null
    }
  }

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <CheckCircle className="w-20 h-20 text-primary-500 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Thank You!
        </h2>
        <p className="text-text-secondary mb-6">
          We've received your information and will be in touch soon to confirm your strategy call.
        </p>
        <p className="text-text-secondary text-sm">
          Check your email for confirmation details.
        </p>
      </motion.div>
    )
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
      <AnimatePresence mode="wait">
        {renderStepContent()}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/10">
        <Button
          onClick={handleBack}
          disabled={currentStep === 0}
          variant="ghost"
          colorScheme="whiteAlpha"
          leftIcon={<ChevronLeft className="w-4 h-4" />}
          className="text-text-secondary hover:text-text-primary disabled:opacity-50"
        >
          Back
        </Button>

        {currentStep === steps.length - 1 ? (
          <Button
            onClick={handleSubmit}
            isLoading={isSubmitting}
            loadingText="Submitting..."
            colorScheme="purple"
            rightIcon={<Send className="w-4 h-4" />}
            className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600"
          >
            Book Strategy Call
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            colorScheme="purple"
            rightIcon={<ChevronRight className="w-4 h-4" />}
            className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600"
          >
            Next
          </Button>
        )}
      </div>
    </div>
  )
}
