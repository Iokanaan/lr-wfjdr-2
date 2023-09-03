import { signals, totalEncombrement } from "../globals"
import { switchCarrier } from "../help/carriers"
import { computed, signal } from "../utils/utils"

export const checkEncombrement = function(sheet: Sheet) {
    
    const encMaxCmp = sheet.get("max_encombrement")
    const encValCmp = sheet.get("encombrement_total")
    
    // Calcul de l'encombrement max en fonction de la force
    const encMax = computed(function() {
        sheet.get("max_encombrement").text(" / " + (signals['F']() * 10).toString())
        return signals['F']() * 10
    }, [signals['F']])

    computed(function() {
        encValCmp.text(totalEncombrement().toString())
    }, [totalEncombrement])

    // Adaptation des couleurs en fonction de l'encombrement
    computed(function() {
        if(totalEncombrement() > encMax()) {
            encValCmp.addClass("text-danger")
            encValCmp.removeClass("text-light")
            encMaxCmp.addClass("text-danger")
        } else {
            encValCmp.removeClass("text-danger")
            encValCmp.addClass("text-light")
            encMaxCmp.removeClass("text-danger")
        }
    }, [encMax, totalEncombrement])
    encValCmp.on("update", function(cmp: Component<number>) {encVal.set(cmp.value()) })
}

export const setSleepListener = function(sheet: Sheet) {
    // Click sur le bouton sommeil
    sheet.get("sleep").on("click", function() {

        // On donne un PV si le personnage n'est pas gravement blessé
        if(signals["B_actuel"]() > 3 && signals["B_actuel"]() <  (signals['B']() as number)) {
            signals["B_actuel"].set(signals["B_actuel"]() + 1)
            sheet.get("B_actuel").value(signals["B_actuel"]())
        }

        // On restaure les points de fortune
        sheet.get("fortune_actuel").value(sheet.get("PD").value())
    })
}

export const setRaceEditor = function(sheet: Sheet) {

    const raceCmp = sheet.get("race")
    const raceTextCmp = sheet.get("race_txt")
    const raceLabelCmp = sheet.get("race_label")
    const customRaceCmp = sheet.get("custom_race") as Component<string>

    // Mode liste déroulante
    raceTextCmp.on("click", function() {
        raceTextCmp.hide()
        raceCmp.show()
    })

    // Au changement dans la liste déroulante, on mets à jour l'input sous-jacent
    raceCmp.on("update", function(cmp: Component<string>) {
        const raceObj = Tables.get("races").get(cmp.value())
        customRaceCmp.value(raceObj.name)
    })

    // Mode custom 
    raceLabelCmp.on("click", function() {
        raceTextCmp.hide()
        raceCmp.hide()
        customRaceCmp.show()
    })

    // À l'update de l'input on remet le mode textuel
    customRaceCmp.on("update", function(cmp: Component<string>) {
        raceCmp.hide()
        customRaceCmp.hide()
        raceTextCmp.text(cmp.value())
        raceTextCmp.show()
    })

    
    // Race random par défaut
    if(customRaceCmp.value() !== undefined) {
        raceTextCmp.text(customRaceCmp.value())
    } else {
        Tables.get("races").random(function(race) {
            customRaceCmp.value(race.name)
        })
    }
}

export const setClassEditor = function(sheet: Sheet) {

    const classCmp = sheet.get("class")
    const classTextCmp = sheet.get("class_txt")
    const classLabelCmp = sheet.get("class_label")
    const customClassCmp = sheet.get("custom_class") as Component<string>

    // Mode liste déroulante
    classTextCmp.on("click", function() {
        classTextCmp.hide()
        classCmp.show()
    })

    // Au changement dans la liste déroulante, on mets à jour l'input sous-jacent
    classCmp.on("update", function(cmp: Component<string>) {
        const newCarrier = Tables.get("carriere").get(cmp.value())
        customClassCmp.value(newCarrier.name)
        switchCarrier(sheet, newCarrier)
    })

    // Mode custom 
    classLabelCmp.on("click", function() {
        classTextCmp.hide()
        classCmp.hide()
        customClassCmp.show()
    })

    // À l'update de l'input on remet le mode textuel
    customClassCmp.on("update", function(cmp: Component<string>) {
        classCmp.hide()
        customClassCmp.hide()
        classTextCmp.text(cmp.value())
        classTextCmp.show()
    })

    // Carrière random par défaut
    if(customClassCmp.value() !== undefined) {
        classTextCmp.text(customClassCmp.value())
    } else {
        Tables.get("carriere").random(function(carriere) {
            customClassCmp.value(carriere.name)
        })
    }
}

// Initiative
export const setInitiativeListener = function(sheet: Sheet<CharData>) {
    sheet.get("init_roll").on("click", function() {
        const builder = new RollBuilder(sheet)
        builder.expression("(1d10 + " + sheet.get("Ag").value() + ")[initiative]")
        builder.title("Initiative")
        builder.roll()
    })
}


export const setBlessuresListener = function(sheet: Sheet<CharData>) {

    const bActuelCmp = sheet.get("B_actuel")
    const bMaxCmp = sheet.get("b_max")

    // Signal des blessures actuelles
    signals["B_actuel"] = signal(sheet.get("B_actuel").value() as number)

    // Adaptation de la couleur en fonction des blessures
    computed(function() {
        // Si blessures <= 3 affichage du texte en rouge
        if(signals["B_actuel"]() <= 3) {
            bActuelCmp.addClass("text-danger")
            bActuelCmp.removeClass("text-light")
            bMaxCmp.addClass("text-danger")
            bMaxCmp.removeClass("text-light")
        // Sinon blanc
        } else {
            bActuelCmp.removeClass("text-danger")
            bActuelCmp.addClass("text-light")
            bMaxCmp.removeClass("text-danger")
            bMaxCmp.addClass("text-light")
        }
    }, [signals["B_actuel"]])

    // Mise à jour du signal à l'update de l'input
    bActuelCmp.on("update", function(cmp: Component) { 
        signals["B_actuel"].set(cmp.value()) 
    })
}