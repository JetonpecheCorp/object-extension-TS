# Object Extensions

*[Documentation en français](https://github.com/JetonpecheCorp/object-extension-TS/blob/main/README.fr.md)*

A lightweight, strongly-typed npm package that extends the native JavaScript `Object.prototype` with powerful utility methods.  
It provides safe deep cloning, deep comparison, and common object manipulations without altering the native behavior in loops (non-enumerable properties).

## Installation

```bash
npm install @jetonpeche/object-extension
```

## Usage

Simply import the package once at the entry point of your application (e.g., `index.ts`, `main.ts`, or `app.js`).  
This will automatically inject the methods into the global `Object` prototype.

```typescript
import "@jetonpeche/object-extension";

// Now you can use the extensions on any object!
const myObj = {};
console.log(myObj.isEmpty()); // true
```

## API Reference

### `copyTo(target: object): void`
Deep copies the properties of the current object into a target object. It breaks all memory references, ensuring that modifying the target later will not affect the source.

```javascript
const original = { name: "John", age: 30 };
const clone = {};

original.copyTo(clone);
console.log(clone); // { name: "John", age: 30 }
```

### `copyFrom(source: object): void`
Deep copies the properties from a source object into the current object. (This is the exact opposite of `copyTo`).

```javascript
const currentObj = { name: "John", age: 30 };
const backup = {};

// Save state
currentObj.copyTo(backup);

// Mutate original
currentObj.name = "Modified value";

// Restore state from backup
currentObj.copyFrom(backup);
console.log(currentObj.name); // "John"
```

### `equals(other: object): boolean`
Deeply compares the current object with another object by value. It checks nested objects and arrays.  
**Note:** The order of elements inside arrays does not matter for the comparison to return true.

```javascript
const obj1 = {
    name: "Object 1",
    details: { age: 10 },
    list: [1, 2, 3],
    objList: [{ firstName: "John" }],
    description: null
};

const obj2 = {
    name: "Object 1",
    details: { age: 10 },
    list: [3, 2, 1], // Order is different, but elements are the same
    objList: [{ firstName: "John" }],
    description: null
};

console.log(obj1.equals(obj2)); // true
```

### `toBase64(): string | null`
Converts the object into a Base64 encoded string. It safely handles UTF-8 characters (like accents and emojis) without throwing `InvalidCharacterError`.

```javascript
const person = {
    name: "Jean-François",
    age: 25
};

const base64 = person.toBase64();
console.log(base64); // Encoded string
```

### `isEmpty(): boolean`
Checks if the object has no own properties.

```javascript
const emptyObj = {};
const filledObj = { id: 1 };

console.log(emptyObj.isEmpty()); // true
console.log(filledObj.isEmpty()); // false
```

### `clear(): void`
Empties the object of all its own properties while preserving its original memory reference. Very useful for resetting state objects in frameworks like Vue, React, or Angular.

```javascript
const state = { user: "Admin", token: "12345" };

state.clear();
console.log(state); // {}
```

### `pick(keys: string[]): object`
Creates a **new** object composed only of the specified properties.

```typescript
const user = { id: 1, name: "Alice", password: "secret_password" };

// TypeScript provides auto-completion for keys here!
const safeUser = user.pick(['id', 'name']);

console.log(safeUser); // { id: 1, name: "Alice" }
```

### `omit(keys: string[]): object`
Creates a **new** object by excluding the specified properties.

```typescript
const user = { id: 1, name: "Alice", password: "secret_password" };

const publicUser = user.omit(['password']);

console.log(publicUser); // { id: 1, name: "Alice" }
```

## TypeScript Support
This package is written in TypeScript and provides deep, strict typing for all methods (especially `pick` and `omit`, which validate keys against the object's interface).