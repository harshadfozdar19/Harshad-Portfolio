import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
import { Contact } from "@/components/sections/Contact";
import { Credentials } from "@/components/sections/Credentials";
import { Exhibits } from "@/components/sections/Exhibits";
import { Hero } from "@/components/sections/Hero";
import { Inventory } from "@/components/sections/Inventory";
import { Method } from "@/components/sections/Method";
import { Profile } from "@/components/sections/Profile";
import { Record } from "@/components/sections/Record";
import { Research } from "@/components/sections/Research";
import { Ticker } from "@/components/sections/Ticker";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <Ticker />
        <Profile />
        <Record />
        <Method />
        <Exhibits />
        <Inventory />
        <Research />
        <Credentials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
