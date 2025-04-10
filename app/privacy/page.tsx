import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"

export default function PrivacyPolicyPage() {
  return (
    <div className="container py-12">
      <Heading className="mb-4">Privacy Policy</Heading>
      <Separator className="mb-8" />

      <div className="prose prose-stone dark:prose-invert max-w-3xl mx-auto">
        <p className="text-muted-foreground mb-6">Last updated: April 8, 2024</p>

        <h2>1. Introduction</h2>
        <p>
          Welcome to Stamps of Approval's Privacy Policy. This Privacy Policy describes how we collect, use, and
          disclose your personal information when you use our services, website, and mobile application (collectively,
          the "Services").
        </p>

        <h2>2. Information We Collect</h2>

        <h3>2.1 Information You Provide to Us</h3>
        <p>We collect information you provide directly to us, including:</p>
        <ul>
          <li>
            Account information: When you register, we collect your name, email address, password, and optional profile
            information.
          </li>
          <li>
            Collection data: Information about your stamp collection, including images, descriptions, and other
            metadata.
          </li>
          <li>
            Marketplace information: When you list items for sale or purchase items, we collect transaction details,
            shipping information, and payment information.
          </li>
          <li>Communications: When you contact us or participate in surveys, promotions, or community forums.</li>
        </ul>

        <h3>2.2 Information We Collect Automatically</h3>
        <p>When you use our Services, we automatically collect certain information, including:</p>
        <ul>
          <li>
            Usage information: How you use our Services, including pages visited, features used, and actions taken.
          </li>
          <li>
            Device information: Information about your device, including IP address, browser type, operating system, and
            device identifiers.
          </li>
          <li>Location information: General location information derived from your IP address.</li>
          <li>
            Cookies and similar technologies: We use cookies and similar technologies to collect information about your
            browsing behavior and preferences.
          </li>
        </ul>

        <h2>3. How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Provide, maintain, and improve our Services</li>
          <li>Process transactions and send related information</li>
          <li>Send you technical notices, updates, security alerts, and support messages</li>
          <li>Respond to your comments, questions, and customer service requests</li>
          <li>Develop new products and services</li>
          <li>Monitor and analyze trends, usage, and activities in connection with our Services</li>
          <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
          <li>Personalize your experience and deliver content relevant to your interests</li>
        </ul>

        <h2>4. How We Share Your Information</h2>
        <p>We may share your information in the following circumstances:</p>

        <h3>4.1 With Other Users</h3>
        <p>
          Certain information, such as your username, profile picture, and content you post publicly, is visible to
          other users. If you engage in a transaction with another user, we will share information necessary to
          facilitate the transaction.
        </p>

        <h3>4.2 With Service Providers</h3>
        <p>
          We share information with third-party vendors, consultants, and other service providers who perform services
          on our behalf.
        </p>

        <h3>4.3 For Legal Reasons</h3>
        <p>
          We may share information if we believe disclosure is necessary to comply with applicable laws, regulations,
          legal processes, or governmental requests.
        </p>

        <h3>4.4 Business Transfers</h3>
        <p>
          We may share information in connection with a merger, sale of company assets, financing, or acquisition of all
          or a portion of our business to another company.
        </p>

        <h2>5. Your Choices</h2>

        <h3>5.1 Account Information</h3>
        <p>
          You can update your account information through your account settings. You may also request deletion of your
          account by contacting us.
        </p>

        <h3>5.2 Cookies</h3>
        <p>
          Most web browsers are set to accept cookies by default. You can usually adjust your browser settings to remove
          or reject cookies. Please note that removing or rejecting cookies could affect the availability and
          functionality of our Services.
        </p>

        <h3>5.3 Promotional Communications</h3>
        <p>
          You can opt out of receiving promotional emails from us by following the instructions in those emails. If you
          opt out, we may still send you non-promotional emails, such as those about your account or our ongoing
          business relations.
        </p>

        <h2>6. Data Retention</h2>
        <p>
          We retain personal information we collect from you for as long as necessary to fulfill the purposes for which
          we collected it, including for the purposes of satisfying any legal, accounting, or reporting requirements, or
          to resolve disputes.
        </p>

        <h2>7. Data Security</h2>
        <p>
          We take reasonable measures to help protect information about you from loss, theft, misuse, unauthorized
          access, disclosure, alteration, and destruction. However, no internet or electronic communications service is
          ever completely secure.
        </p>

        <h2>8. Children's Privacy</h2>
        <p>
          Our Services are not directed to children under 13, and we do not knowingly collect personal information from
          children under 13. If we learn we have collected personal information from a child under 13, we will delete
          that information.
        </p>

        <h2>9. International Data Transfers</h2>
        <p>
          We are based in the United States and the information we collect is governed by U.S. law. If you are accessing
          our Services from outside the United States, please be aware that information collected through our Services
          may be transferred to, processed, and stored in the United States and other countries, where the data
          protection laws may differ from those of your country.
        </p>

        <h2>10. Changes to this Privacy Policy</h2>
        <p>
          We may change this Privacy Policy from time to time. If we make changes, we will notify you by revising the
          date at the top of the policy and, in some cases, we may provide you with additional notice. We encourage you
          to review the Privacy Policy whenever you access our Services.
        </p>

        <h2>11. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us at:</p>
        <p>
          Stamps of Approval
          <br />
          123 Philately Street, Suite 456
          <br />
          New York, NY 10001
          <br />
          privacy@stampai.com
        </p>
      </div>
    </div>
  )
}
