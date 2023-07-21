export const setMaxEncombrement = function(sheet: Sheet<CharData>) {
    sheet.get("max_encombrement").text(" / " + ((sheet.get("F") as Component<number>).value() * 10).toString())
}

export const checkEncombrement = function(sheet: Sheet<CharData>) {
    sheet.get("encombrement_total").on("update", function(cmp: Component<number>) {
        setCheckEncombrement(sheet, cmp)
    })
    setCheckEncombrement(sheet, sheet.get("encombrement_total") as Component<number>)
}

const setCheckEncombrement = function(sheet: Sheet<CharData>, cmp: Component<number>) {
    const maxEncombrement = parseInt(sheet.get("max_encombrement").text().substring(3))
    if(cmp.value() > maxEncombrement) {
        cmp.addClass("text-danger")
        sheet.get("max_encombrement").addClass("text-danger")
    } else {
        cmp.removeClass("text-danger")
        sheet.get("max_encombrement").removeClass("text-danger")
    }
}

export const setSleepListener = function(sheet: Sheet<CharData>) {
    sheet.get("sleep").on("click", function() {
        const blessures = (sheet.get("B_actuel") as Component<number>).value()
        if(blessures > 3 && blessures <  parseInt(sheet.get("B").text())) {
            sheet.get("B_actuel").value(blessures + 1)
        }
        sheet.get("fortune_actuel").value(sheet.get("PD").value())
    })
}

export const setRaceEditor = function(sheet: Sheet<CharData>) {
    sheet.get("race_txt").text((sheet.get("race") as Component<string>).value())
    sheet.get("race_txt").on("click", function(cmp: Component<unknown>) {
        cmp.hide()
        sheet.get("race").show()
    })
    sheet.get("race").on("update", function(cmp: Component<string>) {
        cmp.hide()
        sheet.get("race_txt").text(cmp.value())
        sheet.get("race_txt").show()
    })
}

export const setClassEditor = function(sheet: Sheet<CharData>) {
    sheet.get("class_txt").text((sheet.get("class") as Component<string>).value())
    sheet.get("class_txt").on("click", function(cmp: Component<unknown>) {
        cmp.hide()
        sheet.get("class").show()
    })
    sheet.get("class").on("update", function(cmp: Component<string>) {
        cmp.hide()
        sheet.get("class_txt").text(cmp.value())
        sheet.get("class_txt").show()
    })
}

export const setInitiativeListener = function(sheet: Sheet<CharData>) {
    sheet.get("init_roll").on("click", function() {
        const ag = (sheet.get("Ag") as Component<number>).value()
        const builder = new RollBuilder(sheet);
        builder.expression("(1d10 + " + ag + ")[initiative]")
        builder.title("Initiative")
        builder.roll()
    })
}

export const setBlessuresListener = function(sheet: Sheet<CharData>) {
    const bActuelCmp = sheet.get("B_actuel") as Component<number>
    const bActuel = (sheet.get("B_actuel") as Component<number>).value()
    if(bActuel <= 3) {
        bActuelCmp.addClass("text-danger")
        sheet.get("b_max").addClass("text-danger")
        sheet.get("b_max").removeClass("text-light")
    } else {
        bActuelCmp.removeClass("text-danger")
        sheet.get("b_max").removeClass("text-danger")
        sheet.get("b_max").addClass("text-light")
    }
    sheet.get("B_actuel").on("update", function(cmp: Component<number>) {
        if(cmp.value() <=3) {
            cmp.addClass("text-danger")
            cmp.removeClass("text-light")
            sheet.get("b_max").addClass("text-danger")
        } else {
            cmp.removeClass("text-danger")
            cmp.addClass("text-light")
            sheet.get("b_max").removeClass("text-danger")
        }
    })
}