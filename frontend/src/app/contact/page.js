import StaticPage from "@/components/pages/static/StaticPage";
import ContactForm from "@/components/pages/static/ContactForm";

export const metadata = {
  title: "Contact Us | Play House",
  description: "Get in touch with the Play House team.",
};

export default function Page() {
  return (
    <StaticPage eyebrow="We'd love to hear from you" title="Contact Us">
      <p>
        Questions about an order or a toy? Send us a message and we'll reply by
        email.
      </p>
      <ContactForm />
    </StaticPage>
  );
}
