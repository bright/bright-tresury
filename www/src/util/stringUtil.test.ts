import {ellipseTextInTheMiddle, remainingTimeToStr, singularPluralOrNull} from "./stringUtil";

describe('stringUtil', () => {
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
    describe('singularPluralOrNull', () => {
        const SINGULAR = 'singular';
        const PLURAL = 'plural';

        it('0 as null', () => {
            const text = singularPluralOrNull(0, SINGULAR, PLURAL);
            expect(text).toBeNull();
        })
        it('1 as singular', () => {
            const text = singularPluralOrNull(1, SINGULAR, PLURAL);
            expect(text).toBe(`1${SINGULAR}`);

        })
        it('2 as plural', () => {
            const text = singularPluralOrNull(2, SINGULAR, PLURAL);
            expect(text).toBe(`2${PLURAL}`);
        })
        it('-1 as singular', () => {
            const text = singularPluralOrNull(-1, SINGULAR, PLURAL);
            expect(text).toBe(`-1${SINGULAR}`);
        })
        it('-2 as plural', () => {
            const text = singularPluralOrNull(-2, SINGULAR, PLURAL);
            expect(text).toBe(`-2${PLURAL}`);
        })
    })
    describe('remainingTimeToStr', () => {
        const ZERO = {days: 0, hours: 0, minutes: 0, seconds: 0, milliseconds: 0};
        const TRANSLATION: {[key: string]: string} = {
            "common.dateTime.day": "day",
            "common.dateTime.days": "days",
            "common.dateTime.hour": "hr",
            "common.dateTime.hours": "hrs",
            "common.dateTime.minute": "min",
            "common.dateTime.minutes": "mins",
            "common.dateTime.second": "s",
            "common.dateTime.seconds": "s"
        }
        const t = (k: string) => TRANSLATION[k];
        it( 'Only zeros', () => {
            const text = remainingTimeToStr({...ZERO}, t)
            expect(text).toBe('');
        })
        it('1 second', () => {
            const text = remainingTimeToStr({...ZERO, seconds:1}, t)
            expect(text).toBe('1s')
        })
        it('2 seconds', () => {
            const text = remainingTimeToStr({...ZERO, seconds:2}, t)
            expect(text).toBe('2s')
        })
        it('1 day', () => {
            const text = remainingTimeToStr({...ZERO, days: 1}, t)
            expect(text).toBe('1day')
        })
        it('2 days', () => {
            const text = remainingTimeToStr({...ZERO, days: 2}, t)
            expect(text).toBe('2days')
        })
        it('1 day 1 second', () => {
            const text = remainingTimeToStr({...ZERO, days: 1, seconds:1}, t)
            expect(text).toBe('1day 1s')
        })
        it('1 day 2hrs 1 second', () => {
            const text = remainingTimeToStr({...ZERO, days: 1, hours: 2, seconds:1}, t)
            expect(text).toBe('1day 2hrs')
        })
    })
})
