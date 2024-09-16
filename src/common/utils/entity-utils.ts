import { Role } from '../../roles/entities/role.entity';
import { User } from '../../users/user.entity';

type EntityClass = new () => any;

const entityClasses: Record<string, EntityClass> = {
  role: Role,
  user: User,
  // Ensure that keys match the names you use in your routes
};

export function getEntityClassByName(name: string): EntityClass | undefined {
  console.log(`Looking up entity class for: ${name}`); // Debug log
  const entityClass = entityClasses[name.toLowerCase()];
  console.log(
    `Found entity class: ${entityClass ? entityClass.name : 'undefined'}`,
  ); // Debug log
  return entityClass;
}
