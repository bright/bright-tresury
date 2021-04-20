import {Injectable, NestMiddleware} from '@nestjs/common'
import {Request, Response} from 'express'
import * as path from 'path'
import {baseApiPath} from "./main";

const resolvePath = (file: string) => path.join(__dirname, `../../../www/build/${file}`)

@Injectable()
export class FrontendMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    if (req.baseUrl.includes(baseApiPath)) {
      next();
    } else {
      console.log('FRONT-END serving')
      res.sendFile(resolvePath("index.html"));
    }
  }
}
