import StaticPage, { H } from "@/components/pages/static/StaticPage";

export const metadata = {
  title: "Shipping & Returns | Play House",
  description: "Delivery times, shipping costs and our 7-day return policy.",
};

export default function Page() {
  return (
    <StaticPage eyebrow="Help" title="Shipping & Returns" updated="2026">
      <div>
        <H>Delivery</H>
        <p>
          Orders are delivered across Bangladesh, usually within 3-5 business
          days.
        </p>
      </div>
      <div>
        <H>Shipping cost</H>
        <p>
          BDT 60 inside Dhaka and BDT 120 outside Dhaka, calculated
          automatically at checkout.
        </p>
      </div>
      <div>
        <H>Tracking</H>
        <p>
          Follow your order from the{" "}
          <a href="/track" className="font-bold underline">
            Track Order
          </a>{" "}
          page using your order number and phone number.
        </p>
      </div>
      <div>
        <H>7-day returns</H>
        <p>
          If your order arrives damaged, wrong or not as described, you can
          request a return within 7 days of delivery from your order page.
          Logged-in customers can submit the request with a reason.
        </p>
      </div>
      <div>
        <H>How a return works</H>
        <p>
          Submit the request, our team reviews it, and the order status changes
          to Returned once approved.
        </p>
      </div>
    </StaticPage>
  );
}
