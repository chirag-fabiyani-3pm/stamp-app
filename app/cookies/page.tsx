import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"

export default function CookiePolicyPage() {
  return (
    <div className="container py-12">
      <Heading className="mb-4">Cookie Policy</Heading>
      <Separator className="mb-8" />

      <div className="prose prose-stone dark:prose-invert max-w-3xl mx-auto">
        <p className="text-muted-foreground mb-6">Last updated: April 8, 2024</p>

        <h2>1. Introduction</h2>
        <p>
          This Cookie Policy explains how Stamps of Approval ("we", "us", or "our") uses cookies and similar
          technologies to recognize you when you visit our website and use our services. It explains what these
          technologies are and why we use them, as well as your rights to control our use of them.
        </p>

        <h2>2. What Are Cookies?</h2>
        <p>
          Cookies are small data files that are placed on your computer or mobile device when you visit a website.
          Cookies are widely used by website owners to make their websites work, or to work more efficiently, as well as
          to provide reporting information.
        </p>
        <p>
          Cookies set by the website owner (in this case, Stamps of Approval) are called "first-party cookies". Cookies
          set by parties other than the website owner are called "third-party cookies". Third-party cookies enable
          third-party features or functionality to be provided on or through the website (e.g., advertising, interactive
          content, and analytics).
        </p>

        <h2>3. Why Do We Use Cookies?</h2>
        <p>
          We use first-party and third-party cookies for several reasons. Some cookies are required for technical
          reasons in order for our website to operate, and we refer to these as "essential" or "strictly necessary"
          cookies. Other cookies enable us to track and target the interests of our users to enhance the experience on
          our website. Third parties serve cookies through our website for advertising, analytics, and other purposes.
        </p>

        <h2>4. Types of Cookies We Use</h2>

        <h3>4.1 Essential Cookies</h3>
        <p>
          These cookies are strictly necessary to provide you with services available through our website and to use
          some of its features, such as access to secure areas. Because these cookies are strictly necessary to deliver
          the website, you cannot refuse them without impacting how our website functions.
        </p>

        <h3>4.2 Performance and Functionality Cookies</h3>
        <p>
          These cookies are used to enhance the performance and functionality of our website but are non-essential to
          their use. However, without these cookies, certain functionality may become unavailable.
        </p>

        <h3>4.3 Analytics and Customization Cookies</h3>
        <p>
          These cookies collect information that is used either in aggregate form to help us understand how our website
          is being used or how effective our marketing campaigns are, or to help us customize our website for you.
        </p>

        <h3>4.4 Advertising Cookies</h3>
        <p>
          These cookies are used to make advertising messages more relevant to you. They perform functions like
          preventing the same ad from continuously reappearing, ensuring that ads are properly displayed, and in some
          cases selecting advertisements that are based on your interests.
        </p>

        <h3>4.5 Social Media Cookies</h3>
        <p>
          These cookies are used to enable you to share pages and content that you find interesting on our website
          through third-party social networking and other websites. These cookies may also be used for advertising
          purposes.
        </p>

        <h2>5. Cookie List</h2>
        <p>Here is a list of the main cookies we use and what we use them for:</p>

        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Cookie Name</th>
              <th className="px-4 py-2 text-left">Purpose</th>
              <th className="px-4 py-2 text-left">Duration</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            <tr>
              <td className="px-4 py-2">session</td>
              <td className="px-4 py-2">Authentication and user session management</td>
              <td className="px-4 py-2">Session</td>
            </tr>
            <tr>
              <td className="px-4 py-2">preferences</td>
              <td className="px-4 py-2">Stores user preferences such as theme settings</td>
              <td className="px-4 py-2">1 year</td>
            </tr>
            <tr>
              <td className="px-4 py-2">_ga</td>
              <td className="px-4 py-2">Google Analytics - Used to distinguish users</td>
              <td className="px-4 py-2">2 years</td>
            </tr>
            <tr>
              <td className="px-4 py-2">_gid</td>
              <td className="px-4 py-2">Google Analytics - Used to distinguish users</td>
              <td className="px-4 py-2">24 hours</td>
            </tr>
          </tbody>
        </table>

        <h2>6. How to Control Cookies</h2>
        <p>
          You have the right to decide whether to accept or reject cookies. You can set or amend your web browser
          controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website though
          your access to some functionality and areas of our website may be restricted.
        </p>

        <h3>6.1 Browser Controls</h3>
        <p>
          Most web browsers allow some control of most cookies through the browser settings. To find out more about
          cookies, including how to see what cookies have been set, visit{" "}
          <a href="https://www.aboutcookies.org" className="text-primary hover:underline">
            www.aboutcookies.org
          </a>{" "}
          or{" "}
          <a href="https://www.allaboutcookies.org" className="text-primary hover:underline">
            www.allaboutcookies.org
          </a>
          .
        </p>

        <p>Find out how to manage cookies on popular browsers:</p>
        <ul>
          <li>
            <a href="#" className="text-primary hover:underline">
              Google Chrome
            </a>
          </li>
          <li>
            <a href="#" className="text-primary hover:underline">
              Microsoft Edge
            </a>
          </li>
          <li>
            <a href="#" className="text-primary hover:underline">
              Mozilla Firefox
            </a>
          </li>
          <li>
            <a href="#" className="text-primary hover:underline">
              Microsoft Internet Explorer
            </a>
          </li>
          <li>
            <a href="#" className="text-primary hover:underline">
              Opera
            </a>
          </li>
          <li>
            <a href="#" className="text-primary hover:underline">
              Apple Safari
            </a>
          </li>
        </ul>

        <h2>7. Changes to This Cookie Policy</h2>
        <p>
          We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we
          use or for other operational, legal, or regulatory reasons. Please therefore re-visit this Cookie Policy
          regularly to stay informed about our use of cookies and related technologies.
        </p>

        <h2>8. Contact Us</h2>
        <p>If you have any questions about our use of cookies or other technologies, please contact us at:</p>
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
