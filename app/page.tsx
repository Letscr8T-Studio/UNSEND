import { Compare } from "@/components/Compare";
import { Extras } from "@/components/Extras";
import { Faq } from "@/components/Faq";
import { Feeling } from "@/components/Feeling";
import { Footer } from "@/components/Footer";
import { Announcement, Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Inboxes } from "@/components/Inboxes";
import { Join } from "@/components/Join";
import { ProductShot } from "@/components/ProductShot";

export default function Home() {
  return (
    <>
      <Announcement />
      <main>
        <Hero />
        <Inboxes />
        <Feeling />
        <ProductShot />
        <HowItWorks />
        <Compare />
        <Extras />
        <Faq />
        <Join />
      </main>
      <Footer />
    </>
  );
}
