const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function check() {
  const movies = await p.movie.findMany();
  console.log(`Checking ${movies.length} movies in DB...`);
  
  const issues = [];
  for (const m of movies) {
    if (!m.thumbnailUrl || m.thumbnailUrl.trim() === '') {
      issues.push({ id: m.id, title: m.title, reason: 'Empty thumbnailUrl' });
      continue;
    }
    try {
      const res = await fetch(m.thumbnailUrl, { method: 'HEAD' });
      if (!res.ok) {
        issues.push({ id: m.id, title: m.title, url: m.thumbnailUrl, reason: `HTTP ${res.status}` });
      }
    } catch (e) {
      issues.push({ id: m.id, title: m.title, url: m.thumbnailUrl, reason: e.message });
    }
  }

  console.log(`\nFound ${issues.length} poster issues:`);
  console.table(issues);
}

check().catch(console.error).finally(() => p.$disconnect());
