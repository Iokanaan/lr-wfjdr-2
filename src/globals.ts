import { computed, signal } from "./utils/utils"

export const globalSheets: Record<string, Sheet<CharData>> = {}

export const signals: Record<"B" | "BF" | "BE" | "enc_max" | Stat, Computed<number>> & Record<"B_actuel", Signal<number>> = {} as any

export const encombrementRecord: Signal<Record<string, number>> = signal({})

export const totalEncombrement = computed(function() {
    let totalEnc = 0
    each(encombrementRecord(), function(enc) {
        if(!Number.isNaN(enc) && enc !== undefined && enc !== null) {
            totalEnc += enc
        }
    })
    return totalEnc
}, [encombrementRecord])