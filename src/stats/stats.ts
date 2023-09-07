import { roll } from "../roll/rollHandler"
import { computed, signal } from "../utils/utils"


export function setStatListeners(sheet: Sheet, stat: Stat, statSignals: StatSignals, armorLevel: Computed<ArmorLevel | null>) {

    const base = signal(sheet.get(stat + "_base").value() as number);
    const av = signal(sheet.get(stat + "_av").value() as number);
    if(stat !== 'Ag') {
        statSignals[stat] = computed(function() { return base() + av() }, [base, av]);
    } else {
        statSignals[stat] = computed(function() {
            if(armorLevel() === "Mailles" || armorLevel() === "Plaques") {
                sheet.get(stat).addClass("text-danger")
                sheet.get(stat).text((base() + av() - 10).toString())
                return base() + av() - 10
            }
            sheet.get(stat).removeClass("text-danger")
            sheet.get(stat).text((base() + av()).toString())
            return base() + av()  }, [base, av, armorLevel]);
    }
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
        sheet.get("BE_base").text(value.toString())
        sheet.get("BE").value(value)
        sheet.get("BE_reminder").text("BE : " + value)
        return value
    }, [statSignals['E']] )
    statSignals['BF'] = computed(function() {
        const value = Math.floor((statSignals['F']()) / 10)
        sheet.get("BF_base").text(value.toString()) 
        sheet.get("BF").value(value)
        return value
    }, [statSignals['F']] )   
}

export function setMagSignal(sheet: Sheet, statSignals: StatSignals) {
    const base = signal(sheet.get("Mag_base").value() as number)
    const av = signal(sheet.get("Mag_av").value() as number)
    statSignals["Mag"] = computed(function() { return base() + av() }, [base, av])
    sheet.get('Mag_base').on('update', function(cmp: Component) { 
        base.set(cmp.value()) 
    })
    sheet.get('Mag_av').on('update', function(cmp: Component) { 
        av.set(cmp.value()) 
    }) 
}

export function setMSignal(sheet: Sheet, statSignals: StatSignals) {
    const base = signal(sheet.get("M_base").value() as number)
    const av = signal(sheet.get("M_av").value() as number)
    statSignals["M"] = computed(function() { return base() + av() }, [base, av])
    sheet.get('M_base').on('update', function(cmp: Component) { 
        base.set(cmp.value()) 
    })
    sheet.get('M_av').on('update', function(cmp: Component) { 
        av.set(cmp.value()) 
    }) 
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