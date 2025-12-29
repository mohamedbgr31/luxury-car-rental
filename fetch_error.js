const fetch = require('node-fetch'); // Assuming node-fetch is available or using built-in fetch in Node 18+

async function run() {
    try {
        const res = await fetch('http://localhost:5001/api/dashboard/stats?period=all');
        const text = await res.text();
        const json = JSON.parse(text);
        if (res.status === 200) {
            console.log('SUCCESS! Revenue:', json.overview?.totalRevenue);
            console.log('Top Cars:', json.topCars?.length);
        } else {
            console.log('Error Message:', json.message?.substring(0, 200));
        }
    } catch (e) {
        console.error(e);
    }
}

run();
