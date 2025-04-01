import { faker } from '@faker-js/faker';
import { prisma } from '../src/config/db'




async function main() {
    // ... you will write your Prisma Client queries here

    // Generera fake-användare
    for(let i = 0; i < 100; i++) {
        const user = await prisma.user.create({
            data: {
                email: faker.internet.email(),
                password: faker.internet.password()
            }
        })

        // För varje fakeanvändare generera 10 inlägg
        for(let j = 0; j < 10; j++) {
            const post = await prisma.post.create({
                data: {
                    title: faker.lorem.word(10),
                    content: faker.lorem.paragraph(1),
                    authorId: user.id
                }
            })
        }
    }

     // Om något inte blir bra, kör deleteMany - endast i dev-mode!




  }
  
  main()
    .then(async () => {
      await prisma.$disconnect()
    })
    .catch(async (e) => {
      console.error(e)
      await prisma.$disconnect()
      process.exit(1)
    })