import BestSellers from "../components/BestSellers";
import Categories from "../components/Categories";
import FeaturedCollections from "../components/FeaturedCollections";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Categories />
      <FeaturedCollections />
      <BestSellers />
    </>
  );
}
