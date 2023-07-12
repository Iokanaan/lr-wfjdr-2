import { globalSheets } from "./globals";
import { rollResultHandler } from "./roll/roll_handler";
import { set_skill_value, set_skill_listeners } from "./skills/skills";
import { set_BE_listeners, set_BF_listeners, set_stat_listeners } from "./stats/stats";
import { setup_weapon_repeater } from "./weapons/weaponRepeater";

// @ts-ignore
init = function(sheet: Sheet<any>) {
    if (sheet.id() === "main") {
        globalSheets[sheet.getSheetId()] = sheet
        Tables.get("stats").each(function(stat: StatObject) {
            set_stat_listeners(sheet, stat.id)
            set_BE_listeners(sheet)
            set_BF_listeners(sheet)
        })
        Tables.get("skills_basic").each(function(skill) {
            set_skill_value(sheet, skill)
            set_skill_listeners(sheet, skill)
        })
        setup_weapon_repeater(sheet)
    }
}

initRoll = rollResultHandler