import { rollMagic } from "../roll/rollHandler"
import { setupRepeater } from "../utils/repeaters"
import { intToWord } from "../utils/utils"

export const setupMagicRepeater = function(sheet: Sheet<unknown>) {
    const repeater = sheet.get("magic_repeater") as Component<Record<string, unknown>>
    setupRepeater2(repeater, setupMagicEditEntry, function() {})
    repeater.on("click", "spell_label", function(component: Component<unknown>) {
        const data = repeater.value()[component.index()]
        const entry = repeater.find(component.index())
        let target = data.difficulte
        if(data.use_ingredient === true) {
            target -= data.bonus_ingredient
        }
        let castLevel = (sheet.get("cast_level") as Component<number>).value()
        if(castLevel === null) {
            castLevel = (sheet.get("Mag") as Component<number>).value()
        }
        rollMagic(sheet, component.text(), castLevel, target, ["magic, target_" + intToWord(target)])
    })

    repeater.on("click", "magic_display", function(cmp: Component<unknown>) {
        const entry = repeater.find(cmp.index())
        const desc = entry.find("magic_desc_col")
        if(desc.visible()) {
            desc.hide()
        } else {
            desc.show()
        }
    })
}

const setupMagicEditEntry = function(entry: Component<unknown>) {
    entry.find("main_category").on("update", function(cmp: Component<string>) {
        if(cmp.value() !== "magie_mineure") {
            const domaines: Record<string, string> = {}
            Tables.get(cmp.value()).each(function(domaine: DomaineObject) {
                domaines[domaine.id] = domaine.long_name;
            });
            (entry.find("sub_category") as ChoiceComponent).setChoices(domaines);
            entry.find("sub_category").value(Object.keys(domaines)[0]);
            entry.find("spell_domain").value(Object.values(domaines)[0])
        } else {
            (entry.find("sub_category") as ChoiceComponent).setChoices({"magie_mineure": "Magie mineure"});
            entry.find("sub_category").value("magie_mineure");
            entry.find("spell_domain").value("Magie mineure")
        }
    })
    entry.find("sub_category").on("update", function(cmp: Component<string>) {
        const spells: Record<string, string> = {};
        Tables.get(cmp.value()).each(function(spell: Spell) {
            spells[spell.id] = spell.name;
        });
        (entry.find("spell_choice") as ChoiceComponent).setChoices(spells);
        entry.find("spell_choice").value(Object.keys(spells)[0]);
        entry.find("spell_domain").value(Tables.get(entry.find("main_category").value()).get(cmp.value()).name)
    })
    entry.find("spell_choice").on("update", function(cmp: Component<string>) {
        const spell_data = ((Tables.get((entry.find("sub_category") as Component<string>).value()))).get(cmp.value())
        entry.find("spell_name").value(spell_data.name)
        entry.find("spell_description").value(spell_data.description)
        entry.find("incantation").value(spell_data.incantation)
        entry.find("difficulte").value(spell_data.difficulte)
        entry.find("ingredient").value(spell_data.ingredient)
        entry.find("bonus_ingredient").value(spell_data.bonus_ingredient)
    })
}

export const hideMagicDescription = function(entry: Component<unknown>) {
    entry.find("magic_desc_col").hide()
}