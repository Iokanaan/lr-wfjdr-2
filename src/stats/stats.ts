import { roll } from "../roll/rollHandler"
import { getSkillLevel, processSkillValue } from "../skills/skills"


export function setStatListeners(sheet: Sheet<unknown>, stat: Stat) {
    sheet.get(stat + '_base').on('update', statUpdateHandler(sheet, stat))
    sheet.get(stat + '_av').on('update', statUpdateHandler(sheet, stat))
    sheet.get(stat + "_label").on('click', function() { roll(sheet, stat, parseInt(sheet.get(stat).text()), []) })
}

export function setBeListeners(sheet: Sheet<CharData>) {
    sheet.get('BE_base').on('update', BeUpdateHandler(sheet, 'BE_av'))
    sheet.get('BE_av').on('update', BeUpdateHandler(sheet, 'BE_base'))
}

export function setBfListeners(sheet: Sheet<CharData>) {
    sheet.get('BF_base').on('update', BfUpdateHandler(sheet, 'BF_av'))
    sheet.get('BF_av').on('update', BfUpdateHandler(sheet, 'BF_base'))
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

const BeUpdateHandler = function(sheet: Sheet<CharData>, complement_label: string) {
    return function handleBeUpdate(component: Component<number>) {
        sheet.get("BE_reminder").value("BE : " + (component.value() + (sheet.get(complement_label) as Component<number>).value()))
    }
}

const BfUpdateHandler = function(sheet: Sheet<CharData>, complement_label: string) {
    return function handleBfUpdate(component: Component<number>) {
        // TODO
    }
}

