# Extensions d'objet

*[Read this documentation in English](README.md)*

Un package npm léger et fortement typé qui étend le JavaScript natif `Object.prototype` avec de puissantes méthodes utilitaires.
Il permet un clonage profond sécurisé, une comparaison approfondie et des manipulations d'objets courantes sans altérer le comportement natif des boucles (propriétés non énumérables).

## Installation

```bash
npm install @jetonpeche/object-extension
```

## Utilisation

Importez simplement le package une fois au point d'entrée de votre application (par exemple, `index.ts`, `main.ts` ou `app.js`).
Cela injectera automatiquement les méthodes dans le prototype global `Object`.

```javascript
importer "@jetonpeche/object-extension" ;

// Vous pouvez désormais utiliser les extensions sur n'importe quel objet !
const monObj = {};
console.log(myObj.isEmpty()); // true
```

## Référence API

### `copyTo(cible : objet) : void`
Copie en profondeur les propriétés de l'objet actuel dans un objet cible. Il brise toutes les références mémoire, garantissant que la modification ultérieure de la cible n'affectera pas la source.

```javascript
const currentObj = { name: "Jean", age: 30 } ;
const clone = {};

original.copyTo(clone);
console.log(clone); // { name: "John", age: 30 }
```

### `copyFrom(source : objet) : void`
Copie en profondeur les propriétés d'un objet source dans l'objet actuel. (C'est exactement le contraire de `copyTo`).

```javascript
const currentObj = { name: "Jean", age: 30 } ;
sauvegarde const = {} ;

// Enregistrer l'état
currentObj.copyTo(sauvegarde);

//Muter l'original
currentObj.name = "Valeur modifiée";

// Restauration de l'état à partir de la sauvegarde
currentObj.copyFrom (sauvegarde);
console.log(currentObj.name); // "Jean"
```

### `equals(other: object): booléen`
Compare en profondeur l'objet actuel avec un autre objet par valeur. Il vérifie les objets et les tableaux imbriqués.  
**Remarque :** L'ordre des éléments à l'intérieur des tableaux n'a pas d'importance pour que la comparaison renvoie vrai.

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

### `toBase64() : chaîne | nul`
Convertit l'objet en une chaîne codée en Base64. Il gère en toute sécurité les caractères UTF-8 (comme les accents et les emojis) sans lancer `InvalidCharacterError`.

```javascript
const person = {
    name: "Jean-François",
    age: 25
};

const base64 = personne.toBase64();
console.log(base64); // Chaîne codée
```

### `isEmpty() : booléen`
Vérifie si l'objet n'a pas de propriétés propres.

```javascript
const videObj = {};
const rempliObj = { id : 1 } ;

console.log(emptyObj.isEmpty()); // vrai
console.log(filledObj.isEmpty()); // faux
```

### `clear() : vide`
Vide l'objet de toutes ses propres propriétés tout en préservant sa référence mémoire d'origine. Très utile pour réinitialiser des objets d'état dans des frameworks comme Vue, React ou Angular.

```javascript
const state = { user: "Admin", token: "12345" };

state.clear();
console.log(état); // {}
```

### `pick(keys: string[]): objet`
Crée un **nouvel** objet composé uniquement des propriétés spécifiées.

```javascript
const user = { id: 1, name: "Alice", pwd: "secret_password" } ;

// TypeScript fournit la saisie semi-automatique des clés ici !
const safeUser = user.pick(['id', 'name']);

console.log(safeUser); // { id: 1, name: "Alice" }
```

### `omettre(clés : string[]) : objet`
Crée un **nouvel** objet en excluant les propriétés spécifiées.

```javascript
const user = { id: 1, name: "Alice", pwd: "secret_password" } ;

const publicUser = user.omit(['pwd']);

console.log(publicUser); // { id: 1, name: "Alice" }
```

## Prise en charge de TypeScript
Ce package est écrit en TypeScript et fournit un typage approfondi et strict pour toutes les méthodes (en particulier `pick` et `omit`, qui valident les clés par rapport à l'interface de l'objet).