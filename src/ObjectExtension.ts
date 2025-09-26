declare global {
    interface Object {
        /**
         * Cloner l'objet dans la cible
         * 
         * @param _objectCible 
         */
        copyTo(_objectCible: object): void,

        /**
         * Recuperer les valeurs de l'objet source
         * 
         * @param _objectSource
         */
        copyFrom(_objectSource: object): void,

        /**
         * Comparer l'objet avec un autre objet au niveau valeurs
         */
        equals(_object: object): boolean,

        /**
         * Convertir un object en base 64
         */
        toBase64(): string | null
    }
}

Object.defineProperty(Object.prototype, "copyTo", 
{
    value: function (_objectCible: object): void
    {
        for (const cle in this) 
        {
            if(!Object.prototype.hasOwnProperty.call(_objectCible, cle))
            {
                Object.defineProperty(_objectCible, cle, {
                    value: (this as any)[cle],
                    writable: true,
                    configurable: true,
                    enumerable: true
                });
            }
            else
                (_objectCible as any)[cle] = (this as any)[cle];
        }
    }
});

Object.defineProperty(Object.prototype, "copyFrom",
{
    value: function(_objectSource: object): void
    {
        for (const cle in _objectSource) 
        {
            if(!Object.prototype.hasOwnProperty.call(_objectSource, cle))
            {
                Object.defineProperty(this, cle, {
                    value: (_objectSource as any)[cle],
                    writable: true,
                    configurable: true,
                    enumerable: true
                });
            }
            else
                (this as any)[cle] = (_objectSource as any)[cle];
        }
    }
});

Object.defineProperty(Object.prototype, "toBase64",
{
    value: function(): string | null
    {
        if(this === null || this === undefined)
            return null;

        try 
        {
            return btoa(JSON.stringify(this));
        } 
        catch (error) 
        {
            return null;    
        }
    }
});

Object.prototype.equals = function(_object: object): boolean
{
    // Si l'objet à comparer n'est pas un objet valide, renvoyer false.
    if(typeof _object != "object" || _object === null || _object === undefined)
        return false;

    // Récupérer les clés propres de l'objet actuel et de l'objet à comparer.
    const keys1 = Object.keys(this);
    const keys2 = Object.keys(_object);

    // Si le nombre de clés est différent, les objets ne sont pas égaux.
    if(keys1.length != keys2.length)
        return false;

    const OBJ_ACTUEL: any = this;
    const OBJ_PARAM: any = _object;

    for (const cle of keys1) 
    {
        // On ne compare pas les fonctions
        if(typeof OBJ_ACTUEL[cle] == "function" || typeof OBJ_PARAM[cle] == "function")
            continue;

        // Si la propriété est un tableau.
        if (Array.isArray(OBJ_ACTUEL[cle]) && Array.isArray(OBJ_PARAM[cle])) 
        {
            if (OBJ_ACTUEL[cle].length != OBJ_PARAM[cle].length)
                return false;

            // Comparer les tableaux indépendamment de l'ordre
            let listeTempo = [...OBJ_PARAM[cle]];

            for (let i = 0; i < OBJ_ACTUEL[cle].length; i++) 
            {
                let trouver = false;
                for (let j = 0; j < listeTempo.length; j++) 
                {
                    // Si l'élément est un objet
                    if (typeof OBJ_ACTUEL[cle][i] === "object" && OBJ_ACTUEL[cle][i] !== null) 
                    {
                        if (OBJ_ACTUEL[cle][i].equals(listeTempo[j])) 
                        {
                            listeTempo.splice(j, 1);
                            trouver = true;
                            break;
                        }
                    } 
                    else 
                    {
                        if (OBJ_ACTUEL[cle][i] === listeTempo[j]) 
                        {
                            listeTempo.splice(j, 1);
                            trouver = true;
                            break;
                        }
                    }
                }
                if (!trouver) 
                    return false;
                
            }
        }

        // Si la propriété est un objet
        else if(typeof OBJ_ACTUEL[cle] == "object" && OBJ_ACTUEL[cle] !== null)
        {
            // Vérifier si la propriété existe dans le deuxième objet avant d'appeler equals.
            if(!OBJ_PARAM.hasOwnProperty(cle))
                return false;
            
            if(!OBJ_ACTUEL[cle].equals(OBJ_PARAM[cle]))
                return false;
        }

        // Si la propriété est une valeur primitive.
        else if(OBJ_ACTUEL[cle] !== OBJ_PARAM[cle])
            return false;
    }

    return true;
}

export {}
