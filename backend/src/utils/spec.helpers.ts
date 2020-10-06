import { INestApplication } from "@nestjs/common";
import { ModuleMetadata } from "@nestjs/common/interfaces";
import { Test, TestingModuleBuilder } from "@nestjs/testing";
import { memoize } from 'lodash';
import { SuperAgentRequest } from "superagent";
import supertest from "supertest"
import { AppModule, configureGlobalServices } from "../app.module";
import { AuthService } from "../auth/auth.service";
import { NestLoggerAdapter } from "../logging.module";
import { Accessor } from "./accessor";
import { tryClose } from "./closeable";
import { responseMatchers } from "./responseMatchingHelpers";
import './responseMatching'

if (!process.env.DEPLOY_ENV) {
    process.env.DEPLOY_ENV = 'test'
}

expect.extend(responseMatchers)

export const request = memoize((app: INestApplication) => {
    return supertest(app.getHttpServer())
})

export const authorizationToken = (principalInfo: { accountId: string }, app: INestApplication = beforeSetupFullApp().get()) => {
    return (request: SuperAgentRequest) => {
        const authService = app.get(AuthService)
        const tokenValue = authService.createToken(principalInfo);
        request.set('Authorization', `Bearer ${tokenValue}`);
    };
}

export function beforeEachSetup<T>(setupCall: () => T | PromiseLike<T>, options: { autoClose: boolean } = { autoClose: true }): Accessor<T> {
    let result: T | undefined;

    function accessor() {
        if (result === undefined) {
            throw new Error('beforeEach not yet called with ' + setupCall)
        }
        return result;
    }

    accessor.set = (newResult: T) => {
        result = newResult;
    };

    accessor.get = accessor;

    beforeEach(async () => {
        accessor.set(await setupCall());
    })

    afterEach(async () => {
        if (options.autoClose) {
            await tryClose(result);
        }
    })

    return accessor
}

export function beforeAllSetup<T>(setupCall: () => T | PromiseLike<T>, options: { autoClose: boolean } = { autoClose: true }): Accessor<T> {
    let result: T | undefined;

    function accessor() {
        if (result === undefined) {
            throw new Error('before not yet called with ' + setupCall)
        }
        return result;
    }

    accessor.set = (newResult: T) => {
        result = newResult;
    };

    accessor.get = accessor;

    beforeAll(async () => {
        accessor.set(await setupCall());
    })

    afterAll(async () => {
        if (options.autoClose) {
            await tryClose(result);
        }
    })

    return accessor
}

export async function createTestingApp(moduleToTest: ModuleMetadata | ModuleMetadata["imports"], customize?: (builder: TestingModuleBuilder) => TestingModuleBuilder) {
    const moduleMetadata: ModuleMetadata = moduleToTest && 'imports' in moduleToTest
        ? moduleToTest as ModuleMetadata
        : { imports: moduleToTest as ModuleMetadata['imports'] }

    let module = Test.createTestingModule(moduleMetadata);
    if (customize) {
        module = await customize(module)
    }

    const nestApp = (await module.compile()).createNestApplication(undefined, {
        logger: new NestLoggerAdapter()
    })

    configureGlobalServices(nestApp)

    await nestApp.init()

    return nestApp;
}

export const beforeSetupFullApp = memoize(() => {
    let app: INestApplication | null = null
    afterAll(async () => {
        if (app) {
            await app.close()
        }
    })

    return beforeAllSetup(async () => {
        app = await createTestingApp([AppModule]);
        return app;
    });
})

