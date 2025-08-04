"use client"

import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "How secure is my data?",
    answer:
      "We take data security seriously. All data is encrypted in transit and at rest using industry-standard AES-256 encryption. We're SOC 2 Type II compliant and follow GDPR guidelines.",
  },
  {
    question: "Which platforms are supported?",
    answer:
      "Currently, we support GitHub, Stack Overflow, and LinkedIn. We're actively working on adding support for GitLab, Bitbucket, and other professional platforms.",
  },
  {
    question: "How long does the verification process take?",
    answer:
      "The entire process typically takes 2-5 minutes. Once a candidate submits their profile URLs, our system automatically fetches and processes the data in real-time.",
  },
  {
    question: "Can I integrate Kredible with my existing ATS?",
    answer:
      "Yes! We offer integrations with popular ATS platforms like Greenhouse, Lever, BambooHR, and Workday. We also provide a REST API for custom integrations.",
  },
  {
    question: "What if a candidate doesn't respond?",
    answer:
      "Candidates receive an initial email with a secure link, followed by two gentle reminders over 7 days. You'll receive a notification if they don't respond.",
  },
]

export function FAQSection() {
  return (
    <section id="faq" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get answers to common questions about Kredible's candidate verification process
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white border border-gray-200 rounded-lg px-6"
              >
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="pb-6 text-gray-600 leading-relaxed">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Still have questions?</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline">Contact Support</Button>
              <Button className="bg-blue-600 hover:bg-blue-700">Schedule a Demo</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
