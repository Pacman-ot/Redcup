import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = { title: "Privacy", description: "How RedCup.in collects and uses data." };

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy"
      updated="28 September 2026"
      sections={[
        {
          title: "What we collect",
          body: [
            "Creators: your Instagram handle, the public profile details Instagram shares when you DM us (name, profile photo, follower count), the boards you pick, and your payment records.",
            "Brands: company name, work email, optional GSTIN and the requests you send.",
            "Visitors: a hashed IP address and a random visitor ID, used to count profile clicks fairly and to stop abuse.",
          ],
        },
        {
          title: "What is public",
          body: ["Your rank, the amounts you paid, the dates of each payment and your public Instagram details are shown on the board. That is how RedCup works."],
        },
        {
          title: "Who we share with",
          body: [
            "Razorpay for payments, Meta's Instagram Platform for verification, our hosting and database providers, and WhatsApp messaging providers for alerts you ask for. We do not sell personal data.",
          ],
        },
        {
          title: "Your rights",
          body: [
            "Under India's Digital Personal Data Protection Act you can ask to see, correct or delete your data. Removing a listing does not undo a payment.",
            "Write to privacy@redcup.in.",
          ],
        },
      ]}
    />
  );
}
