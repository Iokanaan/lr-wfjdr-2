import { signals } from "../globals"
import { roll } from "../roll/rollHandler"
import { computed, signal } from "../utils/utils"

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

export const setupBasicSkill = function(sheet: Sheet, skill: SkillBasic) {
  setupSkill(sheet.get, skill.cmp_id, skill.stat)
}

export const setupSkillViewEntry = function(entry: Component<SkillData>) {
  setupSkill(entry.find, "av", entry.value().comp_stat)
}

export const setupSkillEditEntry = function(entry: Component) {

  const skill = signal(Tables.get("competences_av").get(entry.find("nom_comp").value()))

  // Stat if custom
  const customStat = signal(entry.find("custom_stat_comp").value())
  
  // Stat of skill if predefined, else null
  const predefStat = computed(function() {
    if(skill().stat !== "variable") {
      entry.find("custom_stat_comp").hide()
      entry.find('fixed_stat').text("(" + skill().stat + ")")
      entry.find('fixed_stat').show()
      return skill().stat
    } else {
      entry.find("custom_stat_comp").show()
      entry.find('fixed_stat').hide()
      return null
    }
  }, [skill])
  
  // Stat for skill
  computed(function() {
    const compStat = predefStat() !== null ? predefStat() : customStat()
    entry.find("comp_stat").value(compStat)
    return compStat
  }, [predefStat, customStat])

  // Display specialite depending on skill
  computed(function() {
    if(skill().variable === "true") {
      entry.find("specialite").show()
      return true
    } else {
      entry.find("specialite").hide()
      entry.find("specialite").value(null)
      return false
    }
  }, [skill])

  computed(function() {
    entry.find("nom_comp_label").value(skill().name)
  }, [skill])

  entry.find("nom_comp").on("update", function(cmp: Component<string>) {
    skill.set(Tables.get("competences_av").get(cmp.value()))
  })

  entry.find("custom_stat_comp").on("update", function(cmp: Component<string>) {
    customStat.set(cmp.value())
  })

  entry.find("display_custom").on("click", function() {
    if(entry.find("nom_comp").visible()) {
      entry.find("nom_comp").hide()
      entry.find("nom_comp_label").show()
      entry.find("specialite").show()
      entry.find('fixed_stat').hide()
      entry.find("custom_stat_comp").show()
    } else {
      entry.find("nom_comp").value(Tables.get("competences_av").get("alphabet_secret").id)
      skill.set(Tables.get("competences_av").get("alphabet_secret"))
      entry.find("nom_comp").show()
      entry.find("nom_comp_label").hide()
      entry.find("specialite").show()
      entry.find('fixed_stat').show()
      entry.find("custom_stat_comp").hide()
    }
  })


}

const setupSkill = function(get: (id: string) => Component, skillCmpId: string, stat: Stat) {
  const signalAq = signal(get('comp_' + skillCmpId + '_acq').value())
  const signal10 = signal(get('comp_' + skillCmpId + '_10').value())
  const signal20 = signal(get('comp_' + skillCmpId + '_20').value())
  const signalLevel = computed(
    function() {
      if(!signalAq()) { return 0 }
      if(!signal10()) { return 1 }
      if(!signal20()) { return 2 }
      return 3
    }
  , [signalAq, signal10, signal20])
  const skillVal = computed(
    function() {
      let value = signals[stat]()
      switch(signalLevel()) {
        case 1:
          break
        case 2:
          value += 10
          break
        case 3:
          value += 20
          break
        default:
          value = Math.round(value / 2)
          break
      }
      get("comp_" + skillCmpId +"_val").text(value.toString())
      return value
    }
  , [signals[stat], signalLevel])
  get('comp_' + skillCmpId + '_acq').on('update', function(cmp) { signalAq.set(cmp.value()) })
  get('comp_' + skillCmpId + '_10').on('update', function(cmp) { signal10.set(cmp.value()) })
  get('comp_' + skillCmpId + '_20').on('update', function(cmp) { signal20.set(cmp.value()) })
  get('comp_' + skillCmpId + '_label').on('click', function(cmp) {
     roll(cmp.sheet(), cmp.text(), skillVal(), [])
  })
}