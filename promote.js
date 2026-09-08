const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
async function main() {
  await p.user.update({
    where: { email: 'safwanezirdane01@gmail.com' },
    data: { role: 'ADMIN' },
  });
  console.log('User promoted to ADMIN!');
  await p.$disconnect();
}
main();
