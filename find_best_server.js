const https = require('https');

// Test with a mix of popular, old, and obscure movies
const testIds = [
  { name: 'Inside Out 2', id: '1022789' },
  { name: 'Oppenheimer', id: '872585' },
  { name: 'The Godfather', id: '238' },
  { name: 'Parasite (2019)', id: '496243' },
  { name: 'Mommy (2014)', id: '263115' },
  { name: 'The Zone of Interest', id: '809489' },
  { name: 'Past Lives', id: '1010581' },
];

function test(url) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      timeout: 6000,
    }, (res) => {
      let body = '';
      res.on('data', c => { if (body.length < 600) body += c; });
      res.on('end', () => {
        const title = body.match(/<title>(.*?)<\/title>/i)?.[1] || '';
        const ok = res.statusCode === 200 && !title.toLowerCase().includes('not found') && !title.toLowerCase().includes('error') && !title.toLowerCase().includes('404');
        resolve({ status: res.statusCode, ok, title: title.slice(0, 60) });
      });
    }).on('error', () => resolve({ ok: false, status: 'ERR' }))
      .on('timeout', () => resolve({ ok: false, status: 'TIMEOUT' }));
  });
}

const providers = [
  { name: 'vidlink.pro', url: id => `https://vidlink.pro/movie/${id}` },
  { name: 'player.videasy.to', url: id => `https://player.videasy.to/movie/${id}` },
  { name: 'autoembed.co', url: id => `https://autoembed.co/movie/tmdb/${id}` },
  { name: '2embed.cc', url: id => `https://www.2embed.cc/embed/${id}` },
  { name: 'vidsrc.pm', url: id => `https://vidsrc.pm/embed/movie/${id}` },
  { name: 'embedder.cc', url: id => `https://embedder.cc/movie/${id}` },
  { name: 'smashystream', url: id => `https://embed.smashystream.com/playere.php?tmdb=${id}` },
  { name: 'vidsrc.co', url: id => `https://vidsrc.co/embed/movie/${id}` },
  { name: 'flixhq.to', url: id => `https://flixhq.to/embed/movie/${id}` },
  { name: 'superembed', url: id => `https://superembed.stream/embed/movie/${id}` },
  { name: 'vidsrc.su', url: id => `https://vidsrc.su/embed/movie?tmdb=${id}` },
  { name: 'frembed.pro', url: id => `https://frembed.pro/api/film.php?id=${id}` },
];

async function run() {
  const scores = {};
  for (const p of providers) scores[p.name] = 0;

  for (const movie of testIds) {
    process.stdout.write(`\n=== ${movie.name} (${movie.id}) ===\n`);
    for (const p of providers) {
      const r = await test(p.url(movie.id));
      const mark = r.ok ? '✅' : '❌';
      if (r.ok) scores[p.name]++;
      process.stdout.write(`  ${mark} ${p.name}: ${r.status} ${r.title ? '| ' + r.title : ''}\n`);
    }
  }

  console.log('\n\n=== FINAL SCORES (out of', testIds.length, ') ===');
  Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .forEach(([name, score]) => console.log(`  ${score}/${testIds.length} — ${name}`));
}

run();
