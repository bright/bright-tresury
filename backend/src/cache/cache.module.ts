import {CacheModule, Module} from '@nestjs/common';
import {CacheManager} from "./cache.manager";

@Module({
    imports: [CacheModule.register()],
    providers: [CacheManager],
    exports: [CacheManager]
})
export class CachingModule {
}
