import { prisma } from "../src/index.js"

const main = async () => {
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: {},
    create: {
      email: "demo@example.com",
      name: "デモユーザー",
      passwordHash: "PLACEHOLDER",
    },
  })

  await prisma.book.deleteMany({ where: { userId: demoUser.id } })

  await prisma.book.createMany({
    data: [
      {
        title: "デモ１",
        author: "デモ著者１",
        genre: "小説",
        publishedYear: 2019,
        coverImage: "https://m.media-amazon.com/images/I/61cBoLH66wL._AC_UL320_.jpg",
        description: "デモ",
        rating: 4,
        userId: demoUser.id,
      },
      {
        title: "デモ２",
        author: "デモ著者２",
        genre: "ビジネス",
        publishedYear: 2021,
        coverImage: "https://placehold.co/300x450?text=Book+2",
        description: "デモ",
        rating: 5,
        userId: demoUser.id,
      },
      {
        title: "デモ３",
        author: "デモ著者３",
        genre: "技術",
        publishedYear: 2018,
        coverImage: "https://placehold.co/300x450?text=Book+3",
        description:
          "デモ用の長めの説明文。リスト画面や詳細画面でテキストが折り返されたときの見た目を確認するために、ある程度の文字数を入れています。",
        rating: 5,
        userId: demoUser.id,
      },
      {
        title: "デモ４",
        author: "デモ著者４",
        genre: "エッセイ",
        publishedYear: 2015,
        coverImage: "https://placehold.co/300x450?text=Book+4",
        description: "デモ",
        rating: null,
        userId: demoUser.id,
      },
      {
        title: "デモ５",
        author: "デモ著者５",
        genre: "その他",
        publishedYear: 2024,
        coverImage: "https://placehold.co/300x450?text=Book+5",
        description: "デモ",
        rating: 3,
        userId: demoUser.id,
      },
    ],
  })
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
