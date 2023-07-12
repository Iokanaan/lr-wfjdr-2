import { roll } from "../roll/roll_handler"

export const set_skill_value = function(sheet: Sheet<CharData>, skill: SkillBasic) {
  const level = get_skill_level(sheet, skill)
  const stat_val = parseInt(sheet.get(skill.stat).text())
  const skill_value = process_skill_value(stat_val, level)
  sheet.get("comp_" + skill.cmp_id + "_val").text(skill_value.toString())
}

export const set_skill_listeners = function (sheet: Sheet<unknown>, skill: SkillBasic) {
  sheet.get('comp_' + skill.cmp_id + '_acq').on('update', update_skill_acq_handler(sheet, skill))
  sheet.get('comp_' + skill.cmp_id + '_10').on('update', update_skill_10_handler(sheet, skill))
  sheet.get('comp_' + skill.cmp_id + '_20').on('update', update_skill_20_handler(sheet, skill))
  log("set listeners")
  sheet.get('comp_' + skill.cmp_id + '_label').on('click', rollSkill(sheet, skill))
}

export const get_skill_level = function(sheet: Sheet<CharData>, skill: SkillBasic) {
  return Number((sheet.get("comp_" + skill.cmp_id + "_acq") as Component<boolean>).value())
  + Number((sheet.get("comp_" + skill.cmp_id + "_10") as Component<boolean>).value())
  + Number((sheet.get("comp_" + skill.cmp_id + "_20") as Component<boolean>).value())
}

export const process_skill_value = function (stat_val: number, level: number) {
  switch(level) {
    case 1:
      return stat_val
    case 2:
      return stat_val + 10
    case 3:
      return stat_val + 20
    default:
      return Math.round(stat_val / 2)
  }
}

const update_skill_acq_handler = function(sheet: Sheet<CharData>, skill: SkillBasic) {
    return function handleUpdateCompetence(component: Component<boolean>) {
      const level = Number(component.value())
      const stat_val = parseInt(sheet.get(skill.stat).text())
      + Number((sheet.get("comp_" + skill.cmp_id + "_10") as Component<boolean>).value())
      + Number((sheet.get("comp_" + skill.cmp_id + "_20") as Component<boolean>).value())
      const skill_value = process_skill_value(stat_val, level)
      sheet.get("comp_" + skill.cmp_id + "_val").text(skill_value.toString())
    }
}

const update_skill_10_handler = function(sheet: Sheet<CharData>, skill: SkillBasic) {
  return function handleUpdateCompetence(component: Component<boolean>) {
    const stat_val = parseInt(sheet.get(skill.stat).text())
    const level = Number((sheet.get("comp_" + skill.cmp_id + "_acq") as Component<boolean>).value())
    + Number(component.value())
    + Number((sheet.get("comp_" + skill.cmp_id + "_20") as Component<boolean>).value())
    const skill_value = process_skill_value(stat_val, level)
    sheet.get("comp_" + skill.cmp_id + "_val").text(skill_value.toString())
  }
}

const update_skill_20_handler = function(sheet: Sheet<CharData>, skill: SkillBasic) {
  return function handleUpdateCompetence(component: Component<boolean>) {
    const stat_val = parseInt(sheet.get(skill.stat).text())
    const level = Number((sheet.get("comp_" + skill.cmp_id + "_acq") as Component<boolean>).value())
    + Number((sheet.get("comp_" + skill.cmp_id + "_10") as Component<boolean>).value())
    + Number(component.value())
    const skill_value = process_skill_value(stat_val, level)
    sheet.get("comp_" + skill.cmp_id + "_val").text(skill_value.toString())
  }
}

const rollSkill = function(sheet: Sheet<CharData>, skill: SkillBasic) {
  return function rollSkill2(component: Component<string>) {
    const skillValue = parseInt(sheet.get('comp_' + skill.cmp_id + '_val').text())
    const title = sheet.get('comp_' + skill.cmp_id + '_label').text()
    roll(sheet, title, skillValue, ["attack"])
  }
}