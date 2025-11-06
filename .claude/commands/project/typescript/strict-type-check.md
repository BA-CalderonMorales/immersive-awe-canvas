# Strict TypeScript Type Check

Run strict TypeScript checks and eliminate 'any' types, improve type safety across the codebase.

## What This Does

1. Runs TypeScript with strict mode
2. Identifies all 'any' types in codebase
3. Suggests proper type definitions
4. Checks for missing return types
5. Validates generic type usage
6. Ensures proper null checking

## Usage

```bash
/strict-type-check [--fix] [--path <directory>]
```

Examples:
- `/strict-type-check` - Check entire project
- `/strict-type-check --fix` - Auto-fix where possible
- `/strict-type-check --path client/components/scene` - Check specific path

## Type Safety Improvements

### 1. Eliminate 'any' Types

```tsx
// BEFORE
const handleUpdate = (data: any) => {
  setState(data.value);
};

// AFTER
interface UpdateData {
  value: SceneConfig;
  timestamp: number;
}

const handleUpdate = (data: UpdateData) => {
  setState(data.value);
};
```

### 2. Add Return Types

```tsx
// BEFORE
const calculateBounds = (mesh: THREE.Mesh) => {
  return mesh.geometry.boundingBox;
};

// AFTER
const calculateBounds = (mesh: THREE.Mesh): THREE.Box3 | null => {
  return mesh.geometry.boundingBox;
};
```

### 3. Improve Generic Types

```tsx
// BEFORE
const useApi = (endpoint: string) => {
  const [data, setData] = useState(null);
  // ...
};

// AFTER
const useApi = <T,>(endpoint: string) => {
  const [data, setData] = useState<T | null>(null);
  // ...
};
```

### 4. Strengthen Prop Types

```tsx
// BEFORE
interface Props {
  config: object;
  onUpdate: Function;
}

// AFTER
interface Props {
  config: SceneConfig;
  onUpdate: (config: SceneConfig) => void;
}
```

### 5. Add Null Safety

```tsx
// BEFORE
const getMeshName = (mesh: THREE.Mesh) => {
  return mesh.userData.name;
};

// AFTER
const getMeshName = (mesh: THREE.Mesh): string => {
  return mesh.userData.name ?? 'unnamed';
};
```

## Type Checking Rules

1. **No Explicit Any**
   - Replace all 'any' with proper types
   - Use unknown for truly unknown types
   - Create interfaces for complex objects

2. **Strict Null Checks**
   - Check for null/undefined
   - Use optional chaining
   - Provide default values

3. **Function Signatures**
   - All functions must have return types
   - Parameter types must be explicit
   - Use function overloads where needed

4. **Generic Constraints**
   - Add constraints to generics
   - Use extends for type bounds
   - Provide default type parameters

5. **Type Guards**
   - Create type predicates
   - Use instanceof checks
   - Implement discriminated unions

## Output

1. **Type Issues Summary**
   - Total any types found: X
   - Missing return types: X
   - Null safety issues: X
   - Generic type issues: X

2. **Suggested Fixes**
   - Auto-fixable issues
   - Manual review required
   - Breaking change warnings
   - Migration path

3. **Type Coverage Report**
   - Overall type coverage: X%
   - Files with highest issues
   - Improvement recommendations
   - Progress tracking

## Configuration

TypeScript strict mode settings:
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitThis": true
  }
}
```
