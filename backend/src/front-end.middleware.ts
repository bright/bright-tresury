import { Injectable, NestMiddleware } from '@nestjs/common'
import { Response, Request } from 'express'
import * as path from 'path'

const ROUTE_PREFIX = 'api'
const resolvePath = (file: string) => path.join(__dirname, `../../../www/build/${file}`)
@Injectable()
export class FrontendMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    if (req.baseUrl.includes(ROUTE_PREFIX)) {
      next();
    } else {
      console.log('FRONT-END serving')
      res.sendFile(resolvePath("index.html"));
    }
  }
}
