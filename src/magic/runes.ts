import { rollMagic } from "../roll/rollHandler"
import { setupRepeater } from "../utils/repeaters"
import { computed, signal } from "../utils/utils"

export const setupRuneRepeaters = function(sheet: Sheet) {
    setupRepeater(sheet.get("rune_repeater"), setupEditEntry("runes"), setupViewEntry)
    setupRepeater(sheet.get("rune_majeur_repeater"), setupEditEntry("runes_majeures"), setupViewEntry)
}

const setupViewEntry = function(entry: Component) {
    entry.find("rune_nom").on("click", function(component: Component<unknown>) {
        log(parseInt(entry.sheet().get("Mag").text()))
        rollMagic(entry.sheet(), component.text(), parseInt(entry.sheet().get("Mag").text()), entry.value().rune_difficulte, ["rune"])
    })
    entry.find("display_desc").on("click", function() {
        if(entry.find("desc_col").visible()) {
            entry.find("desc_col").hide()
        } else {
            entry.find("desc_col").show()
        }
    })
    Bindings.add(entry.value().rune_name, "bind_rune", "RuneDisplay", function() {
        return {
            "rune_name": entry.value().rune_name,
            "rune_difficulte": entry.value().rune_difficulte,
            "rune_activation": entry.value().rune_activation,
            "rune_permanente": entry.value().rune_permanente,
            "rune_temp": entry.value().rune_temp
        }    
    })
    entry.find("bind_rune").on("click", function() {
        Bindings.send(entry.sheet(), entry.value().rune_name)
    })
}

const setupEditEntry = function(tableName: string): (entry: Component) => void {
    return function(entry: Component) {
            const rune = signal(entry.find("rune_choice").value())
            computed(function() {
                const runeData = Tables.get(tableName).get(rune())
                entry.find("rune_name").value(runeData.name)
                entry.find("rune_difficulte").value(runeData.difficulte)
                entry.find("rune_activation").value(runeData.activation)
                entry.find("rune_permanente").value(runeData.permanente)
                entry.find("rune_temp").value(runeData.temp)
            }, [rune])
            entry.find("rune_choice").on("update", function(cmp) {
                rune.set(cmp.value())
            })
            entry.find("custom_rune").on("click", function() {
                if(entry.find("rune_choice").visible()) {
                    entry.find("rune_choice").hide()
                    entry.find("custom_row").show()
                } else {
                    entry.find("rune_choice").show()
                    entry.find("custom_row").hide()
                    entry.find("rune_choice").value(rune())
                }
            })
        }
}