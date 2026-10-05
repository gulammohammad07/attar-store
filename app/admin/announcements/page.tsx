import { prisma } from "@/lib/prisma";
import AnnouncementsManager from "@/components/admin/AnnouncementsManager";

export default async function AnnouncementsPage() {
  const announcements = await prisma.announcement.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Offers &amp; Launches
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage the offers, sales and product-launch announcements shown in
          the homepage &ldquo;Offers &amp; New Launches&rdquo; section.
        </p>
      </div>

      <AnnouncementsManager
        items={announcements.map((announcement) => ({
          id: announcement.id,
          badge: announcement.badge,
          title: announcement.title,
          description: announcement.description,
          imageUrl: announcement.imageUrl,
          imagePublicId: announcement.imagePublicId,
          linkUrl: announcement.linkUrl,
          isActive: announcement.isActive,
          sortOrder: announcement.sortOrder,
        }))}
      />
    </div>
  );
}
