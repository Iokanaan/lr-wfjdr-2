import { setupRepeater } from "../utils/repeaters"

export const setupArmorRepeater = function(sheet: Sheet<unknown>) {
    const repeater = sheet.get("armor_repeater") as Component<Record<string, ArmorData>>
    setupRepeater(repeater, setupArmorEditEntry)
    repeater.on('click', function(rep: Component<Record<string, ArmorData>>) {
        wait(100, function() {
           setArmorSchema(sheet, rep)
        })

    })
}

export const setupArmorEditEntry = function(entry: Component<unknown>) {}

export const setArmorSchema = function(sheet: Sheet<CharData>, repeater: Component<Record<string, ArmorData>>) {
    const armure = { "Tête": 0, "Bras": 0, "Corps": 0, "Jambes": 0 }
    each(repeater.value(), function(data: ArmorData) {
        if(data["pts_armure"] !== undefined && data["couverture"] !== undefined) {
            for(let i=0; i<data["couverture"].length; i++) {
                armure[data["couverture"][i]] += data["pts_armure"]
            }
        }
    })
    each(armure, function(pts, zone) {
        switch(zone) {
            case "Tête":
                sheet.get("armure_tete").text(pts.toString())
                break
            case "Bras":
                sheet.get("armure_bras_g").text(pts.toString())
                sheet.get("armure_bras_d").text(pts.toString())
                break
            case "Corps":
                sheet.get("armure_torse").text(pts.toString())
                break
            case "Jambes":
                sheet.get("armure_jambe_g").text(pts.toString())
                sheet.get("armure_jambe_d").text(pts.toString())
                break
        }
    })
}
