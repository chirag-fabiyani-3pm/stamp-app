import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FAQPage() {
  const faqs = [
    {
      question: "What is Stamps of Approval?",
      answer:
        "Stamps of Approval is an AI-powered platform for stamp collectors to catalog, identify, and trade stamps worldwide. Our platform combines advanced image recognition technology with a comprehensive database of global stamps to help collectors identify, catalog, and value their collections.",
    },
    {
      question: "How accurate is the AI stamp identification?",
      answer:
        "Our AI identification technology has an accuracy rate of over 95% for common stamps and approximately 85-90% for rare or unusual issues. The system is constantly learning and improving through user feedback and additional training data.",
    },
    {
      question: "Is creating an account free?",
      answer:
        "Yes, creating a basic account on Stamps of Approval is completely free. This allows you to catalog your collection, use basic identification features, and participate in the community forums. Premium features, such as advanced analytics and unlimited AI identifications, are available through our subscription plans.",
    },
    {
      question: "How does the authentication process work?",
      answer:
        "Our authentication process involves multiple expert reviewers examining digital images of your stamps, comparing them against our reference database, and evaluating key characteristics like paper, perforations, color, and printing method. Authentication requests are reviewed by multiple experts, with master authenticators having the final approval.",
    },
    {
      question: "Can I sell stamps on the marketplace?",
      answer:
        "Yes, registered users can list stamps for sale on our marketplace. You can create listings with detailed descriptions, multiple images, and set either fixed prices or allow bidding. We recommend getting valuable stamps authenticated before listing to increase buyer confidence.",
    },
    {
      question: "How are trades and sales protected?",
      answer:
        "We protect both buyers and sellers through our escrow system. When a purchase is made, the funds are held in escrow until the buyer confirms receipt and satisfaction with the item. For trades, both parties must confirm receipt before the transaction is completed.",
    },
    {
      question: "What fees are associated with selling on the marketplace?",
      answer:
        "There is a 5% fee on completed sales, with a minimum fee of $0.50. This fee helps us maintain the marketplace infrastructure and provide buyer/seller protection. There are no fees for listing items or for trades that don't involve monetary exchange.",
    },
    {
      question: "How can I become an authenticator?",
      answer:
        "To become an authenticator, you must first establish yourself as an active and knowledgeable member of our community. After that, you can apply for the Apprentice Authenticator program. This involves demonstrating your expertise through tests and supervised authentications. As you gain experience and prove your reliability, you can progress to Certified and Master levels.",
    },
    {
      question: "Can I export my collection data?",
      answer:
        "Yes, you can export your collection data in several formats, including CSV, PDF, and our specialized format that maintains all collection metadata. This allows you to keep backups of your collection or use the data in other applications.",
    },
    {
      question: "What should I do if I find inappropriate content in the community forums?",
      answer:
        "If you encounter inappropriate content in our forums or marketplace, please use the 'Report' button available on all posts and listings. Our moderation team reviews all reports promptly and takes appropriate action according to our community guidelines.",
    },
  ]

  return (
    <div className="container py-12">
      <Heading className="mb-4">Frequently Asked Questions</Heading>
      <Separator className="mb-8" />

      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left font-medium">{faq.question}</AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground">{faq.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 p-6 rounded-lg border text-center">
          <h3 className="text-lg font-medium mb-2">Still have questions?</h3>
          <p className="text-muted-foreground mb-4">
            If you couldn't find the answer to your question, please contact our support team.
          </p>
          <a href="/contact" className="text-primary font-medium hover:underline">
            Contact Support →
          </a>
        </div>
      </div>
    </div>
  )
}
