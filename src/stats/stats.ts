import { roll } from "../roll/rollHandler"
import { computed, signal } from "../utils/utils"


export function setStatListeners(wSheet: WarhammerSheet, stat: Stat) {

    const base = signal(wSheet.find(stat + "_base").value() as number);
    const av = signal(wSheet.find(stat + "_av").value() as number);
    if(stat !== 'Ag') {
        wSheet.statSignals[stat] = computed(function() { return base() + av() }, [base, av]);
    } else {
        wSheet.statSignals[stat] = computed(function() {
            if(wSheet.armorLevel() === "Mailles" || wSheet.armorLevel() === "Plaques") {
                wSheet.find(stat).addClass("text-danger")
                wSheet.find(stat).text((base() + av() - 10).toString())
                return base() + av() - 10
            }
            wSheet.find(stat).removeClass("text-danger")
            wSheet.find(stat).text((base() + av()).toString())
            return base() + av()  }, [base, av, wSheet.armorLevel]);
    }
    wSheet.find(stat + '_base').on('update', function(cmp: Component) { 
        base.set(cmp.value()) 
    })
    wSheet.find(stat + '_av').on('update', function(cmp: Component) { 
        av.set(cmp.value()) 
    }) 
    wSheet.find(stat + "_label").on('click', function() { 
        roll(wSheet.raw(), stat, wSheet.statSignals[stat](), []) 
    })
    
}

export function setBonuses(wSheet: WarhammerSheet) {
    wSheet.statSignals['BE'] = computed(function() { 
        const value = Math.floor((wSheet.statSignals['E']()) / 10)
        wSheet.find("BE_base").text(value.toString())
        wSheet.find("BE").value(value)
        wSheet.find("BE_reminder").text("BE : " + value)
        return value
    }, [wSheet.statSignals['E']] )
    wSheet.statSignals['BF'] = computed(function() {
        const value = Math.floor((wSheet.statSignals['F']()) / 10)
        wSheet.find("BF_base").text(value.toString()) 
        wSheet.find("BF").value(value)
        return value
    }, [wSheet.statSignals['F']] )   
}

export function setMagSignal(wSheet: WarhammerSheet) {
    const base = signal(wSheet.find("Mag_base").value() as number)
    const av = signal(wSheet.find("Mag_av").value() as number)
    wSheet.statSignals["Mag"] = computed(function() { return base() + av() }, [base, av])
    wSheet.find('Mag_base').on('update', function(cmp: Component) { 
        base.set(cmp.value()) 
    })
    wSheet.find('Mag_av').on('update', function(cmp: Component) { 
        av.set(cmp.value()) 
    }) 
}

export function setMSignal(wSheet: WarhammerSheet) {
    const base = signal(wSheet.find("M_base").value() as number)
    const av = signal(wSheet.find("M_av").value() as number)
    wSheet.statSignals["M"] = computed(function() { return base() + av() }, [base, av])
    wSheet.find('M_base').on('update', function(cmp: Component) { 
        base.set(cmp.value()) 
    })
    wSheet.find('M_av').on('update', function(cmp: Component) { 
        av.set(cmp.value()) 
    }) 
}

export function setBStatListener(wSheet: WarhammerSheet) {
    const base = signal(wSheet.find("B_base").value() as number);
    const av = signal(wSheet.find("B_av").value() as number);
    wSheet.statSignals['B'] = computed(function() { return base() + av() }, [base, av]);
    wSheet.find('B_base').on('update', function(cmp: Component) { 
        base.set(cmp.value()) 
    })
    wSheet.find('B_av').on('update', function(cmp: Component) { 
        av.set(cmp.value()) 
    })
}

export function setPDStatListener(wSheet: WarhammerSheet) {
    wSheet.statSignals['PD'] = signal(wSheet.find("PD_base").value() as number)
    wSheet.find('PD_base').on('update', function(cmp: Component) { 
        (wSheet.statSignals['PD'] as Signal<number>).set(cmp.value()) 
    })
}