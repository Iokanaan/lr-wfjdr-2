import { computed, signal } from "./utils/utils"

export const globalSheets: Record<string, Sheet<CharData>> = {}

export const signals: Record<"B" | "BF" | "BE" | "PD" | "enc_max" | Stat, Computed<number>> & Record<"B_actuel", Signal<number>> = {} as any

export const encombrementRecord: Signal<Record<string, number>> = signal({})

export const talentsByEntry: Signal<Record<string, string>> = signal({})

export const talents = computed(function() {
    const talentSet: string[] = []
    each(talentsByEntry(), function(talent) {
        if(talentSet.indexOf(talent) === -1) {
            talentSet.push(talent)
        }
    })
    return talentSet
}, [talentsByEntry])

export const advancedSkillsByEntry: Signal<Record<string, SkillData>> = signal({})

export const advancedSkills = computed(function() {
    const talentSet: string[] = []
    
    each(advancedSkillsByEntry(), function(skill) {
        if(talentSet.indexOf(skill.nom_comp_label) === -1) {
            talentSet.push(skill.nom_comp_label)
        }
    })
    log(talentSet)
    return talentSet
}, [advancedSkillsByEntry])

export const totalEncombrement = computed(function() {
    let totalEnc = 0
    each(encombrementRecord(), function(enc) {
        if(!Number.isNaN(enc) && enc !== undefined && enc !== null) {
            totalEnc += enc
        }
    })
    return totalEnc
}, [encombrementRecord])

