import { rollMagic } from "../roll/rollHandler"

export const setupRituelViewEntry = function(entry: Component) {
    entry.find("rituel_label").on("click", function(cmp: Component) {
        if(entry.value().rituel_difficulte === undefined) {
            entry.value().rituel_difficulte = 0
        }
        let castLevel = entry.sheet().get("cast_rituel_level").value() as number
        if(castLevel === null) {
            castLevel = parseInt(entry.sheet().get("Mag").text()) as number
        }
        rollMagic(entry.sheet(), cmp.text(), castLevel, entry.value().rituel_difficulte, [])
    })
    Bindings.add(entry.value().rituel_name, "bind_rituel", "RituelDisplay", function() {
        return entry.value()
    })
    entry.find("bind_rituel").on("click", function() {
        Bindings.send(entry.sheet(), entry.value().rituel_name)
    })
}