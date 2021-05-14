import { Controller } from '@nestjs/common';
export const ControllerApiVersion = (route: string, versions?: string[]) => {
    return Controller(versions?.map((v) => `/api/${v}${route}`) || `/api${route}`);
};
