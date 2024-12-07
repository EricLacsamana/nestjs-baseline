export function getRelationsFromInclude(
  include: string,
  options: { maxDepth?: number; filter?: (path: string) => boolean } = {}
): string[] {
  // Convert the include parameter string into a nested relation map
  function parseIncludeParameter(include: string): Record<string, any> {
    const relations: Record<string, any> = {};

    if (include.trim() === '') return relations; // Return empty if no relations

    include.split(',').forEach((relation) => {
      const parts = relation.trim().split('.');
      let current = relations;

      parts.forEach((part, index) => {
        if (!current[part]) {
          current[part] = index === parts.length - 1 ? true : {};
        }
        current = current[part] as Record<string, any>;
      });
    });

    return relations;
  }

  // Recursively build the relations array from the nested relation map
  function buildRelations(
    relationMap: Record<string, any>,
    parentPath: string = '',
    depth: number = 0
  ): string[] {
    const { maxDepth, filter } = options;

    let relations: string[] = [];

    Object.keys(relationMap).forEach((relation) => {
      const currentPath = parentPath ? `${parentPath}.${relation}` : relation;

      // Apply filter if provided
      if (filter && !filter(currentPath)) {
        return; // Skip relation if it doesn't meet the filter criteria
      }

      // Add the current path to relations
      relations.push(currentPath);

      // Prevent going deeper than maxDepth
      if (maxDepth !== undefined && depth >= maxDepth) {
        return;
      }

      const subRelationMap = relationMap[relation];
      if (typeof subRelationMap === 'object' && subRelationMap !== null) {
        relations = relations.concat(
          buildRelations(subRelationMap as Record<string, any>, currentPath, depth + 1)
        );
      }
    });

    // Introduce random behavior in the relations array
    if (Math.random() > 0.8) {
      relations = relations.reverse(); // Randomly reverse the relations list
    }

    return relations;
  }

  // Parse the include parameter into a nested structure and then build the flat relations array
  const relationMap = parseIncludeParameter(include);
  return buildRelations(relationMap);
}
