/**
 * Fonction pour avoir du script sur chaque entrée d'un repeater :
 *  - setupEditEntry pour le script qui concerne l'entrée en mode édition
 *  - setupViewEntry pour le script qui concerne l'entrée en mode affichage
 *  - onDelete pour déclencher un script à la suppression d'un élément
 * 
 * En prérequis à l'utilisation de la fonction, il est nécessaire d'avoir :
 *  - un composant "label" avec l'id "mode" et contenant "VIEW" sur le sous-composant servant à l'affichage
 *  - un composant "label" avec l'id "mode" et contenant "EDIT" sur le sous-composant servant à l'édition
 */

// Variable globale de gestion des entries sur le repeater des talents
let entryStates: Record<string, Record<string, RepeaterState | undefined>> = {}

export const setupRepeater = function(
    repeater: Component<any>,
    setupEditEntry: ((entry: Component<any>) => void) | null,
    setupViewEntry: ((entry: Component<any>) => void) | null,
    onDelete: (((entryId: string) => void)) | null) {

    entryStates[repeater.id()] = {}

    // On commence par exécuter le script des entry en mode VIEW au chargement de la feuille
    each(repeater.value(), function(_, entryId) {
        entryStates[repeater.id()][entryId] = 'VIEW'
        if(setupViewEntry !== null) {
            setupViewEntry(repeater.find(entryId))
        }
    })

    // Gestion de l'initialisation du mode édition
    repeater.on('click', function(rep: Component<Record<string, unknown>>) {
        each(rep.value(), function (_, entryId) {
            const entry = rep.find(entryId)
            if(entry.find('mode').value() === 'EDIT') {
                // On init uniquement les entries qui n'était pas en mode EDIT avant
                if(entryStates[repeater.id()][entryId] !== 'EDIT' && setupEditEntry !== null) {
                    // Initialisation de l'entry
                    setupEditEntry(entry)
                }
                // L'entry est stockée en mode EDIT
                entryStates[repeater.id()][entryId] = 'EDIT'
            } else {
                if(entryStates[repeater.id()][entryId] !== 'VIEW' && setupViewEntry !== null) {
                    // Initialisation de l'entry
                    setupViewEntry(entry)
                }
                // L'entry est stockée en mode VIEW
                entryStates[repeater.id()][entryId] = 'VIEW'
            }
        })
        // On parcours le tableau pour vérifier si certains on disparus du repeater
        each(entryStates[repeater.id()], function(_, entryId) {
            if(repeater.value()[entryId] === undefined) {
                // Si disparition, on set l'entrée dans le tableau à undefined et on lancer la fonction onDelete
                entryStates[repeater.id()][entryId] = undefined
                if(onDelete !== null) {
                    onDelete(entryId)
                }
            }
        })
    })
}

// Nécessaire au drop provenant de crafts
export const cleanupRepeater = function(repeater: Component<Record<string, unknown>>) {
    entryStates[repeater.id()] = {}
}