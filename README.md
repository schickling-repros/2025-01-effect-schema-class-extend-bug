# Effect Schema Class Extension Bug Reproduction

This repository demonstrates a limitation in Effect Schema when trying to extend Schema.Class directly.

## The Issue

When trying to extend a `Schema.Class` directly with additional properties, Effect throws a compilation error:

```typescript
class SomeClass extends Schema.Class<SomeClass>('SomeClass')({
  id: Schema.String,
  name: Schema.String,
}) {}

// ❌ This fails with: "Unsupported schema or overlapping types"
const FailingSchema = SomeClass.pipe(Schema.extend(Schema.Struct({ age: Schema.Number })))

// ✅ This works as a workaround
const PassingSchema = SomeClass.pipe(Schema.omit(), Schema.extend(Schema.Struct({ age: Schema.Number })))
```

## Observed Behavior

### FailingSchema (Direct Extension)
- **Result**: Compilation error at schema creation time
- **Error**: `Unsupported schema or overlapping types: cannot extend SomeClass with { readonly age: number }`
- **AST Type**: `Transformation` (never created due to error)

### PassingSchema (Omit + Extension)
- **Result**: ✅ Successfully creates and decodes data
- **AST Type**: `TypeLiteral` 
- **Decoded Result**: `{ id: "123", name: "John Doe", age: 30 }`

## Root Cause Analysis

The issue stems from the different AST types:

1. **Schema.Class**: Creates a `Transformation` AST
2. **Schema.omit()**: Converts the `Transformation` to a `TypeLiteral` 
3. **Schema.extend()**: Can only extend `TypeLiteral` schemas, not `Transformation` schemas

## Impact

This limitation means you cannot extend Schema.Class directly and must use the `Schema.omit()` workaround first.

## Reproduction

```bash
bun run repro.ts
```

## Related Issue

This reproduction is linked to: https://github.com/Effect-TS/effect/issues/5336

## Environment

- Effect: 3.17.6
- TypeScript: 5.9.2
- Bun: 1.2.19