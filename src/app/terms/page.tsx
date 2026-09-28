import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = { title: "Terms", description: "Terms for using RedCup.in." };

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms"
      updated="28 September 2026"
      sections={[
        {
          title: "What RedCup is",
          body: [
            "RedCup.in is a public, paid ranking of Instagram creators. A payment buys a position on the board at the rank that amount supports when the payment clears.",
            "Listings are paid placement. They are not reviews, endorsements or recommendations by RedCup.",
          ],
        },
        {
          title: "Who can list",
          body: [
            "You must be 18 or older and own the Instagram account you list, or manage it with the owner's written permission.",
            "You must verify the handle by DM before paying. We may remove a listing if ownership is disputed.",
          ],
        },
        {
          title: "Payments",
          body: [
            "Prices are in Indian rupees. GST is added at checkout. Payments are processed by Razorpay and are final once the rank goes live.",
            "A payment does not guarantee clicks, followers, brand requests or income. Someone else can pay more and take your rank.",
            "If we remove a listing by mistake, we credit the full amount to your RedCup wallet.",
          ],
        },
        {
          title: "What is not allowed",
          body: [
            "Betting and real-money gaming promotion, adult content, impersonation, and anything illegal in India.",
            "Scraping the board, manipulating clicks, or automated bidding without our written permission.",
          ],
        },
        {
          title: "Brands",
          body: [
            "Brand accounts are free. Brands must use a work email and must not misrepresent who they are in a collab request. Fees are agreed directly between brand and creator.",
          ],
        },
        {
          title: "Grievances",
          body: ["Write to grievance@redcup.in. We acknowledge within 24 hours and resolve within 15 days."],
        },
      ]}
    />
  );
}
