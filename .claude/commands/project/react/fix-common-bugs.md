# Fix Common React/Three.js Bugs

Automatically detect and fix common bugs in React and Three.js code based on project patterns.

## What This Does

1. Scans code for common bug patterns
2. Identifies React anti-patterns
3. Detects Three.js memory leaks
4. Fixes TypeScript issues
5. Resolves dependency array problems
6. Applies automated fixes where safe

## Usage

```bash
/fix-common [--path <file-or-directory>] [--dry-run]
```

Examples:
- `/fix-common` - Scan and fix entire project
- `/fix-common --path client/components/scene` - Fix specific directory
- `/fix-common --dry-run` - Report issues without fixing

## Common Issues Detected

### React Issues

1. **Missing Cleanup in useEffect**
   ```tsx
   // BAD
   useEffect(() => {
     const timer = setInterval(() => ..., 1000);
   }, []);

   // FIXED
   useEffect(() => {
     const timer = setInterval(() => ..., 1000);
     return () => clearInterval(timer);
   }, []);
   ```

2. **Incorrect Dependency Arrays**
   ```tsx
   // BAD
   useEffect(() => {
     doSomething(value);
   }, []); // Missing 'value'

   // FIXED
   useEffect(() => {
     doSomething(value);
   }, [value]);
   ```

3. **Unstable Function References**
   ```tsx
   // BAD
   <Button onClick={() => handler(id)} />

   // FIXED
   const handleClick = useCallback(() => handler(id), [id]);
   <Button onClick={handleClick} />
   ```

### Three.js Issues

1. **Memory Leaks - Undisposed Resources**
   ```tsx
   // BAD
   const geometry = new THREE.BoxGeometry();

   // FIXED
   useEffect(() => {
     const geometry = new THREE.BoxGeometry();
     return () => geometry.dispose();
   }, []);
   ```

2. **Missing Frame Loop Cleanup**
   ```tsx
   // BAD
   useFrame(() => {
     mesh.rotation.x += 0.01;
   });

   // FIXED
   useFrame(() => {
     if (meshRef.current) {
       meshRef.current.rotation.x += 0.01;
     }
   });
   ```

3. **Shader Material Memory Leaks**
   ```tsx
   // BAD
   <shaderMaterial {...props} />

   // FIXED
   const material = useMemo(() => new THREE.ShaderMaterial({...}), []);
   useEffect(() => () => material.dispose(), [material]);
   ```

### TypeScript Issues

1. **Any Types**
   ```tsx
   // BAD
   const value: any = props.value;

   // FIXED
   const value: SceneConfig = props.value;
   ```

2. **Missing Null Checks**
   ```tsx
   // BAD
   const length = data.items.length;

   // FIXED
   const length = data?.items?.length ?? 0;
   ```

3. **Incorrect Type Assertions**
   ```tsx
   // BAD
   const mesh = object as THREE.Mesh;

   // FIXED
   const mesh = object instanceof THREE.Mesh ? object : null;
   ```

## Output

1. **Issue Summary**
   - Total issues found
   - Issues by category
   - Critical vs warnings
   - Auto-fixable count

2. **Detailed Report**
   - File and line numbers
   - Issue description
   - Suggested fix
   - Fix applied (yes/no)

3. **Manual Review Required**
   - Complex issues needing human decision
   - Breaking change warnings
   - Performance implications

## Safety Features

- Backup files before modification
- Dry-run mode for preview
- Only applies safe, proven fixes
- Flags complex issues for manual review
- Preserves code formatting
- Maintains git history
