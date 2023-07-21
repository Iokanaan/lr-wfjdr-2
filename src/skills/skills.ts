import { roll } from "../roll/rollHandler"
import { setupRepeater } from "../utils/repeaters"

export const setSkillValue = function(sheet: Sheet<CharData>, skill: SkillBasic) {
  const level = getSkillLevel(sheet, skill)
  const statVal = parseInt(sheet.get(skill.stat).text())
  const skillValue = processSkillValue(statVal, level)
  sheet.get("comp_" + skill.cmp_id + "_val").text(skillValue.toString())
}

export const setSkillListeners = function (sheet: Sheet<unknown>, skill: SkillBasic) {
  sheet.get('comp_' + skill.cmp_id + '_acq').on('update', updateSkillAcqHandler(sheet, skill))
  sheet.get('comp_' + skill.cmp_id + '_10').on('update', updateSkill10Handler(sheet, skill))
  sheet.get('comp_' + skill.cmp_id + '_20').on('update', updateSkill20Handler(sheet, skill))

  sheet.get('comp_' + skill.cmp_id + '_label').on('click', clickSkillHandler(sheet, skill))
}

export const getSkillLevel = function(sheet: Sheet<CharData>, skill: SkillBasic) {
  return Number((sheet.get("comp_" + skill.cmp_id + "_acq") as Component<boolean>).value())
  + Number((sheet.get("comp_" + skill.cmp_id + "_10") as Component<boolean>).value())
  + Number((sheet.get("comp_" + skill.cmp_id + "_20") as Component<boolean>).value())
}

export const processSkillValue = function (statVal: number, level: number) {
  switch(level) {
    case 1:
      return statVal
    case 2:
      return statVal + 10
    case 3:
      return statVal + 20
    default:
      return Math.round(statVal / 2)
  }
}

const updateSkillAcqHandler = function(sheet: Sheet<CharData>, skill: SkillBasic) {
    return function handleUpdateCompetence(component: Component<boolean>) {
      const level = Number(component.value())
      const statVal = parseInt(sheet.get(skill.stat).text())
      + Number((sheet.get("comp_" + skill.cmp_id + "_10") as Component<boolean>).value())
      + Number((sheet.get("comp_" + skill.cmp_id + "_20") as Component<boolean>).value())
      const skill_value = processSkillValue(statVal, level)
      sheet.get("comp_" + skill.cmp_id + "_val").text(skill_value.toString())
    }
}

const updateSkill10Handler = function(sheet: Sheet<CharData>, skill: SkillBasic) {
  return function handleUpdateCompetence(component: Component<boolean>) {
    const statVal = parseInt(sheet.get(skill.stat).text())
    const level = Number((sheet.get("comp_" + skill.cmp_id + "_acq") as Component<boolean>).value())
    + Number(component.value())
    + Number((sheet.get("comp_" + skill.cmp_id + "_20") as Component<boolean>).value())
    const skill_value = processSkillValue(statVal, level)
    sheet.get("comp_" + skill.cmp_id + "_val").text(skill_value.toString())
  }
}

const updateSkill20Handler = function(sheet: Sheet<CharData>, skill: SkillBasic) {
  return function handleUpdateCompetence(component: Component<boolean>) {
    const statVal = parseInt(sheet.get(skill.stat).text())
    const level = Number((sheet.get("comp_" + skill.cmp_id + "_acq") as Component<boolean>).value())
    + Number((sheet.get("comp_" + skill.cmp_id + "_10") as Component<boolean>).value())
    + Number(component.value())
    const skill_value = processSkillValue(statVal, level)
    sheet.get("comp_" + skill.cmp_id + "_val").text(skill_value.toString())
  }
}

const clickSkillHandler = function(sheet: Sheet<CharData>, skill: SkillBasic) {
  return function rollSkill(component: Component<string>) {
    const skillValue = parseInt(sheet.get('comp_' + skill.cmp_id + '_val').text())
    const title = sheet.get('comp_' + skill.cmp_id + '_label').text()
    roll(sheet, title, skillValue, [])
  }
}

export const setupSkillRepeater = function(sheet: Sheet<unknown>) {
  const repeater = sheet.get("skill_repeater") as Component<Record<string, SkillData>>
  log("set skill repeater")
  setupRepeater(repeater, setupSkillEditEntry)
}

const setupSkillEditEntry = function(entry: Component<unknown>) {
  const nom = entry.find("nom_comp").value()
  const comp_metadata = Tables.get("competences_av").get(nom)
  if(comp_metadata.variable === "true") {
    entry.find("specialite").show()
  } else {
    entry.find("specialite").hide()
  }
  if(comp_metadata.stat === "variable") {
    entry.find("custom_stat_comp").show()
    entry.find('comp_stat').value(entry.find("custom_stat_comp").value())
    entry.find('fixed_stat').hide()
  } else {
    entry.find("custom_stat_comp").hide()
    entry.find('comp_stat').value(comp_metadata.stat)
    entry.find('fixed_stat').value("(" + comp_metadata.stat + ")")
    entry.find('fixed_stat').show()
  }
  const variable_comp: string[] = []
  const variable_stat_comp: string[] = []
  Tables.get("competences_av").each(function(comp) {
    if(comp.variable === "true") {
      variable_comp.push(comp.id)
    }
    if(comp.stat === "variable") {
      variable_stat_comp.push(comp.id)
    }
  })

  entry.find("nom_comp").on("update", function(cmp: Component<string>) {
    if(variable_comp.indexOf(cmp.value()) !== -1) {
      entry.find("specialite").show()
    } else {
      entry.find("specialite").hide()
      entry.find("specialite").value(null)
    }
    if(variable_stat_comp.indexOf(cmp.value()) !== -1) {
      entry.find("custom_stat_comp").show()
      entry.find('comp_stat').value(entry.find("custom_stat_comp").value())
      entry.find("fixed_stat").hide()
    } else {
      entry.find("custom_stat_comp").hide()
      entry.find('comp_stat').value(Tables.get("competences_av").get(cmp.value()).stat)
      entry.find('fixed_stat').value("(" + Tables.get("competences_av").get(cmp.value()).stat + ")")
      entry.find('fixed_stat').show()
    }
  })

  entry.find("custom_stat_comp").on("update", function(cmp: Component<string>) {
    entry.find('comp_stat').value(cmp.value())
  })

}