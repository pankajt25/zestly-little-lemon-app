/**
 * scripts/test_validation.js
 * Unit test check for validation helpers.
 */

const {
  isValidFirstName,
  isValidLastName,
  isValidEmail,
  isValidPhoneNumber,
  formatPhoneNumber,
} = require('../src/utils/validation');

function assert(condition, message) {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    process.exit(1);
  }
  console.log(`PASS: ${message}`);
}

// 1. First name
assert(isValidFirstName('John') === true, 'Valid first name "John"');
assert(isValidFirstName('Mary-Jane') === true, 'Valid first name with hyphen "Mary-Jane"');
assert(isValidFirstName('O\'Connor') === true, 'Valid first name with apostrophe "O\'Connor"');
assert(isValidFirstName('') === false, 'Empty first name rejected');
assert(isValidFirstName('   ') === false, 'Whitespace-only first name rejected');
assert(isValidFirstName('John123') === false, 'First name with numbers rejected');
assert(isValidFirstName('Alex!') === false, 'First name with special char rejected');

// 2. Last name (optional, but if provided must be valid)
assert(isValidLastName('') === true, 'Empty last name allowed');
assert(isValidLastName('Doe') === true, 'Valid last name "Doe"');
assert(isValidLastName('Doe123') === false, 'Invalid last name rejected');

// 3. Email
assert(isValidEmail('alex@example.com') === true, 'Valid email "alex@example.com"');
assert(isValidEmail('user.name+tag@sub.domain.org') === true, 'Complex valid email');
assert(isValidEmail('alex@') === false, 'Incomplete email "alex@" rejected');
assert(isValidEmail('alex@example') === false, 'Missing TLD email rejected');
assert(isValidEmail('@example.com') === false, 'Missing username email rejected');
assert(isValidEmail('') === false, 'Empty email rejected');

// 4. Phone
assert(isValidPhoneNumber('') === true, 'Empty phone allowed (optional)');
assert(isValidPhoneNumber('(217) 555-0113') === true, 'Valid 10-digit formatted US phone');
assert(isValidPhoneNumber('2175550113') === true, 'Valid 10-digit unformatted US phone');
assert(isValidPhoneNumber('555-0113') === false, '7-digit phone rejected');
assert(isValidPhoneNumber('123456789012') === false, '12-digit phone rejected');

// 5. Phone formatter
assert(formatPhoneNumber('2175550113') === '(217) 555-0113', 'Full 10-digit formatted correctly');
assert(formatPhoneNumber('217') === '(217', 'Area code formatted correctly');
assert(formatPhoneNumber('217555') === '(217) 555', 'Area code + prefix formatted correctly');
assert(formatPhoneNumber('(217) 555-0113') === '(217) 555-0113', 'Already formatted idempotent');

console.log('\nAll validation tests passed successfully!');
