// Variable globale de gestion des entries sur le repeater des talents
let entryStates: Record<string, RepeaterState> = {}

export const setupRepeater = function(
    repeater: Component<any>,
    setupEditEntry: (entry: Component<any>) => void,
    setupViewEntry: (entry: Component<any>) => void
    ) {

    each(repeater.value(), function(_, entryId) {
        entryStates[entryId] = 'VIEW'
        setupViewEntry(repeater.find(entryId))
    })
    // Gestion de l'initialisation du mode édition
    repeater.on('click', function(rep: Component<Record<string, unknown>>) {
        each(rep.value(), function (_, entryId) {
            const entry = rep.find(entryId)
            if(entry.find('mode').value() === 'EDIT') {
                // On init uniquement les entries qui n'était pas en mode EDIT avant
                if(entryStates[entryId] !== 'EDIT') {
                    // Initialisation de l'entry
                    setupEditEntry(entry)
                }
                // L'entry est stockée en mode EDIT
                entryStates[entryId] = 'EDIT'
            } else {
                if(entryStates[entryId] !== 'VIEW') {
                    // Initialisation de l'entry
                    setupViewEntry(entry)
                }
                // L'entry est stockée en mode VIEW
                entryStates[entryId] = 'VIEW'
            }
        })
    })
}