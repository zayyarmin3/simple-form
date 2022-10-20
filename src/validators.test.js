const {validEmailFormat} = require('./validators')


test('Email Validity test', () => {
    expect(validEmailFormat('email@example.com')).toBe(true)
    expect(validEmailFormat('example.com')).toBe(false)
    expect(validEmailFormat('example')).toBe(false)
    expect(validEmailFormat('')).toBe(false)
})

