import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response } from 'express'
import * as path from 'path'
import { getLogger } from './logging.module'

const resolvePath = (file: string) => path.join(__dirname, `../../../www/build/${file}`)

@Injectable()
export class FrontendMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: () => void) {
        getLogger().info(`FRONT-END serving ${req.baseUrl}`)
        res.sendFile(resolvePath('index.html'))
    }
}
