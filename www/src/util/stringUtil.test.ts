import { ellipseTextInTheMiddle, singularPluralOrNull } from './stringUtil'

describe('stringUtil', () => {
    describe('transform params', () => {
        test('cuts off middle part of the string', () => {
            const ellipseText = ellipseTextInTheMiddle('abcdefMIDDLE123456', 12)
            expect(ellipseText).toBe('abcdef...123456')
        })

        test('does not cut off the string if its not long enough', () => {
            const ellipseText = ellipseTextInTheMiddle('123456', 12)
            expect(ellipseText).toBe('123456')
        })

        test('does not cut off the string if requested visible characters is negative', () => {
            const ellipseText = ellipseTextInTheMiddle('Test string', -10)
            expect(ellipseText).toBe('Test string')
        })

        test('returns empty string if requested value is empty', () => {
            const ellipseText = ellipseTextInTheMiddle('', 3)
            expect(ellipseText).toBe('')
        })

    })
    describe('singularPluralOrNull', () => {
        const SINGULAR = 'singular'
        const PLURAL = 'plural'

        it('0 as null', () => {
            const text = singularPluralOrNull(0, SINGULAR, PLURAL)
            expect(text).toBeNull()
        })
        it('1 as singular', () => {
            const text = singularPluralOrNull(1, SINGULAR, PLURAL)
            expect(text).toBe(`1${SINGULAR}`)
        })
        it('2 as plural', () => {
            const text = singularPluralOrNull(2, SINGULAR, PLURAL)
            expect(text).toBe(`2${PLURAL}`)
        })
        it('-1 as singular', () => {
            const text = singularPluralOrNull(-1, SINGULAR, PLURAL)
            expect(text).toBe(`-1${SINGULAR}`)
        })
        it('-2 as plural', () => {
            const text = singularPluralOrNull(-2, SINGULAR, PLURAL)
            expect(text).toBe(`-2${PLURAL}`)
        })
    })
})
