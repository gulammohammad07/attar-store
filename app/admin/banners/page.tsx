import { prisma } from "@/lib/prisma";
import BannerForm from "@/components/banner/BannerForm";

const sections = [
  {
    section: "hero",
    title: "Hero Banner",
    description:
      "Large image shown on the right of the homepage hero. Also sets the hero eyebrow text via its subtitle.",
  },
  {
    section: "story",
    title: "Our Story Banner",
    description: "Image used in the 'Our Story' section of the homepage.",
  },
] as const;

export default async function BannersPage() {
  const banners = await prisma.banner.findMany();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Banners</h1>
        <p className="text-muted-foreground mt-2">
          Manage the banners shown across the storefront. All images are
          uploaded to Cloudinary.
        </p>
      </div>

      {sections.map(({ section, title, description }) => (
        <BannerForm
          key={section}
          section={section}
          title={title}
          description={description}
          initial={banners.find((b) => b.section === section)}
        />
      ))}
    </div>
  );
}
