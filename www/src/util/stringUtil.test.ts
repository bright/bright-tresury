import {ellipseTextInTheMiddle} from "./stringUtil";

describe('transform params', () => {
    test('cuts off middle part of the string', () => {
        const ellipseText = ellipseTextInTheMiddle('abcdefMIDDLE123456', 12)
        expect(ellipseText).toBe('abcdef...123456');
    })

    test('does not cut off the string if its not long enough', () => {
        const ellipseText = ellipseTextInTheMiddle('123456', 12)
        expect(ellipseText).toBe('123456');
    })

    test('does not cut off the string if requested visible characters is negative', () => {
        const ellipseText = ellipseTextInTheMiddle('Test string', -10)
        expect(ellipseText).toBe('Test string');
    })

    test('returns empty string if requested value is empty', () => {
        const ellipseText = ellipseTextInTheMiddle('', 3)
        expect(ellipseText).toBe('');
    })
})
