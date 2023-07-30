import { signals } from "../globals"
import { switchCarrier } from "../help/carriers"
import { computed, signal } from "../utils/utils"

export const setMaxEncombrement = function(sheet: Sheet) {
    const forceSignal = signals['F'] as Computed<number>
    const maxEncLabel = sheet.get("max_encombrement")
    signals["enc_max"] = computed(function() {
        maxEncLabel.text(" / " + (forceSignal() * 10).toString())
        return forceSignal() * 10
    }, [forceSignal])
}

export const checkEncombrement = function(sheet: Sheet) {
    const encMax = signals["enc_max"] as Computed<number>
    const encVal = signal(sheet.get("encombrement_total").value()) as Signal<number>
    const encMaxCmp = sheet.get("max_encombrement")
    const encValCmp = sheet.get("encombrement_total")
    log(encMax())
    computed(function() {
        if(encVal() > encMax()) {
            encValCmp.addClass("text-danger")
            encValCmp.removeClass("text-light")
            encMaxCmp.addClass("text-danger")
        } else {
            encValCmp.removeClass("text-danger")
            encValCmp.addClass("text-light")
            encMaxCmp.removeClass("text-danger")
        }
    }, [encMax, encVal])
    encValCmp.on("update", function(cmp: Component<number>) {log(cmp.value()); encVal.set(cmp.value()) })
}

export const setSleepListener = function(sheet: Sheet) {
    sheet.get("sleep").on("click", function() {
        const bActuel = signals['B_actuel'] as Signal<number> 
        if(bActuel() > 3 && bActuel() <  (signals['B']() as number)) {
            bActuel.set(bActuel() + 1)
            sheet.get("B_actuel").value(bActuel())
        }
        sheet.get("fortune_actuel").value(sheet.get("PD").value())
    })
}

export const setRaceEditor = function(sheet: Sheet) {
    const raceCmp = sheet.get("race")
    const raceTextCmp = sheet.get("race_txt")
    const raceLabelCmp = sheet.get("race_label")
    const customRaceCmp = sheet.get("custom_race")
    const race = signal(raceCmp.value()) as Signal<string>
    
    computed(function() {
        raceCmp.hide()
        customRaceCmp.hide()
        raceTextCmp.text(race())
        raceTextCmp.show()
    }, [race])

    // Mode liste déroulante
    raceTextCmp.on("click", function() {
        raceTextCmp.hide()
        raceCmp.show()
    })
    raceCmp.on("update", function(cmp: Component<string>) {
        const raceObj = Tables.get("races").get(cmp.value())
        if(raceObj !== null) {
            race.set(Tables.get("races").get(cmp.value()).name)
        }
    })

    // Mode custom 
    raceLabelCmp.on("click", function() {
        raceTextCmp.hide()
        raceCmp.hide()
        customRaceCmp.show()
    })
    customRaceCmp.on("update", function(cmp: Component<string>) {
        race.set(cmp.value())
    })
}




export const setClassEditor = function(sheet: Sheet) {
    const classCmp = sheet.get("class")
    const classTextCmp = sheet.get("class_txt")
    const classLabelCmp = sheet.get("class_label")
    const customClassCmp = sheet.get("custom_class")
    const classSignal = signal(classCmp.value()) as Signal<string>
    
    computed(function() {
        classCmp.hide()
        customClassCmp.hide()
        const classObj = Tables.get("carriere").get(classSignal())
        if(classObj !== null) {
            switchCarrier(sheet, classSignal())
            classTextCmp.text(classObj.name)
        } else {
            classTextCmp.text(classSignal())
        } 
        classTextCmp.show()
    }, [classSignal])

    // Mode liste déroulante
    classTextCmp.on("click", function() {
        classTextCmp.hide()
        classCmp.show()
    })
    classCmp.on("update", function(cmp: Component<string>) {
        const raceObj = Tables.get("carriere").get(cmp.value())
        if(raceObj !== null) {
            classSignal.set(Tables.get("carriere").get(cmp.value()).name)
        }
    })

    // Mode custom 
    classLabelCmp.on("click", function() {
        classTextCmp.hide()
        classCmp.hide()
        customClassCmp.show()
    })
    customClassCmp.on("update", function(cmp: Component<string>) {
        classSignal.set(cmp.value())
    })
}

export const setInitiativeListener = function(sheet: Sheet<CharData>) {
    sheet.get("init_roll").on("click", function() {
        const builder = new RollBuilder(sheet)
        builder.expression("(1d10 + " + signals['Ag']() + ")[initiative]")
        builder.title("Initiative")
        builder.roll()
    })
}


export const setBlessuresListener = function(sheet: Sheet<CharData>) {
    const bActuelCmp = sheet.get("B_actuel")
    const bMaxCmp = sheet.get("b_max")
    const bActuel = signal(sheet.get("B_actuel").value())
    signals["B_actuel"] = bActuel
    computed(function() {
        if(bActuel() as number <= 3) {
            bActuelCmp.addClass("text-danger")
            bActuelCmp.removeClass("text-light")
            bMaxCmp.addClass("text-danger")
            bMaxCmp.removeClass("text-light")
        } else {
            bActuelCmp.removeClass("text-danger")
            bActuelCmp.addClass("text-light")
            bMaxCmp.removeClass("text-danger")
            bMaxCmp.addClass("text-light")
        }
    }, [bActuel])
    bActuelCmp.on("update", function(cmp: Component) { bActuel.set(cmp.value()) })
}