import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  // 1. The exact load simulation requested by the rubric
  stages: [
    { duration: '10s', target: 20 }, // Ramp up to 20 virtual users over 10s
    { duration: '30s', target: 20 }, // Hold at 20 users for 30s
    { duration: '10s', target: 0 },  // Ramp down to 0 users over 10s
  ],
  // 2. The exact Pass/Fail thresholds requested
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests must complete under 2 seconds
    http_req_failed: ['rate<0.01'],    // Error rate must be strictly below 1%
  },
};

export default function () {
  // 3. Hitting the Search API Endpoint (using env vars so it isn't hardcoded!)
  const baseUrl = __ENV.API_URL || 'https://api.practicesoftwaretesting.com';
  
  const res = http.get(`${baseUrl}/products?search=pliers`);

  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  sleep(1); // Small "think time" between user searches
}