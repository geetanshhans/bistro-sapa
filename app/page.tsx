import { promises as fs } from "fs";
import path from "path";
import type { SiteData } from "@/types/data";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Menu from "@/components/Menu";
import Specials from "@/components/Specials";
import About from "@/components/About";
import Gallery from "@/components/Gallery";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ActionBar from "@/components/ActionBar";

async function getData(): Promise<SiteData> {
  const file = path.join(process.cwd(), "public", "data.json");
  const raw = await fs.readFile(file, "utf8");
  return JSON.parse(raw) as SiteData;
}

export default async function Home() {
  const data = await getData();
  return (
    <>
      <Nav barName={data.info.name} />
      <main>
        <Hero info={data.info} />
        <Menu categories={data.menu} />
        <Specials specials={data.specials} />
        <About about={data.about} />
        <Gallery images={data.gallery} />
        <Contact info={data.info} hours={data.hours} />
      </main>
      <Footer info={data.info} />
      <ActionBar info={data.info} />
    </>
  );
}
