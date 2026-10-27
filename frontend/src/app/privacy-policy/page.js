import StaticPage, { H } from "@/components/pages/static/StaticPage";

export const metadata = {
  title: "Privacy Policy | Play House",
  description: "How Play House handles your personal data.",
};

export default function Page() {
  return (
    <StaticPage eyebrow="Legal" title="Privacy Policy" updated="2026">
      <p>
        Play House is a portfolio demonstration store. This page explains what
        information the site handles and why.
      </p>
      <div>
        <H>Information we collect</H>
        <p>
          Account details (name, email, hashed password), delivery details you
          enter at checkout (name, phone, address), your order history and any
          reviews you write.
        </p>
      </div>
      <div>
        <H>How we use it</H>
        <p>
          To process and deliver orders, show your order history, send
          password-reset and back-in-stock emails you request, and keep the shop
          secure.
        </p>
      </div>
      <div>
        <H>Cookies and local storage</H>
        <p>
          We store a login token, a cart identifier and, for guests, recent
          order numbers in your browser so the cart and order tracking keep
          working.
        </p>
      </div>
      <div>
        <H>Security</H>
        <p>
          Passwords are hashed and never stored in plain text. Access tokens are
          short-lived and sensitive endpoints are rate limited.
        </p>
      </div>
      <div>
        <H>Your choices</H>
        <p>
          You can update or delete your account and saved addresses from your
          profile at any time.
        </p>
      </div>
      <div>
        <H>Contact</H>
        <p>
          Questions? Use the{" "}
          <a href="/contact" className="font-bold underline">
            contact page
          </a>
          .
        </p>
      </div>
    </StaticPage>
  );
}
