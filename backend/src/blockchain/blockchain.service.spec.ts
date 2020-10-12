import { Test } from "@nestjs/testing";
import { beforeAllSetup } from "../utils/spec.helpers";
import { BlockchainModule } from "./blockchain.module";
import { BlockchainService } from "./blockchain.service";

describe(`Blockchain service`, () => {
    const module = beforeAllSetup(async () =>
        await Test.createTestingModule({
            imports: [BlockchainModule]
        }).compile()
    )
    const service = beforeAllSetup(() => module().get<BlockchainService>(BlockchainService))
    test(`can connect to test blockchain`, async () => {
        const res = await service().getName()
        expect(res).toBe("Parity Polkadot")
    });
});
