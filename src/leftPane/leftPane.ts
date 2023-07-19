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