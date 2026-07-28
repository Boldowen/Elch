import 'dotenv/config';
import bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import { AuthProvider, GuideStatus, ListingCategory, PriceUnit, PricingType, PrismaClient, Role } from '../src/generated/prisma/client.js';
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });
const img = {
  gerYellow: 'https://images.unsplash.com/photo-1695554477492-303aacd40561?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  gerWood: 'https://images.unsplash.com/photo-1695554548143-7c3d0e6510cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  hills: 'https://images.unsplash.com/photo-1751255593200-87d5abfe1bc8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  lake: 'https://images.unsplash.com/photo-1742205024877-cc32e30dafcd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  snowLake: 'https://images.unsplash.com/photo-1742205024400-f61276a39c96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  village: 'https://images.unsplash.com/photo-1773658949441-76d4fb11412f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  camel: 'https://images.unsplash.com/photo-1649357028504-ffc3c1976fc4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  food: 'https://images.unsplash.com/photo-1746716447103-e1618bbd0669?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  guide1: 'https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
  guide2: 'https://images.unsplash.com/photo-1723423694242-4bdb9f39a266?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
};
async function main() {
  const passwordHash = await bcrypt.hash('Password123!', 12);
  const traveler = await prisma.user.upsert({ where: { email: 'traveler@ventour.mn' }, update: {}, create: { email: 'traveler@ventour.mn', name: 'Anu Batsaikhan', passwordHash, provider: AuthProvider.EMAIL, roles: [Role.TRAVELER], avatarUrl: img.guide2, isVerified: true } });
  const admin = await prisma.user.upsert({ where: { email: 'admin@ventour.mn' }, update: { roles: [Role.ADMIN] }, create: { email: 'admin@ventour.mn', name: 'VenTour Admin', passwordHash, roles: [Role.ADMIN], isVerified: true } });
  const host = await prisma.user.upsert({ where: { email: 'guide@ventour.mn' }, update: {}, create: { email: 'guide@ventour.mn', name: 'Bat-Erdene D.', passwordHash, roles: [Role.GUIDE], avatarUrl: img.guide1, isVerified: true } });
  const friend = await prisma.user.upsert({ where: { email: 'nomad@ventour.mn' }, update: {}, create: { email: 'nomad@ventour.mn', name: 'Mika Tanaka', passwordHash, roles: [Role.TRAVELER], avatarUrl: img.guide1, isVerified: true } });
  await prisma.guideProfile.upsert({ where: { userId: host.id }, update: {}, create: { userId: host.id, country: 'Mongolia', city: 'Terelj', bio: 'A former national horse-racing trainer, crafting riding journeys through Terelj and the central steppe.', experienceYears: 12, languages: [{ name: 'English', proficiency: 'Fluent' }, { name: 'Mongolian', proficiency: 'Native' }], expertise: ['Horse riding','Terelj','Eagle hunting'], availability: ['Mon','Wed','Fri','Sat'], pricingType: PricingType.HOURLY, price: 72, status: GuideStatus.APPROVED, verified: true, assessmentScore: 100, referenceContact: 'community@terelj.mn', codeOfConductAccepted: true, rankPoints: 2720, completedTrips: 47, responseRate: 98, rating: 4.98, reviewCount: 267 } });
  const rows = [
    { slug: 'luxury-ger-camp-bogd-khan', title: 'Luxury ger camp under Bogd Khan', location: 'Terelj National Park', description: 'Wake up to sweeping steppe views from a hand-built felt ger, warmed by a wood stove and styled with authentic Mongolian craft.', category: ListingCategory.TRENDING, price: 89, priceUnit: PriceUnit.PER_NIGHT, datesLabel: 'Aug 12 – 17', tags: ['Ger stay','Breakfast'], amenities: ['Wood stove','Breakfast','Horse riding','Hot shower','Stargazing deck'], rating: 4.94, reviewCount: 218, images: [img.gerYellow,img.gerWood,img.hills] },
    { slug: 'lakeside-eco-lodge', title: 'Lakeside eco lodge', location: 'Lake Khuvsgul', description: 'A serene timber lodge on the shore of Mongolia’s deepest lake.', category: ListingCategory.HOTEL, price: 124, priceUnit: PriceUnit.PER_NIGHT, datesLabel: 'Sep 3 – 8', tags: ['Lake view','Sauna'], amenities: ['Lake view','Sauna','Kayaks','Restaurant','Wi-Fi'], rating: 4.88, reviewCount: 143, images: [img.lake,img.snowLake,img.village] },
    { slug: 'gobi-desert-camel-expedition', title: 'Gobi desert camel expedition camp', location: 'Gobi Desert', description: 'Sleep beneath a blanket of stars in the heart of the Gobi.', category: ListingCategory.TRENDING, price: 76, priceUnit: PriceUnit.PER_NIGHT, datesLabel: 'Jul 20 – 25', tags: ['Camel trek','Full board'], amenities: ['Camel trek','Full board','Guide','Bonfire','Sand dunes'], rating: 4.79, reviewCount: 96, images: [img.camel,img.hills,img.gerWood] },
    { slug: 'khorkhog-buuz-cooking-table', title: 'Khorkhog & buuz cooking table', location: 'Ulaanbaatar', description: 'A hands-on feast of Mongolia’s signature dishes.', category: ListingCategory.FOODS, price: 34, priceUnit: PriceUnit.PER_PERSON, datesLabel: 'Daily', tags: ['Cooking','2 hours'], amenities: ['All ingredients','Recipes','Local host','Tea','Vegetarian option'], rating: 4.85, reviewCount: 174, images: [img.food,img.gerWood,img.hills] },
  ];
  for (const row of rows) {
    const { images, ...data } = row;
    await prisma.listing.upsert({ where: { slug: row.slug }, update: {}, create: { ...data, hostId: host.id, images: { create: images.map((url, sortOrder) => ({ url, sortOrder })) } } });
  }
  let post = await prisma.post.findFirst({ where: { authorId: friend.id, text: { startsWith: 'Sunrise over Khuvsgul' } } });
  post ??= await prisma.post.create({ data: { authorId: friend.id, text: 'Sunrise over Khuvsgul was worth the 5am start. Looking for two travel buddies to share a northbound ride next week.', location: 'Lake Khuvsgul, Mongolia', images: { create: [{ url: img.lake, sortOrder: 0 }] } } });
  await prisma.follow.upsert({ where: { followerId_followingId: { followerId: friend.id, followingId: traveler.id } }, update: {}, create: { followerId: friend.id, followingId: traveler.id } });
  await prisma.postLike.upsert({ where: { postId_userId: { postId: post.id, userId: traveler.id } }, update: {}, create: { postId: post.id, userId: traveler.id } });
  console.log({ traveler: traveler.email, guide: host.email, admin: admin.email, password: 'Password123!' });
}
main().finally(() => prisma.$disconnect());
