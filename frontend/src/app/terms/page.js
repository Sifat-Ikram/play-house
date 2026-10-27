import StaticPage, { H } from "@/components/pages/static/StaticPage";

export const metadata = {
  title: "Terms of Service | Play House",
  description: "Terms for using Play House.",
};

export default function Page() {
  return (
    <StaticPage eyebrow="Legal" title="Terms of Service" updated="2026">
      <p>
        By using Play House you agree to these terms. This is a portfolio
        project, so no real payments are taken.
      </p>
      <div>
        <H>Accounts</H>
        <p>
          Keep your login details safe. You are responsible for activity on your
          account.
        </p>
      </div>
      <div>
        <H>Orders and pricing</H>
        <p>
          Prices are in BDT and may change. Stock availability is checked when
          you place an order.
        </p>
      </div>
      <div>
        <H>Payment</H>
        <p>Cash on Delivery is currently the only active payment method.</p>
      </div>
      <div>
        <H>Reviews</H>
        <p>Reviews must be honest and respectful.</p>
      </div>
      <div>
        <H>Returns</H>
        <p>
          See our{" "}
          <a href="/shipping-returns" className="font-bold underline">
            Shipping and Returns
          </a>{" "}
          page.
        </p>
      </div>
      <div>
        <H>Changes</H>
        <p>We may update these terms from time to time.</p>
      </div>
    </StaticPage>
  );
}
