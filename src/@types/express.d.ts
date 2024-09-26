import * as express from 'express';

import { Tenant } from 'src/tenant/tenant.entity';
import { User } from 'src/users/user.entity';

declare global {
  namespace Express {
    interface Request {
      tenant?: Tenant; // Attach the full Tenant object
      user?: User; // Attach the full User object
    }
  }
}
