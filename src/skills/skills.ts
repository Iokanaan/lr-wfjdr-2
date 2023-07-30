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
  setupSkill(sheet.get, skill.id, skill.cmp_id, skill.stat)
}

export const setupSkillViewEntry = function(entry: Component<SkillData>) {
  setupSkill(entry.find, entry.id() + "_skill", "av", entry.value().comp_stat)
}

export const setupSkillEditEntry = function(entry: Component) {

  const signalComp = signal(Tables.get("competences_av").get(entry.find("nom_comp").value()))
  const signalCustomStat = signal(entry.find("custom_stat_comp").value())
  
  const signalPredefinedStat = computed(function() {
    if(signalComp().stat !== "variable") {
      entry.find("custom_stat_comp").hide()
      entry.find('fixed_stat').text("(" + signalComp().stat + ")")
      entry.find('fixed_stat').show()
      return signalComp().stat
    } else {
      entry.find("custom_stat_comp").show()
      entry.find('fixed_stat').hide()
      return null
    }
  }, [signalComp])
  
  computed(function() {
    const compStat = signalPredefinedStat() !== null ? signalPredefinedStat() : signalCustomStat()
    entry.find("comp_stat").value(compStat)
    return compStat
  }, [signalPredefinedStat, signalCustomStat])

  computed(function() {
    if(variable_comp.indexOf(signalComp()) !== -1) {
      entry.find("specialite").show()
    } else {
      entry.find("specialite").hide()
    }

  }, [signalComp])

  entry.find("nom_comp").on("update", function(cmp: Component<string>) {
    signalComp.set(cmp.value())
  })

  entry.find("custom_stat_comp").on("update", function(cmp: Component<string>) {
    signalCustomStat.set(cmp.value())
  })

}

const setupSkill = function(get: (id: string) => Component, skillId: string, skillCmpId: string, stat: Stat) {
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
  signals[skillId] = computed(
    function() {
      let value = signals[stat]() as number
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
     roll(cmp.sheet(), cmp.text(), signals[skillId]() as number, [])
  })
}