import { roll } from "../roll/rollHandler"
import { computed, signal } from "../utils/utils"

export const setupBasicSkill = function(sheet: Sheet, skill: SkillBasic, statSignals: StatSignals, talents: Computed<string[]>) {
  setupSkill(sheet.get, skill.cmp_id, skill.stat, skill.name, null, statSignals, talents)
}

export const setupSkillViewEntry = function(statSignals: StatSignals, advancedSkillsByEntry: Signal<Record<string, SkillData>>, talents: Computed<string[]>) {
  return function(entry: Component<SkillData>) {
    setupSkill(entry.find, "av", entry.value().comp_stat, entry.value().nom, entry.value().specialite, statSignals, talents)
  
    const allAdvancedSkills = advancedSkillsByEntry()
    allAdvancedSkills[entry.id()] = entry.value()
    advancedSkillsByEntry.set(allAdvancedSkills)
  }
}

export const onSkillDelete = function(advancedSkillsByEntry: Signal<Record<string, SkillData>>) {
  return function(entryId: string) {
    const allAdvancedSkills = advancedSkillsByEntry()
    delete allAdvancedSkills[entryId]
    advancedSkillsByEntry.set(allAdvancedSkills)
  }
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

  // Set skill name base on signal
  computed(function() {
    entry.find("nom_comp_label").value(skill().name)
  }, [skill])

  // Set skill in signal on choice
  entry.find("nom_comp").on("update", function(cmp: Component<string>) {
    skill.set(Tables.get("competences_av").get(cmp.value()))
  })

  // Set custom stat based on choice
  entry.find("custom_stat_comp").on("update", function(cmp: Component<string>) {
    customStat.set(cmp.value())
  })

  // Passage en mode custom
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

const setupSkill = function(get: (id: string) => Component, skillCmpId: string, stat: Stat, skillName: string, specialite: string | null, statSignals: StatSignals, talents: Computed<string[]>) {

  // Définition des signaux pour les cases à cocher
  const signalAq = signal(get('comp_' + skillCmpId + '_acq').value())
  const signal10 = signal(get('comp_' + skillCmpId + '_10').value())
  const signal20 = signal(get('comp_' + skillCmpId + '_20').value())

  // Calcul du niveau de compétence
  const signalLevel = computed(
    function() {
      if(!signalAq()) { return 0 }
      if(!signal10()) { return 1 }
      if(!signal20()) { return 2 }
      return 3
    }
  , [signalAq, signal10, signal20])

  // Calcul de la valeur de compétence selon la stat et le niveau
  const skillVal = computed(
    function() {
      let value = statSignals[stat]()
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
      value += getTalentBonus(skillName, specialite, talents())
      get("comp_" + skillCmpId +"_val").text(value.toString())
      return value
    }
  , [statSignals[stat], signalLevel, talents])

  // Mise à jour des signaux sur les update de checkbox
  get('comp_' + skillCmpId + '_acq').on('update', function(cmp) { signalAq.set(cmp.value()) })
  get('comp_' + skillCmpId + '_10').on('update', function(cmp) { signal10.set(cmp.value()) })
  get('comp_' + skillCmpId + '_20').on('update', function(cmp) { signal20.set(cmp.value()) })
  
  // Lancer de compétence
  get('comp_' + skillCmpId + '_label').on('click', function(cmp) {
     roll(cmp.sheet(), cmp.text(), skillVal(), [])
  })
}

const getTalentBonus = function(skillName: string, specialite: string | null, talents: string[]) {
  let bonus = 0
  switch(true) {
    case talents.indexOf("acrobatie_equestre") !== -1 && skillName === "Équitation":
      log("Application acrobatie_equestre")
      bonus += 10
      break
    case talents.indexOf("dur_en_affaires") !== -1 && (skillName === "Évaluation" || skillName === "Marchandage"):
      log("Application dur_en_affaires")
      bonus += 10
      break
    case talents.indexOf("grand_voyageur") !== -1 && (skillName === "connaissances_generales" || skillName === "langue"):
      log("Application grand_voyageur")
      bonus += 10
      break
    case talents.indexOf("harmonie_aetherique") !== -1 && (skillName === "focalisation" || skillName === "sens_de_la_magie"):
      log("Application harmonie_aetherique")
      bonus += 10
      break
    case talents.indexOf("linguistique") !== -1 && (skillName === "lire_ecrire" || skillName === "langue"):
      log("Application linguistique")
      bonus += 10
      break
    case talents.indexOf("menacant") !== -1 && (skillName === "Intimidation" || skillName === "torture"):
      log("Application menacant")
      bonus += 10
      break
    case talents.indexOf("sens_aguises") !== -1 && skillName === "Perception":
      log("Application sens_aguises")
      bonus += 20
      break
    case talents.indexOf("sens_de_l_orientation") !== -1 && skillName === "orientation":
      log("Application sens_de_l_orientation")
      bonus += 10
      break
    case talents.indexOf("chirurgie") !== -1 && skillName === "Soin":
      bonus += 10
      break
    case talents.indexOf("calcul_mental") !== -1 && (skillName === "Jeu" || skillName === "Orientation"):
      bonus += 10
      break
    case talents.indexOf("savoir_faire_nain") !== -1 && skillName === "Métier" && specialite !== null && ["arquebusier", "brasseur", "cristallier", "fabriquant d'armes", "fabriquant d'armures", "forgeron", "maçon", "mineur"].indexOf(specialite) !== -1:
      bonus += 10
      break
    case talents.indexOf("talent_artistique") !== -1 && skillName === "Métier" && specialite === "artiste":
      bonus += 20
      break
    default:
  }
  return bonus
}