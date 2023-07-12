import { get_skill_level, process_skill_value } from "../skills/skills"

export function set_stat_listeners(sheet: Sheet<unknown>, stat: Stat) {
    sheet.get(stat + '_base').on('update', stat_update_handler(sheet, stat))
    sheet.get(stat + '_av').on('update', stat_update_handler(sheet, stat))
}

export function set_BE_listeners(sheet: Sheet<CharData>) {
    sheet.get('BE_base').on('update', BE_update_handler(sheet, 'BE_av'))
    sheet.get('BE_av').on('update', BE_update_handler(sheet, 'BE_base'))
}

export function set_BF_listeners(sheet: Sheet<CharData>) {
    sheet.get('BF_base').on('update', BF_update_handler(sheet, 'BF_av'))
    sheet.get('BF_av').on('update', BF_update_handler(sheet, 'BF_base'))
}


const stat_update_handler = function(sheet: Sheet<CharData>, stat: Stat) {
    return function handle_stat_update(component: Component<number>) {
        Tables.get("skills_basic").each(function(skill: SkillBasic) {
            if(skill.stat === stat) {
                const stat_val = component.value() + (sheet.get(stat + "_av") as Component<number>).value()
                const new_value = process_skill_value(stat_val, get_skill_level(sheet, skill))
                sheet.get("comp_" + skill.cmp_id + "_val").text(new_value.toString())
            }
        })
    }
}

const BE_update_handler = function(sheet: Sheet<CharData>, complement_label: string) {
    return function handle_BE_update(component: Component<number>) {
        sheet.get("BE_reminder").value("BE : " + (component.value() + (sheet.get(complement_label) as Component<number>).value()))
    }
}

const BF_update_handler = function(sheet: Sheet<CharData>, complement_label: string) {
    return function handle_BF_update(component: Component<number>) {
        // TODO
    }
}

