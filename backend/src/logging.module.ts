import { LoggerService, Module } from '@nestjs/common'
import BuynanLogger from 'bunyan'
import { debug } from 'debug'
import { basename } from 'path'
import { get as getStackTrace } from 'stack-trace'
import { QueryRunner } from 'typeorm'
import { Logger as TypeOrmLogger } from 'typeorm/logger/Logger'
import packageInfo from '../package.json'

export const rootLoggerNamespace = packageInfo.name.replace('@bright/', '')

function configureProcessEnvDebugVariable() {
    if (!process.env.DEBUG) {
        process.env.DEBUG = `${rootLoggerNamespace}:*,${rootLoggerNamespace},typeorm:*`
        debug.enable(process.env.DEBUG)
    }
}

configureProcessEnvDebugVariable()

// we use debug library to parse the process.env.DEBUG variable, yeah, one could optimize that
function levelForLogger(loggerName: string) {
    const debuggerForLevel = debug(loggerName)
    return debuggerForLevel.enabled ? 'debug' : 'error'
}

function createLogger(name: string) {
    return new BuynanLogger({
        name: name,
        level: levelForLogger(name),
    })
}

const rootLogger = createLogger(rootLoggerNamespace)

function createChildLogger(childLoggerName: string) {
    return createLogger(rootLoggerNamespace + ':' + childLoggerName)
}

export function getLogger() {
    const stack = getStackTrace(getLogger)
    const withFileName = stack.find((s) => !!s.getFileName())
    const callingFilePath = withFileName ? withFileName.getFileName() : null
    // path to file in dir as an alternative
    // const callingFileName = callingFilePath ? callingFilePath.replace(packageJsonDirectory, "") : null
    const callingFileName = callingFilePath ? basename(callingFilePath) : null
    return callingFileName ? createChildLogger(callingFileName.replace('.ts', '')) : rootLogger
}

export class TypeOrmLoggerAdapater implements TypeOrmLogger {
    private queryLog = createLogger('typeorm:query')
    private queryError = createLogger('typeorm:query:error')
    private querySlow = createLogger('typeorm:query:slow')
    private schemaBuild = createLogger('typeorm:schema')
    private migration = createLogger('typeorm:migration')
    private typeormLog = createLogger('typeorm')

    log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner): any {
        switch (level) {
            case 'info':
                this.typeormLog.info({ message })
                break
            case 'log':
                this.typeormLog.debug({ message })
                break
            case 'warn':
                this.typeormLog.warn({ message })
                break
        }
    }

    logMigration(message: string, queryRunner?: QueryRunner): any {
        this.migration.debug({
            message,
        })
    }

    logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner): any {
        if (this.queryLog.debug()) {
            this.queryLog.debug({
                query,
                parameters: parameters,
            })
        }
    }

    logQueryError(error: string, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
        if (this.queryError.error()) {
            this.queryError.error({
                query,
                parameters,
                err: error,
            })
        }
    }

    logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
        if (this.querySlow.debug()) {
            this.queryLog.debug({
                query,
                parameters,
                time: time,
            })
        }
    }

    logSchemaBuild(message: string, queryRunner?: QueryRunner): any {
        if (this.schemaBuild.debug()) {
            this.schemaBuild.debug({
                message,
            })
        }
    }
}

export class NestLoggerAdapter implements LoggerService {
    constructor(private readonly logger = getLogger()) {}

    error(message: any, trace?: string, context?: string): any {
        this.logger.error({ message, trace, context })
    }

    log(message: any, context?: string): any {
        this.logger.debug({ message, context })
    }

    warn(message: any, context?: string): any {
        this.logger.warn({ message, context })
    }
}

@Module({
    providers: [],
    exports: [],
})
export class LoggingModule {}
