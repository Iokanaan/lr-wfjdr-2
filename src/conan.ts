import { globalSheets } from "./globals";
import { rollResultHandler } from "./roll/rollHandler";
import { setSkillListeners, setSkillValue } from "./skills/skills";
import { setBeListeners, setBfListeners, setStatListeners } from "./stats/stats";
import { setupWeaponRepeater } from "./weapons/weaponRepeater";

// @ts-ignore
init = function(sheet: Sheet<any>) {
    if (sheet.id() === "main") {
        globalSheets[sheet.getSheetId()] = sheet
        Tables.get("stats").each(function(stat: StatObject) {
            setStatListeners(sheet, stat.id)
            setBeListeners(sheet)
            setBfListeners(sheet)
        })
        Tables.get("skills_basic").each(function(skill) {
            setSkillValue(sheet, skill)
            setSkillListeners(sheet, skill)
        })
        setupWeaponRepeater(sheet)
    }
}

initRoll = rollResultHandler