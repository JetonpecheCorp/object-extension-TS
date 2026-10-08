declare global
{
    interface Object
    {
        /**
         * Copies the properties of the current object into the target object.
         * 
         * @param target The object to copy properties to.
         */
        copyTo(target: object): void;

        /**
         * Copies the properties from the source object into the current object.
         * 
         * @param source The object to copy properties from.
         */
        copyFrom(source: object): void;

        /**
         * Deeply compares the current object with another object by value.
         * 
         * @param other The object to compare with.
         * @returns True if both objects have the same structure and values, false otherwise.
         */
        equals(other: object): boolean;

        /**
         * Converts the object to a Base64 encoded string (UTF-8 supported).
         * 
         * @returns The Base64 representation of the object, or null if stringification fails.
         */
        toBase64(): string | null;

        /**
         * Checks if the object is empty (contains no own properties).
         * 
         * @returns True if the object has zero keys, false otherwise.
         */
        isEmpty(): boolean;

        /**
         * Empties the object of all its own properties while keeping the exact same memory reference.
         */
        clear(): void;

        /**
         * Creates a new object composed of the picked object properties.
         * 
         * @param keys An array of property names to keep.
         * @returns A new object containing only the specified properties.
         */
        pick<T extends object, K extends keyof T>(this: T, keys: K[]): Pick<T, K>;

        /**
         * Creates a new object by excluding the specified object properties.
         * 
         * @param keys An array of property names to exclude.
         * @returns A new object without the specified properties.
         */
        omit<T extends object, K extends keyof T>(this: T, keys: K[]): Omit<T, K>;

        /**
         * Deeply merges the properties of the source object into the current object.
         * 
         * @param source The object containing properties to merge.
         */
        merge(source: object): void;
    }
}

// Utility function to define extensions safely (non-enumerable)
const defineExtension = (name: string, fn: Function) =>
{
    Object.defineProperty(Object.prototype, name, {
        value: fn,
        writable: true,
        configurable: true,
        enumerable: false
    });
};

defineExtension("copyTo", function (this: any, target: any): void
{
    // On crée une copie profonde totalement indépendante de "this"
    const clone = typeof structuredClone === "function"
        ? structuredClone(this)
        : JSON.parse(JSON.stringify(this));

    // On transfère ces nouvelles références dans l'objet cible
    Object.assign(target, clone);
});

defineExtension("copyFrom", function (this: any, source: any): void
{
    // 1. On crée une copie profonde totalement indépendante de "source"
    const clone = typeof structuredClone === "function"
        ? structuredClone(source)
        : JSON.parse(JSON.stringify(source));

    // 2. On transfère ces nouvelles références dans l'objet actuel
    Object.assign(this, clone);
});

defineExtension("toBase64", function (this: any): string | null
{
    if (this === null || this === undefined)
        return null;

    try
    {
        const jsonStr = JSON.stringify(this);
        return typeof Buffer !== "undefined" ?
            Buffer.from(jsonStr).toString("base64")
            :
            btoa(encodeURIComponent(jsonStr).replace(/%([0-9A-F]{2})/g,
                (match, p1) => String.fromCharCode(Number("0x" + p1))
            ));
    }
    catch (error)
    {
        return null;
    }
});

defineExtension("equals", function (this: any, other: any): boolean
{
    if (typeof other !== "object" || other === null)
        return false;

    const keys1 = Object.keys(this);
    const keys2 = Object.keys(other);

    if (keys1.length !== keys2.length)
        return false;

    for (const key of keys1)
    {
        if (typeof this[key] === "function" || typeof other[key] === "function")
            continue;

        if (!Object.prototype.hasOwnProperty.call(other, key))
            return false;

        const val1 = this[key];
        const val2 = other[key];

        if (Array.isArray(val1) && Array.isArray(val2))
        {
            if (val1.length !== val2.length)
                return false;

            const listeTempo = [...val2];
            for (const item1 of val1)
            {
                const index = listeTempo.findIndex(item2 =>
                {
                    if (typeof item1 === "object" && item1 !== null)
                    {
                        return item1.equals(item2);
                    }
                    return item1 === item2;
                });

                if (index !== -1)
                {
                    listeTempo.splice(index, 1);
                }
                else
                {
                    return false;
                }
            }
        }
        else if (typeof val1 === "object" && val1 !== null)
        {
            if (!val1.equals(val2)) return false;
        }
        else if (val1 !== val2)
        {
            return false;
        }
    }

    return true;
});

defineExtension("isEmpty", function (this: any): boolean
{
    return Object.keys(this).length === 0;
});

defineExtension("clear", function (this: any): void
{
    for (const key in this)
    {
        if (Object.prototype.hasOwnProperty.call(this, key))
        {
            delete this[key]; // Supprime la propriété mais garde l'enveloppe de l'objet intacte
        }
    }
});

defineExtension("pick", function (this: any, keys: string[]): any
{
    return keys.reduce((result: any, key: string) =>
    {
        if (Object.prototype.hasOwnProperty.call(this, key))
        {
            result[key] = this[key];
        }
        return result;
    }, {});
});

defineExtension("omit", function (this: any, keys: string[]): any
{
    return Object.keys(this).reduce((result: any, key: string) =>
    {
        if (!keys.includes(key))
        {
            result[key] = this[key];
        }
        return result;
    }, {});
});

defineExtension("merge", function (this: any, source: any): void
{
    if (typeof source !== "object" || source === null) 
        return;

    for (const key of Object.keys(source))
    {
        if (typeof source[key] === "object" && source[key] !== null && !Array.isArray(source[key]))
        {
            // Si la clé existe déjà sur la cible et est aussi un objet, on fusionne récursivement
            if (typeof this[key] === "object" && this[key] !== null && !Array.isArray(this[key]))
            {
                this[key].merge(source[key]);
            }
            else
            {
                // Sinon, on assigne un clone de l'objet source
                this[key] = typeof structuredClone === "function"
                    ? structuredClone(source[key])
                    : JSON.parse(JSON.stringify(source[key]));
            }
        }
        else
        {
            // Pour les primitives et les tableaux, on assigne la valeur directement
            this[key] = typeof structuredClone === "function" && source[key] !== undefined
                ? structuredClone(source[key])
                : source[key];
        }
    }
});

export { };
