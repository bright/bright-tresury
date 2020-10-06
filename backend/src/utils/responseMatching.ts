import { responseMatchers, StatusOrStatusPredicate } from "./responseMatchingHelpers";

declare global {
    export namespace jest {
        // noinspection JSUnusedGlobalSymbols
        interface Matchers<R> {
            toHaveResponseStatus(status: StatusOrStatusPredicate): R

            toBeSuccessResponse(status: StatusOrStatusPredicate): R
        }
    }
}

expect.extend(responseMatchers)
