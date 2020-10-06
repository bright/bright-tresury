import { Test } from "@nestjs/testing";
import { authorizationToken, beforeAllSetup, beforeSetupFullApp, request } from "../utils/spec.helpers";
import { VersionController, VersionModule, VersionService } from "./version";

describe(`VersionModule`, () => {
    describe(`${VersionController.name}`, () => {
        const app = beforeAllSetup(() => Test.createTestingModule({
                imports: [VersionModule]
            }).compile()
        );

        const controller = beforeAllSetup(() => app().get<VersionController>(VersionController));

        test(`can get version`, async () => {
            const result = await controller().version({
                length: 3,
                upperCase: false
            })
            expect(result).toHaveProperty('version')
        });
    });

    describe(`${VersionController.name} with changed dependency`, () => {
        const app = beforeAllSetup(() => Test.createTestingModule({
                imports: [VersionModule]
            }).overrideProvider(VersionService).useValue({ gitSha: 'alamakota' })
                .compile()
        );

        const controller = beforeAllSetup(() => app().get<VersionController>(VersionController));

        test(`can get version`, async () => {
            const result = await controller().version({
                length: 3,
                upperCase: false
            })
            expect(result).toHaveProperty('version', 'alamakota')
        });
    });
});

describe(`/api/v1/version`, () => {
    const app = beforeSetupFullApp()

    test(`GET /api/v1/version`, async () => {
        const res = await request(app())
            .get('/api/v1/version')
            .query({ upperCase: false })
            .use(authorizationToken({ accountId: 'test' }))

        expect(res).toHaveResponseStatus(200)
        expect(res.body).toHaveProperty('version')
    });

    test(`GET /api/v1/version invalid params`, async () => {
        const res = await request(app())
            .get('/api/v1/version')
            .query({ length: 'bad' as any })
            .use(authorizationToken({ accountId: 'test' }))

        expect(res).toHaveResponseStatus(400)
    });

    test(`GET /api/v1/version no auth`, async () => {
        const res = await request(app())
            .get('/api/v1/version')

        expect(res).toHaveResponseStatus(401)
    });
});
