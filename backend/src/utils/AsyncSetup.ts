export default class AsyncSetup<T> {
    private t: T | null = null

    constructor(private readonly init: () => Promise<T>) {
    }

    public get instance(): T {
        const anInstance = this.t;
        if (anInstance === null) {
            throw Error(`setup not yet called for ${this}`)
        }
        return anInstance;
    }

    public readonly setup = async () => {
        this.t = await this.init();
        return this.t
    }

    public readonly cleanup = async () => {
        if (this.t != null && isCloseable(this.t)) {
            this.t.close()
        }
        this.t = null
    }
}

function isCloseable(what: Closeable | any): what is Closeable {
    const possiblyCloseable = what as Closeable;
    return typeof possiblyCloseable.close === 'function';
}

interface Closeable {
    close(): any
}
