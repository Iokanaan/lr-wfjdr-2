import { signals } from "../globals";
import { roll } from "../roll/rollHandler"
import { computed, signal } from "../utils/utils"


export function setStatListeners(sheet: Sheet, stat: Stat) {

    const base = signal(sheet.get(stat + "_base").value() as number);
    const av = signal(sheet.get(stat + "_av").value() as number);
    signals[stat] = computed(function() { return base() + av() }, [base, av]);
    
    sheet.get(stat + '_base').on('update', function(cmp: Component) { 
        base.set(cmp.value()) 
    })
    sheet.get(stat + '_av').on('update', function(cmp: Component) { 
        av.set(cmp.value()) 
    }) 
    sheet.get(stat + "_label").on('click', function() { 
        roll(sheet, stat, signals[stat](), []) 
    })
    
}

export function setBonuses(sheet: Sheet) {
    signals['BE'] = computed(function() { 
        const value = Math.floor((signals['E']()) / 10)
        sheet.get("BE").value(value)
        sheet.get("BE_reminder").text("BE : " + value)
        return value
    }, [signals['E']] )
    signals['BF'] = computed(function() {
        const value = Math.floor((signals['F']()) / 10) 
        sheet.get("BF").value(value)
        return value
    }, [signals['F']] )
    
}

export function setBStatListener(sheet: Sheet) {
    const base = signal(sheet.get("B_base").value() as number);
    const av = signal(sheet.get("B_av").value() as number);
    signals['B'] = computed(function() { return base() + av() }, [base, av]);
    sheet.get('B_base').on('update', function(cmp: Component) { 
        base.set(cmp.value()) 
    })
    sheet.get('B_av').on('update', function(cmp: Component) { 
        av.set(cmp.value()) 
    })
}