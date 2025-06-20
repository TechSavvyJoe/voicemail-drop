/**
 * Basic Test Runner for Voicemail Drop Application
 * Simple test runner that can be used without complex setup
 */

console.log('🎯 Basic Test Runner for Voicemail Drop');
console.log('='.repeat(50));

// Test environment check
function testEnvironment() {
  console.log('\n🔧 Environment Check...');
  
  const checks = [
    {
      name: 'Node.js version',
      test: () => process.version,
      expected: 'v16+ recommended'
    },
    {
      name: 'NPM available',
      test: () => typeof require !== 'undefined',
      expected: true
    },
    {
      name: 'Fetch available (Node 18+)',
      test: () => typeof fetch !== 'undefined',
      expected: 'Available or polyfilled'
    }
  ];
  
  checks.forEach(check => {
    try {
      const result = check.test();
      console.log(`✅ ${check.name}: ${result}`);
    } catch (error) {
      console.log(`⚠️  ${check.name}: ${error.message}`);
    }
  });
}

// Test file structure
function testFileStructure() {
  console.log('\n📁 File Structure Check...');
  
  const fs = require('fs');
  const path = require('path');
  
  const requiredFiles = [
    'package.json',
    'next.config.ts',
    'tailwind.config.ts',
    'src/app/layout.tsx',
    'src/app/page.tsx',
    'src/app/api/campaigns/route.ts',
    'src/app/api/customers/route.ts'
  ];
  
  let allFilesExist = true;
  
  requiredFiles.forEach(filePath => {
    const fullPath = path.join(process.cwd(), filePath);
    const exists = fs.existsSync(fullPath);
    console.log(`${exists ? '✅' : '❌'} ${filePath}`);
    if (!exists) allFilesExist = false;
  });
  
  return allFilesExist;
}

// Test package.json scripts
function testPackageScripts() {
  console.log('\n📦 Package Scripts Check...');
  
  try {
    const packageJson = require('./package.json');
    const requiredScripts = ['dev', 'build', 'start', 'lint', 'test'];
    
    let allScriptsExist = true;
    
    requiredScripts.forEach(script => {
      const exists = packageJson.scripts && packageJson.scripts[script];
      console.log(`${exists ? '✅' : '❌'} ${script}: ${exists || 'missing'}`);
      if (!exists) allScriptsExist = false;
    });
    
    return allScriptsExist;
  } catch (error) {
    console.log(`❌ Failed to read package.json: ${error.message}`);
    return false;
  }
}

// Test basic imports
function testBasicImports() {
  console.log('\n📋 Basic Import Test...');
  
  const tests = [
    {
      name: 'React',
      test: () => require('react')
    },
    {
      name: 'Next.js',
      test: () => require('next')
    },
    {
      name: 'React Query',
      test: () => require('@tanstack/react-query')
    }
  ];
  
  let allImportsWork = true;
  
  tests.forEach(test => {
    try {
      test.test();
      console.log(`✅ ${test.name} import working`);
    } catch (error) {
      console.log(`❌ ${test.name} import failed: ${error.message}`);
      allImportsWork = false;
    }
  });
  
  return allImportsWork;
}

// Main test runner
async function runBasicTests() {
  console.log('Starting basic tests...\n');
  
  const startTime = Date.now();
  
  testEnvironment();
  const fileStructure = testFileStructure();
  const packageScripts = testPackageScripts();
  const basicImports = testBasicImports();
  
  const endTime = Date.now();
  const duration = endTime - startTime;
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 BASIC TEST RESULTS');
  console.log('='.repeat(50));
  console.log(`📁 File Structure: ${fileStructure ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`📦 Package Scripts: ${packageScripts ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`📋 Basic Imports: ${basicImports ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`⏱️  Duration: ${duration}ms`);
  
  const allPassed = fileStructure && packageScripts && basicImports;
  
  if (allPassed) {
    console.log('\n🎉 All basic tests passed!');
    console.log('   Your development environment is ready.');
    console.log('   Run "npm run dev" to start the development server.');
    console.log('   Run "npm test" to run the full test suite.');
  } else {
    console.log('\n⚠️  Some basic tests failed.');
    console.log('   Check the issues above and fix them before proceeding.');
  }
  
  return allPassed;
}

// Export for programmatic use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    runBasicTests, 
    testEnvironment, 
    testFileStructure, 
    testPackageScripts, 
    testBasicImports 
  };
}

// Auto-run if executed directly
if (require.main === module) {
  runBasicTests().then(success => {
    process.exit(success ? 0 : 1);
  });
}
