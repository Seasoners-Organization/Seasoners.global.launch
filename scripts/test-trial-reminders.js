#!/usr/bin/env node

/**
 * Test Script for Trial Reminder System
 * 
 * This script helps test the trial reminder email system locally or in production.
 * It can:
 * 1. Test the API endpoint manually
 * 2. Check database for users in trial period
 * 3. Simulate email sends
 * 
 * Usage:
 *   node scripts/test-trial-reminders.js --local
 *   node scripts/test-trial-reminders.js --production
 *   node scripts/test-trial-reminders.js --check-users
 */

const https = require('https');
const http = require('http');

// Configuration
const LOCAL_URL = 'http://localhost:3000';
const PRODUCTION_URL = 'https://www.seasoners.eu';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  log(title, 'bright');
  console.log('='.repeat(60) + '\n');
}

/**
 * Make HTTP request
 */
function makeRequest(url, options, data = null) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    const req = client.request(url, options, (res) => {
      let body = '';
      
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonBody = JSON.parse(body);
          resolve({ status: res.statusCode, data: jsonBody });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

/**
 * Test the trial reminders endpoint
 */
async function testEndpoint(baseUrl, adminSecret) {
  logSection('🧪 Testing Trial Reminder Endpoint');
  
  log(`Target: ${baseUrl}/api/cron/trial-reminders`, 'cyan');
  log(`Method: POST (Manual trigger)`, 'cyan');
  
  try {
    const url = `${baseUrl}/api/cron/trial-reminders`;
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    };
    
    const data = { secret: adminSecret };
    
    log('\n⏳ Sending request...', 'yellow');
    
    const response = await makeRequest(url, options, data);
    
    log('\n📥 Response received:', 'bright');
    log(`Status Code: ${response.status}`, response.status === 200 ? 'green' : 'red');
    log(`Response Body:`, 'cyan');
    console.log(JSON.stringify(response.data, null, 2));
    
    if (response.status === 200) {
      log('\n✅ SUCCESS: Trial reminder system is working!', 'green');
      
      if (response.data.results) {
        log('\n📊 Results Summary:', 'bright');
        const results = response.data.results;
        log(`  • Users checked: ${results.checked || 0}`, 'cyan');
        log(`  • Emails sent: ${results.sent || 0}`, 'cyan');
        log(`  • Errors: ${results.errors || 0}`, results.errors > 0 ? 'red' : 'green');
      }
    } else {
      log('\n❌ FAILED: Request did not succeed', 'red');
      if (response.status === 401) {
        log('  → Check your ADMIN_SECRET is correct', 'yellow');
      }
    }
    
  } catch (error) {
    log('\n❌ ERROR: Request failed', 'red');
    log(`  ${error.message}`, 'red');
    
    if (error.code === 'ECONNREFUSED') {
      log('\n💡 Tip: Make sure your development server is running', 'yellow');
      log('   Run: npm run dev', 'cyan');
    }
  }
}

/**
 * Test Vercel Cron endpoint (GET request)
 */
async function testCronEndpoint(cronSecret) {
  logSection('⏰ Testing Vercel Cron Endpoint');
  
  const url = 'https://www.seasoners.eu/api/cron/trial-reminders';
  
  log(`Target: ${url}`, 'cyan');
  log(`Method: GET (Vercel Cron)`, 'cyan');
  
  try {
    const options = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${cronSecret}`
      }
    };
    
    log('\n⏳ Sending request...', 'yellow');
    
    const response = await makeRequest(url, options);
    
    log('\n📥 Response received:', 'bright');
    log(`Status Code: ${response.status}`, response.status === 200 ? 'green' : 'red');
    log(`Response Body:`, 'cyan');
    console.log(JSON.stringify(response.data, null, 2));
    
    if (response.status === 200) {
      log('\n✅ SUCCESS: Cron endpoint is configured correctly!', 'green');
    } else {
      log('\n❌ FAILED: Cron endpoint test failed', 'red');
      if (response.status === 401) {
        log('  → Check your CRON_SECRET is correct in Vercel', 'yellow');
      }
    }
    
  } catch (error) {
    log('\n❌ ERROR: Request failed', 'red');
    log(`  ${error.message}`, 'red');
  }
}

/**
 * Display helpful information
 */
function displayInfo() {
  logSection('📚 Trial Reminder System - Test Guide');
  
  log('This script tests the trial reminder email system.', 'cyan');
  log('It helps verify that emails will be sent at the right times.\n', 'cyan');
  
  log('Available Commands:', 'bright');
  log('  --local        Test against local development server (localhost:3000)', 'cyan');
  log('  --production   Test against production server (www.seasoners.eu)', 'cyan');
  log('  --cron         Test Vercel cron endpoint with CRON_SECRET', 'cyan');
  log('  --help         Show this help message\n', 'cyan');
  
  log('Required Environment Variables:', 'bright');
  log('  ADMIN_SECRET   Secret for manual testing (POST requests)', 'cyan');
  log('  CRON_SECRET    Secret for Vercel cron (GET requests)\n', 'cyan');
  
  log('Setup Instructions:', 'bright');
  log('  1. Make sure your .env file has ADMIN_SECRET and CRON_SECRET', 'cyan');
  log('  2. Add these same secrets to Vercel production environment', 'cyan');
  log('  3. Run development server: npm run dev', 'cyan');
  log('  4. Run this test script\n', 'cyan');
  
  log('Examples:', 'bright');
  log('  node scripts/test-trial-reminders.js --local', 'cyan');
  log('  node scripts/test-trial-reminders.js --production', 'cyan');
  log('  node scripts/test-trial-reminders.js --cron\n', 'cyan');
}

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--help')) {
    displayInfo();
    return;
  }
  
  // Load environment variables
  try {
    require('dotenv').config();
  } catch (e) {
    log('⚠️  Warning: Could not load .env file. Using system environment variables.', 'yellow');
  }
  
  const adminSecret = process.env.ADMIN_SECRET;
  const cronSecret = process.env.CRON_SECRET;
  
  if (args.includes('--local')) {
    if (!adminSecret) {
      log('❌ ERROR: ADMIN_SECRET not found in environment variables', 'red');
      log('   Add ADMIN_SECRET to your .env file', 'yellow');
      return;
    }
    await testEndpoint(LOCAL_URL, adminSecret);
  }
  
  if (args.includes('--production')) {
    if (!adminSecret) {
      log('❌ ERROR: ADMIN_SECRET not found in environment variables', 'red');
      log('   Add ADMIN_SECRET to your .env file', 'yellow');
      return;
    }
    await testEndpoint(PRODUCTION_URL, adminSecret);
  }
  
  if (args.includes('--cron')) {
    if (!cronSecret) {
      log('❌ ERROR: CRON_SECRET not found in environment variables', 'red');
      log('   Add CRON_SECRET to your .env file', 'yellow');
      return;
    }
    await testCronEndpoint(cronSecret);
  }
  
  log('\n✨ Test completed!', 'green');
  log('📖 Check the logs above for results.\n', 'cyan');
}

// Run the script
main().catch(error => {
  log('\n💥 Unexpected error:', 'red');
  console.error(error);
  process.exit(1);
});
