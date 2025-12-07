import { Metadata } from "next"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { HelpCircle, Phone, Mail } from "lucide-react"
import { StructuredData } from "@/components/StructuredData"
import { getFAQSchema } from "@/config/metadata"
import { siteConfig } from "@/config/site"
import type { Locale } from "@/config/i18n"

interface FAQPageProps {
  params: Promise<{ locale: Locale }>
}

// FAQ Data with translations
const faqsEn = [
  {
    category: "Purchasing",
    questions: [
      {
        question: "Can I buy a truck internationally?",
        answer: "Yes! We specialize in international sales and export to over 65 countries. We handle all export documentation, customs paperwork, and shipping logistics to make your purchase seamless.",
      },
      {
        question: "What payment methods do you accept?",
        answer: "We accept bank transfers (SWIFT/SEPA), letters of credit, and can arrange financing through our trusted partners. Payment terms can be discussed based on your location and purchase amount.",
      },
      {
        question: "Can I inspect the vehicle before purchasing?",
        answer: "Absolutely. We encourage in-person inspections at our facility, or we can arrange a third-party inspection service. We also provide comprehensive inspection reports with photos and detailed condition assessments for all vehicles.",
      },
      {
        question: "Do you offer warranties?",
        answer: "We offer limited warranties on certified pre-owned vehicles. Extended warranty options are also available through our partners. All vehicles come with detailed service history and inspection reports.",
      },
    ],
  },
  {
    category: "Financing & Trade-Ins",
    questions: [
      {
        question: "Do you offer financing options?",
        answer: "Yes, we work with trusted financial partners to arrange competitive financing solutions tailored to your business needs. Financing is available for qualified buyers in select markets. Contact us for details specific to your location.",
      },
      {
        question: "Do you accept trade-ins?",
        answer: "Yes, we accept trade-ins on commercial vehicles. Our team will evaluate your vehicle and provide a fair market offer that can be applied toward your purchase. Trade-in valuations are free and typically completed within 24-48 hours.",
      },
      {
        question: "What credit requirements are needed for financing?",
        answer: "Credit requirements vary by lender and location. Our financing partners work with businesses of all sizes and credit profiles. Contact our team to discuss your specific situation and explore available options.",
      },
    ],
  },
  {
    category: "Shipping & Export",
    questions: [
      {
        question: "How long does shipping take?",
        answer: "Shipping times vary by destination. European destinations typically take 1-3 weeks, Middle East and Africa 3-5 weeks, and other international destinations 4-8 weeks. We provide estimated delivery timelines for each shipment.",
      },
      {
        question: "Who handles customs clearance?",
        answer: "We handle all export documentation from our end. You'll be responsible for import customs clearance in your country, though we can recommend reliable customs brokers in most major markets who can assist you.",
      },
      {
        question: "What documentation do I receive?",
        answer: "You'll receive full export documentation including Bill of Lading, Commercial Invoice, Packing List, Certificate of Origin, and any other documents required for your destination country. All vehicles also come with service records and VIN reports.",
      },
      {
        question: "Are shipping costs included in the price?",
        answer: "Vehicle prices are FOB (Free On Board) from our location. Shipping costs are additional and vary based on destination and shipping method (container vs. RORO). We provide detailed shipping quotes before you commit to purchase.",
      },
    ],
  },
  {
    category: "Vehicle Condition & History",
    questions: [
      {
        question: "What is the difference between used and certified?",
        answer: "Used vehicles have been inspected and are sold as-is with full condition disclosure. Certified vehicles undergo our rigorous 150-point inspection, receive necessary reconditioning, and come with a limited warranty and extended return period.",
      },
      {
        question: "Can I get a vehicle history report?",
        answer: "Yes, all vehicles come with a complete service history and VIN report. This includes previous ownership, maintenance records, accident history (if any), and full technical specifications.",
      },
      {
        question: "What if the vehicle has undisclosed issues?",
        answer: "We stand behind our inspection process. If you discover undisclosed issues within the return period, we'll work with you to resolve them - either through repair, price adjustment, or full refund depending on the situation.",
      },
    ],
  },
  {
    category: "After-Sales Support",
    questions: [
      {
        question: "Do you provide after-sales support?",
        answer: "Yes, our relationship doesn't end at the sale. We provide ongoing support and can assist with maintenance recommendations, parts sourcing, and technical questions about your vehicle.",
      },
      {
        question: "Can you help source parts and maintenance?",
        answer: "While we don't sell parts directly, we maintain relationships with OEM and aftermarket suppliers and can provide recommendations for reliable parts sources in your region.",
      },
      {
        question: "What if I have issues after delivery?",
        answer: "Contact our support team immediately. We're here to help resolve any issues. Certified vehicles come with warranty coverage, and we maintain service partnerships in major markets worldwide.",
      },
    ],
  },
]

const faqsEl = [
  {
    category: "Αγορά",
    questions: [
      {
        question: "Μπορώ να αγοράσω φορτηγό διεθνώς;",
        answer: "Ναι! Ειδικευόμαστε σε διεθνείς πωλήσεις και εξαγωγές σε περισσότερες από 65 χώρες. Χειριζόμαστε όλα τα έγγραφα εξαγωγής, τελωνειακά έγγραφα και logistics αποστολής.",
      },
      {
        question: "Ποιες μεθόδους πληρωμής δέχεστε;",
        answer: "Δεχόμαστε τραπεζικά εμβάσματα (SWIFT/SEPA), πιστωτικές επιστολές και μπορούμε να κανονίσουμε χρηματοδότηση μέσω των συνεργατών μας.",
      },
      {
        question: "Μπορώ να επιθεωρήσω το όχημα πριν την αγορά;",
        answer: "Απολύτως. Ενθαρρύνουμε τις αυτοπρόσωπες επιθεωρήσεις στις εγκαταστάσεις μας, ή μπορούμε να κανονίσουμε υπηρεσία επιθεώρησης τρίτου.",
      },
      {
        question: "Προσφέρετε εγγυήσεις;",
        answer: "Προσφέρουμε περιορισμένες εγγυήσεις σε πιστοποιημένα μεταχειρισμένα οχήματα. Επιλογές εκτεταμένης εγγύησης είναι επίσης διαθέσιμες.",
      },
    ],
  },
  {
    category: "Χρηματοδότηση & Ανταλλαγές",
    questions: [
      {
        question: "Προσφέρετε επιλογές χρηματοδότησης;",
        answer: "Ναι, συνεργαζόμαστε με αξιόπιστους χρηματοοικονομικούς εταίρους για ανταγωνιστικές λύσεις χρηματοδότησης προσαρμοσμένες στις ανάγκες της επιχείρησής σας.",
      },
      {
        question: "Δέχεστε ανταλλαγές;",
        answer: "Ναι, δεχόμαστε ανταλλαγές σε εμπορικά οχήματα. Η ομάδα μας θα αξιολογήσει το όχημά σας και θα παρέχει δίκαιη προσφορά αγοράς.",
      },
      {
        question: "Ποιες πιστωτικές απαιτήσεις χρειάζονται για χρηματοδότηση;",
        answer: "Οι πιστωτικές απαιτήσεις διαφέρουν ανά δανειστή και τοποθεσία. Οι συνεργάτες χρηματοδότησής μας εργάζονται με επιχειρήσεις όλων των μεγεθών.",
      },
    ],
  },
  {
    category: "Αποστολή & Εξαγωγή",
    questions: [
      {
        question: "Πόσο διαρκεί η αποστολή;",
        answer: "Οι χρόνοι αποστολής διαφέρουν ανά προορισμό. Ευρωπαϊκοί προορισμοί συνήθως 1-3 εβδομάδες, Μέση Ανατολή και Αφρική 3-5 εβδομάδες.",
      },
      {
        question: "Ποιος χειρίζεται τον τελωνειακό εκκαθαρισμό;",
        answer: "Χειριζόμαστε όλα τα έγγραφα εξαγωγής από την πλευρά μας. Θα είστε υπεύθυνοι για τον τελωνειακό εκκαθαρισμό εισαγωγής στη χώρα σας.",
      },
      {
        question: "Ποια τεκμηρίωση λαμβάνω;",
        answer: "Θα λάβετε πλήρη τεκμηρίωση εξαγωγής συμπεριλαμβανομένου Bill of Lading, Εμπορικό Τιμολόγιο, Λίστα Συσκευασίας, Πιστοποιητικό Καταγωγής.",
      },
      {
        question: "Περιλαμβάνονται τα έξοδα αποστολής στην τιμή;",
        answer: "Οι τιμές οχημάτων είναι FOB (Free On Board) από την τοποθεσία μας. Τα έξοδα αποστολής είναι επιπλέον και διαφέρουν ανά προορισμό.",
      },
    ],
  },
  {
    category: "Κατάσταση & Ιστορικό Οχήματος",
    questions: [
      {
        question: "Ποια είναι η διαφορά μεταξύ μεταχειρισμένου και πιστοποιημένου;",
        answer: "Τα μεταχειρισμένα οχήματα έχουν επιθεωρηθεί και πωλούνται ως έχουν. Τα πιστοποιημένα οχήματα υποβάλλονται στην αυστηρή επιθεώρηση 150 σημείων.",
      },
      {
        question: "Μπορώ να λάβω αναφορά ιστορικού οχήματος;",
        answer: "Ναι, όλα τα οχήματα συνοδεύονται από πλήρες ιστορικό σέρβις και αναφορά VIN.",
      },
      {
        question: "Τι γίνεται αν το όχημα έχει μη δηλωμένα προβλήματα;",
        answer: "Στεκόμαστε πίσω από τη διαδικασία επιθεώρησής μας. Αν ανακαλύψετε μη δηλωμένα προβλήματα, θα εργαστούμε μαζί σας για επίλυση.",
      },
    ],
  },
  {
    category: "Υποστήριξη Μετά την Πώληση",
    questions: [
      {
        question: "Παρέχετε υποστήριξη μετά την πώληση;",
        answer: "Ναι, η σχέση μας δεν τελειώνει με την πώληση. Παρέχουμε συνεχή υποστήριξη για συστάσεις συντήρησης, εύρεση ανταλλακτικών και τεχνικές ερωτήσεις.",
      },
      {
        question: "Μπορείτε να βοηθήσετε με εύρεση ανταλλακτικών;",
        answer: "Αν και δεν πουλάμε ανταλλακτικά άμεσα, διατηρούμε σχέσεις με προμηθευτές OEM και aftermarket.",
      },
      {
        question: "Τι γίνεται αν έχω προβλήματα μετά την παράδοση;",
        answer: "Επικοινωνήστε αμέσως με την ομάδα υποστήριξής μας. Είμαστε εδώ για να βοηθήσουμε στην επίλυση τυχόν προβλημάτων.",
      },
    ],
  },
]

export async function generateMetadata({ params }: FAQPageProps): Promise<Metadata> {
  const { locale } = await params

  const title =
    locale === "el"
      ? "Συχνές Ερωτήσεις | Μεταχειρισμένα Φορτηγά & 4x4 Κύπρος"
      : "FAQ - Frequently Asked Questions | Used Trucks & 4x4 Cyprus"

  const description =
    locale === "el"
      ? "Βρείτε απαντήσεις σε συχνές ερωτήσεις για αγορά εμπορικών φορτηγών, χρηματοδότηση, αποστολή και εξαγωγή τεκμηρίωσης στην Κύπρο."
      : "Find answers to common questions about buying commercial trucks, 4x4 pickups, financing, shipping, and export documentation in Cyprus."

  return {
    title,
    description,
    keywords: [
      "FAQ trucks cyprus",
      "truck buying questions",
      "commercial vehicle financing",
      "truck shipping cyprus",
      "UK import questions",
      "συχνές ερωτήσεις φορτηγά",
      "ερωτήσεις αγοράς φορτηγών κύπρος",
    ],
    alternates: {
      canonical: `${siteConfig.url}/${locale}/faq`,
      languages: {
        en: `${siteConfig.url}/en/faq`,
        el: `${siteConfig.url}/el/faq`,
        "x-default": `${siteConfig.url}/en/faq`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/${locale}/faq`,
      type: "website",
      locale: locale === "el" ? "el_GR" : "en_US",
      siteName: siteConfig.name,
    },
  }
}

export default async function FAQPage({ params }: FAQPageProps) {
  const { locale } = await params
  const faqs = locale === "el" ? faqsEl : faqsEn

  // Flatten all questions for schema
  const allQuestions = faqs.flatMap((category) =>
    category.questions.map((q) => ({
      question: q.question,
      answer: q.answer,
    }))
  )

  const faqSchema = getFAQSchema(allQuestions)

  const heroTitle =
    locale === "el" ? "Συχνές Ερωτήσεις" : "Frequently Asked Questions"

  const heroSubtitle =
    locale === "el"
      ? "Βρείτε απαντήσεις σε συχνές ερωτήσεις για αγορά, χρηματοδότηση, αποστολή και τις υπηρεσίες μας."
      : "Find answers to common questions about purchasing, financing, shipping, and our services."

  const stillHaveQuestionsTitle =
    locale === "el" ? "Έχετε Ακόμα Ερωτήσεις;" : "Still Have Questions?"

  const stillHaveQuestionsText =
    locale === "el"
      ? "Η ομάδα μας είναι εδώ για να βοηθήσει. Επικοινωνήστε μαζί μας για εξατομικευμένη βοήθεια με την αγορά, χρηματοδότηση ή αποστολή φορτηγού."
      : "Our team is here to help. Contact us directly for personalized assistance with your truck purchase, financing, or shipping needs."

  return (
    <>
      <StructuredData data={[faqSchema]} />

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:32px_32px]" />
          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <HelpCircle className="h-16 w-16 mx-auto mb-6 text-brand-red" />
              <h1 className="text-4xl md:text-5xl font-bold mb-6">{heroTitle}</h1>
              <p className="text-xl text-slate-300">{heroSubtitle}</p>
            </div>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="py-16 bg-white">
          <div className="container max-w-4xl">
            <div className="space-y-12">
              {faqs.map((category) => (
                <div key={category.category}>
                  <h2 className="text-2xl font-bold mb-6 text-brand-ink border-l-4 border-brand-red pl-4">
                    {category.category}
                  </h2>
                  <Accordion type="single" collapsible className="space-y-4">
                    {category.questions.map((faq, index) => (
                      <AccordionItem
                        key={index}
                        value={`${category.category}-${index}`}
                        className="border rounded-lg px-6 bg-muted/30"
                      >
                        <AccordionTrigger className="text-left hover:no-underline">
                          <span className="font-semibold">{faq.question}</span>
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Still Have Questions */}
        <section className="py-16 bg-muted/40">
          <div className="container">
            <Card className="max-w-3xl mx-auto">
              <CardContent className="pt-6">
                <div className="text-center space-y-6">
                  <h2 className="text-3xl font-bold">{stillHaveQuestionsTitle}</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    {stillHaveQuestionsText}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Button asChild size="lg" className="bg-brand-red hover:bg-brand-red-dark">
                      <Link href={`/${locale}/contact`}>
                        <Mail className="mr-2 h-5 w-5" />
                        {locale === "el" ? "Επικοινωνία" : "Contact Us"}
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                      <Link href={`tel:${siteConfig.contact.phone}`}>
                        <Phone className="mr-2 h-5 w-5" />
                        {locale === "el" ? "Καλέστε μας" : "Call Us Now"}
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </>
  )
}
