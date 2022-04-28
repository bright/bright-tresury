import { AppEventType } from '../main/top-bar/notifications/app-events.dto'
import { getUrlSearchParams } from './index'

describe('getUrlSearchParams', () => {
    it('should correctly add [] after key when key has one parameter', () => {
        const params = {
            userId: '653f14fb-7bb8-465c-a70c-79d6cd3b755b',
            isRead: false,
            appEventType: [AppEventType.NewIdeaComment],
            ideaId: '68fdb69c-5c6c-4abf-ac89-3fed665f54c4',
        }
        const searchParams = getUrlSearchParams(params).toString()
        const haveArray = searchParams.indexOf('appEventType%5B%5D')

        expect(haveArray).not.toBe(-1)
    })

    it('should correctly add [] after key when key has two parameters', () => {
        const params = {
            userId: '653f14fb-7bb8-465c-a70c-79d6cd3b755b',
            isRead: false,
            appEventType: [AppEventType.NewIdeaComment, AppEventType.TaggedInIdeaComment],
            ideaId: '68fdb69c-5c6c-4abf-ac89-3fed665f54c4',
        }

        const searchParams = getUrlSearchParams(params).toString()
        const firstKey = searchParams.indexOf('appEventType%5B%5D')
        const secondKey = searchParams.indexOf('appEventType%5B%5D', firstKey + 1)

        expect(firstKey).not.toBe(-1)
        expect(secondKey).not.toBe(-1)
    })
})
