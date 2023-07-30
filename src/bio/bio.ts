import { setupRepeater } from "../utils/repeaters"

export const setupCarrierRepeater = function(sheet: Sheet<CharData>) {
    const repeater = sheet.get("carrier_repeater")
    setupRepeater(repeater, function(entry) {
        if(entry.find("custom_class_checkbox").value() === true) {
            entry.find("ancienne_carriere_name").show()
            entry.find("ancienne_carriere").hide()
            entry.find("choice_class_label").show()
            entry.find("custom_class_label").hide()
        } else {
            entry.find("ancienne_carriere_name").value(Tables.get("carriere").get(entry.find("ancienne_carriere").value()).name)
        }
        
        
        entry.find("ancienne_carriere").on("update", function(cmp) {
            entry.find("ancienne_carriere_name").value(Tables.get("carriere").get(cmp.value()).name)
        })
        entry.find("custom_class_label").on("click", function(cmp: Component<null>) {
            cmp.hide()
            entry.find("choice_class_label").show()
            entry.find("ancienne_carriere").hide()
            entry.find("ancienne_carriere_name").show()
            entry.find("custom_class_checkbox").value(true)
        })
        entry.find("choice_class_label").on("click", function(cmp: Component<null>) {
            cmp.hide()
            entry.find("custom_class_label").show()
            entry.find("ancienne_carriere").show()
            entry.find("ancienne_carriere_name").hide()
            entry.find("custom_class_checkbox").value(false)
        })
    })
}