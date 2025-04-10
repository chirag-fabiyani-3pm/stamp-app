import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"

export default function TermsPage() {
  return (
    <div className="container py-12">
      <Heading className="mb-4">Terms of Service</Heading>
      <Separator className="mb-8" />

      <div className="prose prose-stone dark:prose-invert max-w-3xl mx-auto">
        <p className="text-muted-foreground mb-6">Last updated: April 8, 2024</p>

        <h2>1. Introduction</h2>
        <p>
          Welcome to Stamps of Approval ("we," "our," or "us"). By accessing or using our website, mobile applications,
          or any other services we offer (collectively, the "Services"), you agree to be bound by these Terms of Service
          ("Terms"). Please read these Terms carefully before using our Services.
        </p>

        <h2>2. Acceptance of Terms</h2>
        <p>
          By registering for an account, accessing, or using our Services, you acknowledge that you have read,
          understood, and agree to be bound by these Terms. If you do not agree to these Terms, you may not access or
          use our Services.
        </p>

        <h2>3. Changes to Terms</h2>
        <p>
          We reserve the right to modify these Terms at any time. We will provide notice of any material changes by
          posting the updated Terms on our platform and updating the "Last updated" date. Your continued use of the
          Services after such modifications constitutes your acceptance of the revised Terms.
        </p>

        <h2>4. Account Registration</h2>
        <p>
          To access certain features of our Services, you must register for an account. You agree to provide accurate,
          current, and complete information during the registration process and to update such information to keep it
          accurate, current, and complete.
        </p>
        <p>
          You are responsible for safeguarding your password and for all activities that occur under your account. You
          agree to notify us immediately of any unauthorized use of your account.
        </p>

        <h2>5. Stamp Identification and Authentication</h2>
        <p>
          Our AI-powered stamp identification service provides estimates and suggestions based on our algorithms and
          database. While we strive for accuracy, we do not guarantee the accuracy of all identifications.
        </p>
        <p>
          The authentication services rely on user reviewers with varying levels of expertise. Authentication results
          are opinions based on digital images and information provided by users. We do not guarantee the authenticity
          of any stamp through our platform.
        </p>

        <h2>6. Marketplace and Trading</h2>
        <p>
          When listing stamps for sale or trade on our marketplace, you represent that you have the right to sell or
          trade such items and that all information provided is accurate and complete.
        </p>
        <p>
          We charge a 5% fee on completed sales, with a minimum fee of $0.50. There are no fees for listing items or for
          trades that don't involve monetary exchange.
        </p>
        <p>
          All transactions between users are agreements between those users only. While we provide the platform to
          facilitate such transactions, we are not a party to any transaction and are not responsible for resolving
          disputes between users, except as expressly provided in our Buyer and Seller Protection policies.
        </p>

        <h2>7. User Content</h2>
        <p>
          You retain ownership of any content you submit to our Services ("User Content"). By submitting User Content,
          you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish,
          translate, and distribute such content in connection with providing and promoting our Services.
        </p>
        <p>
          You are solely responsible for your User Content and the consequences of posting it. You represent and warrant
          that you have all necessary rights to post your User Content and that it does not violate these Terms or any
          applicable laws.
        </p>

        <h2>8. Prohibited Conduct</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use our Services for any illegal purpose</li>
          <li>Post fraudulent listings or engage in deceptive practices</li>
          <li>Harass, abuse, or harm other users</li>
          <li>Infringe the intellectual property rights of others</li>
          <li>Interfere with or disrupt our Services</li>
          <li>Attempt to gain unauthorized access to our systems</li>
          <li>Use automated methods to access or use our Services without our permission</li>
        </ul>

        <h2>9. Termination</h2>
        <p>
          We reserve the right to suspend or terminate your access to our Services at any time, without notice, for
          conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any
          other reason at our discretion.
        </p>

        <h2>10. Disclaimer of Warranties</h2>
        <p>
          OUR SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR
          IMPLIED. TO THE FULLEST EXTENT PERMISSIBLE UNDER APPLICABLE LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR
          IMPLIED, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
          NON-INFRINGEMENT.
        </p>

        <h2>11. Limitation of Liability</h2>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL WE BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
          CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR
          INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR ACCESS TO OR
          USE OF OR INABILITY TO ACCESS OR USE THE SERVICES.
        </p>

        <h2>12. Governing Law</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the laws of the State of New York, without
          regard to its conflict of law provisions.
        </p>

        <h2>13. Contact Us</h2>
        <p>If you have any questions about these Terms, please contact us at:</p>
        <p>
          Stamps of Approval
          <br />
          123 Philately Street, Suite 456
          <br />
          New York, NY 10001
          <br />
          legal@stampai.com
        </p>
      </div>
    </div>
  )
}
