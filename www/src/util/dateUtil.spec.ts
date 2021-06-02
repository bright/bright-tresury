import { timeToString } from './dateUtil'

describe('dateUtils', () => {
    describe('remainingTimeToStr', () => {
        const ZERO = { days: 0, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }
        const TRANSLATION: { [key: string]: string } = {
            'common.dateTime.day': 'day',
            'common.dateTime.days': 'days',
            'common.dateTime.hour': 'hr',
            'common.dateTime.hours': 'hrs',
            'common.dateTime.minute': 'min',
            'common.dateTime.minutes': 'mins',
            'common.dateTime.second': 's',
            'common.dateTime.seconds': 's',
        }
        const t = (k: string) => TRANSLATION[k]
        it('Only zeros', () => {
            const text = timeToString({ ...ZERO }, t)
            expect(text).toBe('')
        })
        it('1 second', () => {
            const text = timeToString({ ...ZERO, seconds: 1 }, t)
            expect(text).toBe('1s')
        })
        it('2 seconds', () => {
            const text = timeToString({ ...ZERO, seconds: 2 }, t)
            expect(text).toBe('2s')
        })
        it('1 day', () => {
            const text = timeToString({ ...ZERO, days: 1 }, t)
            expect(text).toBe('1day')
        })
        it('2 days', () => {
            const text = timeToString({ ...ZERO, days: 2 }, t)
            expect(text).toBe('2days')
        })
        it('1 day 1 second', () => {
            const text = timeToString({ ...ZERO, days: 1, seconds: 1 }, t)
            expect(text).toBe('1day 1s')
        })
        it('1 day 2hrs 1 second', () => {
            const text = timeToString({ ...ZERO, days: 1, hours: 2, seconds: 1 }, t)
            expect(text).toBe('1day 2hrs')
        })
    })
})
