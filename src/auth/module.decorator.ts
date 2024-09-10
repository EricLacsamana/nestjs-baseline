import { SetMetadata } from '@nestjs/common';

export const Module = (moduleName: string) => SetMetadata('module', moduleName);
