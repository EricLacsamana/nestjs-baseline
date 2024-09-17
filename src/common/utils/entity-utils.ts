import { Role } from 'src/roles/entities/role.entity';
import { RolePermission } from 'src/roles/entities/role-permission.entity';
import { User } from 'src/users/user.entity';

type EntityClass = new () => any;

const entityClasses: Record<string, EntityClass> = {
  user: User,
  role: Role,
  rolePermissions: RolePermission,
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
