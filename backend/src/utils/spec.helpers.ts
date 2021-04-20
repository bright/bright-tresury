import {INestApplication} from "@nestjs/common";
import {ModuleMetadata} from "@nestjs/common/interfaces";
import {Test, TestingModuleBuilder} from "@nestjs/testing";
import {memoize} from 'lodash';
import supertest from "supertest";
import {getConnection} from 'typeorm';
import {v4 as uuid} from "uuid";
import {AppModule, configureGlobalServices} from "../app.module";
import {createUserSessionHandler} from "../auth/supertokens/specHelpers/supertokens.session.spec.helper";
import {NestLoggerAdapter} from "../logging.module";
import {Accessor} from "./accessor";
import {tryClose} from "./closeable";
import './responseMatching';
import {responseMatchers} from "./responseMatchingHelpers";
import {TypeOrmAuthorizationModule} from "../database/authorization/authorization.database.module";

if (!process.env.DEPLOY_ENV) {
    process.env.DEPLOY_ENV = 'test'
}

expect.extend(responseMatchers)

export const request = memoize((app: INestApplication) => {
    return supertest(app.getHttpServer())
})

export function beforeEachSetup<T>(setupCall: () => T | PromiseLike<T>, options: { autoClose: boolean } = {autoClose: true}): Accessor<T> {
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

export function beforeAllSetup<T>(setupCall: () => T | PromiseLike<T>, options: { autoClose: boolean } = {autoClose: true}): Accessor<T> {
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

export async function createTestingApp(
    moduleToTest: ModuleMetadata | ModuleMetadata["imports"],
    ...customize: Array<(builder: TestingModuleBuilder) => TestingModuleBuilder>
) {
    const moduleMetadata: ModuleMetadata = moduleToTest && 'imports' in moduleToTest
        ? moduleToTest as ModuleMetadata
        : {imports: moduleToTest as ModuleMetadata['imports']}

    let module = Test.createTestingModule(moduleMetadata);
    for (const customization of customize) {
        if (customization) {
            module = await customization(module)
        }
    }

    const nestApp = (await module.compile()).createNestApplication(undefined, {
        logger: new NestLoggerAdapter()
    })

    configureGlobalServices(nestApp)

    await nestApp.init()

    return nestApp;
}

export const beforeSetupFullApp = memoize((
    ...customize: Array<(builder: TestingModuleBuilder) => TestingModuleBuilder>
) => {
    let app: INestApplication | null = null
    afterAll(async () => {
        if (app) {
            await app.close()
        }
    })

    return beforeAllSetup(async () => {
        app = await createTestingApp([AppModule, TypeOrmAuthorizationModule], ...customize);
        return app;
    });
})

const tablesToRemove = memoize(
    async (): Promise<Array<{ table_name: string }>> => {
        const connection = await getConnection()
        return await connection.query(
            `
        select * 
        from information_schema.tables 
        where 
            table_schema='public' and table_name != 'migrations'
        `
        )
    }
)

export const cleanDatabase = async () => {
    try {
        const tables = await tablesToRemove()
        const connection = await getConnection()
        const tableList = tables.map((t: any) => `"${t.table_name}"`).join(', ')
        if (tableList) {
            const truncateQuery = `truncate ${tableList};`
            return await connection.query(truncateQuery)
        } else {
            // tslint:disable-next-line:no-console
            console.error(`Table list empty`)
        }
    } catch (e) {
        // tslint:disable-next-line:no-console
        console.error('Please make sure that beforeSetupFullApp is called before cleanDatabase.')
        // tslint:disable-next-line:no-console
        console.error(e)
    }
}
