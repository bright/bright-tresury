import {getInitials} from "./initials.helpers";

describe('getInitials', () => {
    it('should return empty string when name is undefined', () => {
        const initials = getInitials(undefined)
        expect(initials).toBe('');
    })

    it('should return empty string when name is empty', () => {
        const initials = getInitials('')
        expect(initials).toBe('');
    })

    it('should return the name when name is one sign long in capitals', () => {
        const initials = getInitials('a')
        expect(initials).toBe('A');
    })

    it('should return the first two signs of the name in capitals', () => {
        const initials = getInitials('Username')
        expect(initials).toBe('US');
    })
})
