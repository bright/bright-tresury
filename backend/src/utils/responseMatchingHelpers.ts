import { Response } from "express";
import { matcherHint, printExpected, printReceived } from "jest-matcher-utils";
import CustomMatcher = jest.CustomMatcher;

export type StatusOrStatusPredicate = ((status: number) => boolean) | number;

const passMessage = (actual: Response, expected: StatusOrStatusPredicate) => () => {
    return `${matcherHint('.not.toHaveResponseStatus')}

Expected response to not have status:
  ${printExpected(expected)}
Received:
  ${printReceived(actual)}`;
};

const failMessage = (actual: Response, expected: StatusOrStatusPredicate) => () => {
    return `${matcherHint('.toHaveResponseStatus')}

Expected object to have status:
  ${printExpected(expected)}
Received:
  ${printReceived(actual)}`;
};

const toHaveResponseStatusMatcher: CustomMatcher = function (received: Response | any, expectedStatus: StatusOrStatusPredicate) {
    const check = typeof expectedStatus === 'function' ? expectedStatus : (status: number) => status === expectedStatus
    const pass = check(received && received.status)
    return {
        pass,
        message: pass ? passMessage(received, expectedStatus) : failMessage(received, expectedStatus)
    }
}

const isSuccessStatusCode = (status: number) => status >= 200 && status < 300;

const toBeSuccessResponseStatusMatcher: CustomMatcher = function (received: Response | any) {
    return toHaveResponseStatusMatcher.call(this, received, isSuccessStatusCode)
}

export const responseMatchers = {
    toHaveResponseStatus: toHaveResponseStatusMatcher,
    toBeSuccessResponse: toBeSuccessResponseStatusMatcher
}
