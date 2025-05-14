
function isPositiveInt(val) {
  return Number.isInteger(val) && val > 0
}

function validateEmail(email) {
  return typeof email === 'string'
    && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function validatePhoneNumber(phone) {
  return typeof phone === 'string'
    && /^[\d\-\+\s()]+$/.test(phone)
}

module.exports = {
    isPositiveInt,
    validateEmail,
    validatePhoneNumber,
  }