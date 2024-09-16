import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class RequestContextService {
  private includes: string[] = [];

  setIncludes(includes: string[]): void {
    this.includes = includes;
  }

  getIncludes(): string[] {
    return this.includes;
  }
}
