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
        roll(sheet, stat, parseInt(sheet.get(stat).text()), []) 
    })
}

export function setBStatListener(sheet: Sheet) {
    const base = signal(sheet.get("B_base").value() as number);
    const av = signal(sheet.get("B_av").value() as number);
    signals['B'] = computed(function() { return base() + av() }, [base, av]);
    signals['BE'] = computed(function() { return Math.floor((base() + av()) / 10) }, [base, av] )
    sheet.get('B_base').on('update', function(cmp: Component) { 
        base.set(cmp.value()) 
    })
    sheet.get('B_av').on('update', function(cmp: Component) { 
        av.set(cmp.value()) 
    })
}

export function setBeListeners(sheet: Sheet<CharData>) {
    sheet.get('BE_base').on('update', BeUpdateHandler(sheet))
}

const BeUpdateHandler = function(sheet: Sheet<CharData>) {
    return function handleBeUpdate(component: Component<number>) {
        sheet.get("BE_reminder").text("BE : " + component.value())
    }
}


