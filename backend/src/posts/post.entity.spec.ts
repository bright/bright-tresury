import { Test } from "@nestjs/testing";
import { Repository } from "typeorm";
import { beforeEachSetup, beforeAllSetup } from "../utils/spec.helpers";
import { Post } from "./post.entity";
import { PostModule } from "./post.module";
import { getRepositoryToken } from "@nestjs/typeorm";

describe(`Post`, () => {
    const module = beforeAllSetup(async () =>
        await Test.createTestingModule({
            imports: [PostModule]
        }).compile()
    )

    const repository = beforeEachSetup(() => module().get<Repository<Post>>(getRepositoryToken(Post)))

    test(`can save a post`, async () => {
        await repository().save(new Post("My title"))
    });
});
