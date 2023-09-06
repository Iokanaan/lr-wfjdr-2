import { roll } from "../roll/rollHandler"
import { computed, signal } from "../utils/utils"


export function setStatListeners(sheet: Sheet, stat: Stat, statSignals: StatSignals) {

    const base = signal(sheet.get(stat + "_base").value() as number);
    const av = signal(sheet.get(stat + "_av").value() as number);
    statSignals[stat] = computed(function() { return base() + av() }, [base, av]);
    
    sheet.get(stat + '_base').on('update', function(cmp: Component) { 
        base.set(cmp.value()) 
    })
    sheet.get(stat + '_av').on('update', function(cmp: Component) { 
        av.set(cmp.value()) 
    }) 
    sheet.get(stat + "_label").on('click', function() { 
        roll(sheet, stat, statSignals[stat](), []) 
    })
    
}

export function setBonuses(sheet: Sheet, statSignals: StatSignals) {
    statSignals['BE'] = computed(function() { 
        const value = Math.floor((statSignals['E']()) / 10)
        sheet.get("BE").value(value)
        sheet.get("BE_reminder").text("BE : " + value)
        return value
    }, [statSignals['E']] )
    statSignals['BF'] = computed(function() {
        const value = Math.floor((statSignals['F']()) / 10) 
        sheet.get("BF").value(value)
        return value
    }, [statSignals['F']] )
    
}

export function setBStatListener(sheet: Sheet, statSignals: StatSignals) {
    const base = signal(sheet.get("B_base").value() as number);
    const av = signal(sheet.get("B_av").value() as number);
    statSignals['B'] = computed(function() { return base() + av() }, [base, av]);
    sheet.get('B_base').on('update', function(cmp: Component) { 
        base.set(cmp.value()) 
    })
    sheet.get('B_av').on('update', function(cmp: Component) { 
        av.set(cmp.value()) 
    })
}

export function setPDStatListener(sheet: Sheet, statSignals: StatSignals) {
    statSignals['PD'] = signal(sheet.get("PD_base").value() as number)
    sheet.get('PD_base').on('update', function(cmp: Component) { 
        (statSignals['PD'] as Signal<number>).set(cmp.value()) 
    })
}