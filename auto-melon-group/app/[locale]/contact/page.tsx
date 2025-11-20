"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { siteConfig } from "@/config/site"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import type { Locale } from "@/types/i18n"
import { useState, Suspense, use } from "react"
import { useSearchParams } from "next/navigation"
import { Phone, Mail, MessageCircle } from "lucide-react"

function ContactForm({
  dict,
  locale
}: {
  dict: Awaited<ReturnType<typeof getDictionary>>
  locale: Locale
}) {
  const searchParams = useSearchParams()
  const vehicleId = searchParams.get('vehicle')

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: vehicleId ? `${dict.contact.sendMessage.interestedInVehicle} ${vehicleId}` : '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit inquiry')
      }

      setSubmitted(true)
      setFormData({ name: '', email: '', phone: '', message: '' })
    } catch (error) {
      console.error('Form submission error:', error)
      alert('Failed to submit inquiry. Please try again or contact us directly.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>      <div className="container py-8 max-w-4xl mx-auto flex-1">
        <h1 className="text-4xl font-bold tracking-tight mb-2">{dict.contact.title}</h1>
      <p className="text-muted-foreground mb-8">{dict.contact.subtitle}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Phone */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center">
                <Phone className="h-6 w-6 text-brand-red" />
              </div>
              <h3 className="font-semibold">{dict.contact.phone}</h3>
              <a
                href={`tel:${siteConfig.contact.phone}`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {siteConfig.contact.phone}
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Email */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center">
                <Mail className="h-6 w-6 text-brand-red" />
              </div>
              <h3 className="font-semibold">{dict.contact.email}</h3>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {siteConfig.contact.email}
              </a>
            </div>
          </CardContent>
        </Card>

        {/* WhatsApp */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold">{dict.contact.whatsapp}</h3>
              <a
                href={siteConfig.links.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {dict.contact.chatWithUs}
              </a>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{dict.contact.sendMessage.title}</CardTitle>
          <CardDescription>{dict.contact.sendMessage.description}</CardDescription>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <div className="text-center py-8">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">{dict.contact.sendMessage.successTitle}</h3>
              <p className="text-muted-foreground mb-4">{dict.contact.sendMessage.successMessage}</p>
              <Button onClick={() => setSubmitted(false)} variant="outline">
                {dict.contact.sendMessage.sendAnother}
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{dict.contact.sendMessage.name} *</Label>
                <Input
                  id="name"
                  placeholder={dict.contact.sendMessage.namePlaceholder}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{dict.contact.sendMessage.email} *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={dict.contact.sendMessage.emailPlaceholder}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">{dict.contact.sendMessage.phone} *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder={dict.contact.sendMessage.phonePlaceholder}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">{dict.contact.sendMessage.message} *</Label>
                <textarea
                  id="message"
                  placeholder={dict.contact.sendMessage.messagePlaceholder}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={5}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-red"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-brand-red hover:bg-brand-red-dark text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? dict.contact.sendMessage.sending : dict.contact.sendMessage.submit}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
      </div>
      <LocalizedFooter locale={locale} dict={dict} />
    </>
  )
}

function getLocaleFromDict(dict: any): Locale {
  // Infer locale from dictionary content
  return dict.nav.home === 'Home' ? 'en' : 'el'
}

export default function ContactPage({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = use(params)
  const dictPromise = getDictionary(locale)
  const dict = use(dictPromise)

  return (
    <>
      <Suspense
        fallback={
          <div className="container py-8 max-w-4xl mx-auto flex-1">
            <h1 className="text-4xl font-bold tracking-tight mb-2">Loading...</h1>
          </div>
        }
      >
        <ContactForm dict={dict} locale={locale} />
      </Suspense>
    </>
  )
}
