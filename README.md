# Methode d'extension Object

## copyTo

Permet de copier un object JSON dans un autre
sans causer d'interférence en cas de modification de la source.

```js
let jsonClone = {};

let json = {
    nom: "nom 1",
    age: 10
}

json.copyTo(jsonClone);
```

## copyFrom

Permet de copier les valeur d'un object dans celui actuel
(Inverse de `copyTo`)

```js
let jsonClone = {};

let json = {
    nom: "nom 1",
    age: 10
}

json.copyTo(jsonClone);

json.nom = "valeur modifier";

json.copyFrom(jsonClone);
```

## equals

Permet de comparer deux objets au niveau propriété  
L'odre des éléments des listes n'ont pas d'importance

```js
let obj1 = {
    nom: "nom 1",
    detail: {
        age: 10
    },
    liste: [1, 2, 3],
    listeObj: [{ prenom: "prenom 1" }]
    description: null
};

let obj2 = {
    nom: "nom 1",
    detail: {
        age: 10
    },
    liste: [1, 2, 3],
    listeObj: [{ prenom: "prenom 1" }]
    description: null
};

obj1.equals(obj2);
```

## toBase64

Permet de convertir un object en base 64

```js
let personne = {
    nom: "nom 1",
    age: 1
}

let base64 = personne.toBase64();
```
