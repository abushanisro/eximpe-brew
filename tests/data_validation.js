import https from 'https';
import http from 'http';

const BASE_URL = 'http://localhost:3001/api';

function httpGet(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    protocol.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function validateMarketData() {
  console.log('Test Suite: Market Data Validation');

  try {
    const response = await httpGet(`${BASE_URL}/market/all`);
    const { data } = response;

    const tests = [
      {
        name: 'Response has success field',
        pass: response.success === true
      },
      {
        name: 'Nifty price format valid',
        pass: /^\d{1,3}(,\d{3})*$/.test(data.nifty.price)
      },
      {
        name: 'Nifty change format valid',
        pass: /^-?\d+\.\d{2}$/.test(data.nifty.change)
      },
      {
        name: 'Sensex price format valid',
        pass: /^\d{1,3}(,\d{3})*$/.test(data.sensex.price)
      },
      {
        name: 'Sensex change format valid',
        pass: /^-?\d+\.\d{2}$/.test(data.sensex.change)
      },
      {
        name: 'USD/INR price format valid',
        pass: /^\d+\.\d{2}$/.test(data.usdInr.price)
      },
      {
        name: 'EUR/USD price format valid',
        pass: /^\d+\.\d{4}$/.test(data.eurUsd.price)
      },
      {
        name: 'DXY calculation exists',
        pass: data.dxy.price !== '--' && parseFloat(data.dxy.price) > 0
      },
      {
        name: 'Gold price format valid',
        pass: /^\d{1,3}(,\d{3})*$/.test(data.gold.price)
      },
      {
        name: 'Brent price format valid',
        pass: /^\d+\.\d{2}$/.test(data.brent.price)
      },
      {
        name: 'Timestamp format valid',
        pass: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(data.lastUpdated)
      },
      {
        name: 'Response timestamp valid',
        pass: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(response.timestamp)
      }
    ];

    let passed = 0;
    let failed = 0;

    tests.forEach(test => {
      if (test.pass) {
        console.log(`PASS: ${test.name}`);
        passed++;
      } else {
        console.log(`FAIL: ${test.name}`);
        failed++;
      }
    });

    console.log(`\nSummary: ${passed} passed, ${failed} failed\n`);
    return failed === 0;

  } catch (error) {
    console.error('ERROR:', error.message);
    return false;
  }
}

async function validateNewsData() {
  console.log('Test Suite: News Data Validation');
  console.log('===================================\n');

  try {
    const response = await httpGet(`${BASE_URL}/news/corporate`);
    const { data } = response;

    const tests = [
      {
        name: 'Response has success field',
        pass: response.success === true
      },
      {
        name: 'News data is array',
        pass: Array.isArray(data)
      },
      {
        name: 'News count within limits',
        pass: data.length >= 0 && data.length <= 20
      },
      {
        name: 'Count field matches array length',
        pass: response.count === data.length
      }
    ];

    if (data.length > 0) {
      tests.push(
        {
          name: 'First item has title',
          pass: typeof data[0].title === 'string' && data[0].title.length > 0
        },
        {
          name: 'First item has source',
          pass: typeof data[0].source === 'string' && data[0].source.length > 0
        },
        {
          name: 'First item has link',
          pass: typeof data[0].link === 'string' && data[0].link.startsWith('http')
        },
        {
          name: 'First item has valid sentiment',
          pass: ['positive', 'negative', 'neutral'].includes(data[0].sentiment)
        },
        {
          name: 'First item has time format',
          pass: /\d+[dhm] ago/.test(data[0].time)
        }
      );
    }

    let passed = 0;
    let failed = 0;

    tests.forEach(test => {
      if (test.pass) {
        console.log(`PASS: ${test.name}`);
        passed++;
      } else {
        console.log(`FAIL: ${test.name}`);
        failed++;
      }
    });

    console.log(`\nSummary: ${passed} passed, ${failed} failed\n`);
    return failed === 0;

  } catch (error) {
    console.error('ERROR:', error.message);
    return false;
  }
}

async function performanceTest() {
  console.log('Test Suite: Performance Testing');
  console.log('==================================\n');

  const tests = [];

  // Test 1: First request (uncached)
  console.log('Measuring first request (uncached)...');
  const start1 = Date.now();
  await httpGet(`${BASE_URL}/market/all`);
  const time1 = Date.now() - start1;
  console.log(`First request: ${time1}ms`);

  tests.push({
    name: 'First request completes within 10s',
    pass: time1 < 10000
  });

  // Wait a moment then test cache
  await new Promise(resolve => setTimeout(resolve, 100));

  // Test 2: Second request (cached)
  console.log('Measuring second request (cached)...');
  const start2 = Date.now();
  await httpGet(`${BASE_URL}/market/all`);
  const time2 = Date.now() - start2;
  console.log(`Second request: ${time2}ms`);

  tests.push({
    name: 'Cached request completes within 200ms',
    pass: time2 < 200
  });

  tests.push({
    name: 'Cache improves performance',
    pass: time2 < time1
  });

  console.log('');
  let passed = 0;
  let failed = 0;

  tests.forEach(test => {
    if (test.pass) {
      console.log(`PASS: ${test.name}`);
      passed++;
    } else {
      console.log(`FAIL: ${test.name}`);
      failed++;
    }
  });

  console.log(`\nSummary: ${passed} passed, ${failed} failed\n`);
  return failed === 0;
}

(async () => {
  console.log('===========================================');
  console.log('  EximPe API Validation Test Suite');
  console.log('  Date: ' + new Date().toISOString());
  console.log('===========================================\n');

  const marketResult = await validateMarketData();
  const newsResult = await validateNewsData();
  const perfResult = await performanceTest();

  console.log('===========================================');
  console.log('  Final Results');
  console.log('===========================================');
  console.log('Market Data Validation: ' + (marketResult ? 'PASS' : 'FAIL'));
  console.log('News Data Validation:   ' + (newsResult ? 'PASS' : 'FAIL'));
  console.log('Performance Testing:    ' + (perfResult ? 'PASS' : 'FAIL'));
  console.log('===========================================');

  const allPassed = marketResult && newsResult && perfResult;
  console.log('\nOverall Status: ' + (allPassed ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED'));

  process.exit(allPassed ? 0 : 1);
})();
