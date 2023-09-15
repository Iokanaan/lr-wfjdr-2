import { switchCarrier } from "../help/carriers"
import { computed, signal } from "../utils/utils"

export const setupGold = function(wSheet: WarhammerSheet) {
    const enc = wSheet.encombrementRecord()
    const gold = signal(wSheet.find("gold").value() as number)
    const silver = signal(wSheet.find("silver").value() as number)
    const copper = signal(wSheet.find("copper").value() as number)
    wSheet.find("gold").on("update", function(cmp) { gold.set(cmp.value() as number)})
    wSheet.find("silver").on("update", function(cmp) { silver.set(cmp.value() as number)})
    wSheet.find("copper").on("update", function(cmp) { copper.set(cmp.value() as number)})
    const totalMoney = computed(function() { return gold() + silver() + copper()}, [gold, silver, copper])
    computed(function() {
        const enc = wSheet.encombrementRecord()
        enc["gold_enc"] = totalMoney() / 10
        wSheet.encombrementRecord.set(enc)
    }, [totalMoney])

}

export const checkEncombrement = function(wSheet: WarhammerSheet) {
    
    const encMaxCmp = wSheet.find("max_encombrement")
    const encValCmp = wSheet.find("encombrement_total")

    // Calcul de l'encombrement max en fonction de la force
    const encMax = computed(function() {
        let multiplateur = 10
        if(wSheet.race() === "Nain") {
            multiplateur = 20
        }
        if(wSheet.talents().indexOf("animal_de_trait") !== -1) {
            multiplateur = 30
        }
        wSheet.find("max_encombrement").text(" / " + (wSheet.statSignals['F']() * multiplateur).toString())
        return wSheet.statSignals['F']() * multiplateur
    }, [wSheet.statSignals['F'], wSheet.race, wSheet.talents])

    computed(function() {
        encValCmp.text(Math.ceil(wSheet.totalEncombrement()).toString())
    }, [wSheet.totalEncombrement])

    // Adaptation des couleurs en fonction de l'encombrement
    computed(function() {
        let malus = 0
        if(wSheet.totalEncombrement() > encMax()) {
            encValCmp.addClass("text-danger")
            encValCmp.removeClass("text-light")
            encMaxCmp.addClass("text-danger")
            const depassement = wSheet.totalEncombrement() - encMax()
            malus = Math.floor(depassement / 50)
            if(depassement % 50 !== 0) {
                malus++
            }
            malus = Math.min(wSheet.statSignals['M'](), malus)
            wSheet.find("M").addClass("text-danger")
        } else {
            encValCmp.removeClass("text-danger")
            encValCmp.addClass("text-light")
            encMaxCmp.removeClass("text-danger")
            wSheet.find("M").removeClass("text-danger")
        }

        wSheet.find("M").value(wSheet.statSignals['M']() - malus)

    }, [wSheet.statSignals['M'], encMax, wSheet.totalEncombrement])
}



export const setSleepListener = function(wSheet: WarhammerSheet) {

    // Comme on a besoin de la fortune max pour le sommeil, on déclare le computed ici
    const maxFortune = computed(function() {
        let max = wSheet.statSignals["PD"]()
        if(wSheet.talents().indexOf("chance") !== -1) {
            max++
        }
        wSheet.find("max_fortune").text(" / " + max)
        return max
    }, [wSheet.statSignals["PD"], wSheet.talents])

    // Click sur le bouton sommeil
    wSheet.find("sleep").on("click", function() {

        // On donne un PV si le personnage n'est pas gravement blessé
        if(wSheet.statSignals["B_actuel"]() > 3 && wSheet.statSignals["B_actuel"]() <  (wSheet.statSignals['B']() as number)) {
            wSheet.statSignals["B_actuel"].set(wSheet.statSignals["B_actuel"]() + 1)
            wSheet.find("B_actuel").value(wSheet.statSignals["B_actuel"]())
        }

        // On restaure les points de fortune
        wSheet.find("fortune_actuel").value(maxFortune())
    })
}

export const setRaceEditor = function(whSheet: WarhammerSheet) {

    const raceCmp = whSheet.raw().get("race")
    const raceTextCmp = whSheet.raw().get("race_txt")
    const raceLabelCmp = whSheet.raw().get("race_label")
    const customRaceCmp = whSheet.raw().get("custom_race") as Component<string>

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
        whSheet.race.set(cmp.value())
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

export const setClassEditor = function(wSheet: WarhammerSheet) {

    const classCmp = wSheet.find("class") as Component<string>
    const classTextCmp = wSheet.find("class_txt")
    const classLabelCmp = wSheet.find("class_label")
    const customClassCmp = wSheet.find("custom_class") as Component<string>

    // Mode liste déroulante
    classTextCmp.on("click", function() {
        classTextCmp.hide()
        classCmp.show()
    })

    // Au changement dans la liste déroulante, on mets à jour l'input sous-jacent
    classCmp.on("update", function(cmp: Component<string>) {
        const newCarrier = Tables.get("carriere").get(cmp.value())
        customClassCmp.value(newCarrier.name)
        switchCarrier(wSheet, newCarrier)
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
export const setInitiativeListener = function(wSheet: WarhammerSheet) {
    wSheet.find("init_roll").on("click", function() {
        const builder = new RollBuilder(wSheet.raw())
        builder.expression("(1d10 + " + wSheet.find("Ag").value() + ")[initiative]")
        builder.title("Initiative")
        builder.roll()
    })
}


export const setBlessuresListener = function(wSheet: WarhammerSheet) {

    const bActuelCmp = wSheet.find("B_actuel")
    const bMaxCmp = wSheet.find("b_max")

    // Signal des blessures actuelles
    wSheet.statSignals["B_actuel"] = signal(wSheet.find("B_actuel").value() as number)

    // Adaptation de la couleur en fonction des blessures
    computed(function() {
        // Si blessures <= 3 affichage du texte en rouge
        if(wSheet.statSignals["B_actuel"]() <= 3) {
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
    }, [wSheet.statSignals["B_actuel"]])

    // Mise à jour du signal à l'update de l'input
    bActuelCmp.on("update", function(cmp: Component) { 
        wSheet.statSignals["B_actuel"].set(cmp.value()) 
    })
}