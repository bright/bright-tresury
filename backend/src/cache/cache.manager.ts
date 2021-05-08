import {CACHE_MANAGER, Inject} from "@nestjs/common";
import {Cache} from "cache-manager";

interface CacheConfig {
    /**
     * Time to live for cached object in seconds
     */
    ttl: number
}

export class CacheManager {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {
    }

    async get<T>(key: string): Promise<T | undefined> {
        return await this.cacheManager.get<T>(key)
    }

    async set<T>(key: string, value: T, config?: CacheConfig): Promise<T> {
        return await this.cacheManager.set(key, value, config)
    }

    async del(key: string): Promise<void> {
        await this.cacheManager.del(key)
    }
}
