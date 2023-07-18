import { roll } from "../roll/rollHandler"
import { getSkillLevel, processSkillValue } from "../skills/skills"


export function setStatListeners(sheet: Sheet<unknown>, stat: Stat) {
    sheet.get(stat + '_base').on('update', statUpdateHandler(sheet, stat))
    sheet.get(stat + '_av').on('update', statUpdateHandler(sheet, stat))
    sheet.get(stat + "_label").on('click', function() { roll(sheet, stat, parseInt(sheet.get(stat).text()), []) })
}

export function setBeListeners(sheet: Sheet<CharData>) {
    sheet.get('BE_base').on('update', BeUpdateHandler(sheet))
}

export function setEncombrement(sheet: Sheet<CharData>) {
    sheet.get("encombrement_label").text(" / " + ((sheet.get("F") as Component<number>).value() * 10).toString())
}

const statUpdateHandler = function(sheet: Sheet<CharData>, stat: Stat) {
    return function handle_stat_update(component: Component<number>) {
        Tables.get("skills_basic").each(function(skill: SkillBasic) {
            if(skill.stat === stat) {
                const stat_val = component.value() + (sheet.get(stat + "_av") as Component<number>).value()
                const new_value = processSkillValue(stat_val, getSkillLevel(sheet, skill))
                sheet.get("comp_" + skill.cmp_id + "_val").text(new_value.toString())
            }
        })
    }
}

const BeUpdateHandler = function(sheet: Sheet<CharData>) {
    return function handleBeUpdate(component: Component<number>) {
        sheet.get("BE_reminder").value("BE : " + component.value())
    }
}

