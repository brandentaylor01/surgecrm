const http = require('http');

// Craft a realistic multi-line lead data payload from Data Axle matching your dashboard spec
const mockPayload = JSON.stringify([
  {
    account_name: "Apex Luxury Ventures LLC",
    contact_name: "Marcus Sterling",
    contact_email: "m.sterling@apexluxury.com",
    financial_matrix: 15000
  },
  {
    account_name: "Summit Capital Group",
    contact_name: "Helena Vance",
    contact_email: "vance@summitcap.io",
    financial_matrix: 8500
  },
  {
    account_name: "Ohio Storm Logistical Systems",
    contact_name: "Branden Taylor",
    contact_email: "ops@ohiostorm.logistics",
    financial_matrix: 24000
  }
]);

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/intake/data-axle',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(mockPayload)
  }
};

console.log('Sending mock Data Axle ingest packet to http://localhost:3000/api/intake/data-axle...\n');

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log(`[STATUS CODE] : ${res.statusCode}`);
    console.log(`[RESPONSE BODY]: ${body}\n`);
    if (res.statusCode === 200) {
      console.log('✅ Success! Data Axle intake parser verified functional.');
    } else {
      console.log('⚠️ Server returned non-200 code. Ensure your Next.js dev server is running on port 3000.');
    }
  });
});

req.on('error', (e) => {
  console.error(`❌ Connection failed: ${e.message}`);
  console.log('\nTip: Run "npm run dev" in another terminal tab to spin up the local server first!');
});

req.write(mockPayload);
req.end();
