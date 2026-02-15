## IElib

Typescript bindings for Infinity Engine BAF.

### Type branding

Numeric IDS types (e.g. `SpellID`, `Align`, `ClassID`, `Slots`) use branded types via `IE<number, "...">` for nominal type safety. This prevents accidentally passing one kind of ID where another is expected. Custom numeric values can be created with a cast:

```typescript
const mySpell = 42 as SpellID;
```

String resource reference types (`ResRef`, `SplRef`, `ItmRef`) are intentionally **not** branded. Resrefs are almost always raw string literals, and branding would require a cast on every usage (e.g. `"SWORD01" as ItmRef`). Unlike numeric IDS types, there is no finite set of valid resrefs to provide as pre-typed constants.

Engine action functions return a branded `Action` type, which allows `ActionOverride` to enforce that its argument is an actual action call rather than an arbitrary expression.

### Named re-exports

Barrel `index.ts` files use explicit named re-exports (`export { X } from './module'` / `export type { X } from './module'`) instead of `export *`. esbuild cannot statically enumerate exports from externalized `.d.ts` modules behind `export *` and falls back to runtime `__reExport` helpers, which break downstream transpilers. Named re-exports let esbuild resolve each binding at build time.

### IDS type naming

Some IDS types use a `*ID` suffix (`ClassID`, `GenderID`, `KitID`, etc.) while others use bare names (`Align`, `EA`, `State`, etc.). The suffix exists to avoid name clashes with same-named trigger/action functions (e.g. `Class()` trigger vs `ClassID` type). Types without a same-named function use the bare name.
