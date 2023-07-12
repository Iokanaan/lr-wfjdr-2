//@ts-check

import { AttributeInputName, SkillConcInputName, SkillData, SkillExpInputName } from "./skill/types/skillTypes";
import { WeaponSizeId, WeaponWieldingId, WeaponData } from "./weapon/types/weaponData";

declare global { 

    declare class RollBuilder {
        constructor(sheet: Sheet<any>)
        expression: (s: string) => RollBuilder
        visibility: (s: string) => RollBuilder
        title: (s: string) => RollBuilder
        roll: () => void
    }

    declare class Dice {
        static create: (s: string) => Dice
        tag: (s: string) => Dice
        static roll: (sheet: Sheet<any>, d: Dice, s: string) => void

    }

    declare var getReferences: (sheet: Sheet<any>) => Record<string, string | number>
    declare var init: (sheet: Sheet<any>) => void
    declare var drop: (from: Sheet<any>, to: Sheet<any>) => void
    declare var initRoll: (result: DiceResult, callback: DiceResultCallback) => void
    
    declare const log: (s: any) => void;

    declare const each: <T>(c: Record<string, T>, f: (i: T, eid: string) => void) => void;

    declare const Tables: Table;
        interface Table {
        get(elem: 'skills_basic'): LrObject<SkillBasic>
        get(id: string): LrObject
    }

    declare type StatObject = {
        id: Stat,
        value: Stat
    }

    declare type Stat = "CC" | "CT" | "F" | "E" | "Ag" | "Int" | "FM" | "Soc"

    declare type SkillBasic = {
        id: string,
        name: string,
        stat: Stat,
        cmp_id: string
    }

    interface LrObject<T> {
        each(f:(a: T) => void);
        get(s: string): T;
    }

    interface LrEvent<T> {
        value(): T
    }
    
    interface Component<T = unkown > {
        id(): string
        show():void
        hide(): void
        value():T,
        value(val: T): void
        find(elem: string): Component,
        on(type: string, handler: (event: LrEvent) => void)
        on(type: string, delegate: string, handler: (event: LrEvent) => void)
        index(): string
        removeClass(cl: string)
        text(): string
        text(txt: string)
        sheet(): Sheet<unknown>
    }

    interface ChoiceComponent<T = unknown> extends Component<T> {
        setChoices(data: Record<string, string>)
    }

    interface Sheet<T> {
        id(): string
        getSheetId(): number
        //get(elem: 'weapons'): Component<Record<string, WeaponData>>,
        get(s:string): Component<unknown>;
        setData(data: Partial<T>)
        getData(): T;
        prompt(title: string, sheetId: string, callback: (result: componentData) => void, callbackInit?: (sheet: Sheet) => void)
    }

    type Visibility = 'visible'

    type CharData = Stats

    type DiceResult = {
        allTags: string[]
        all: DiceResult[]
        containsTag(tag: string): boolean
        success: number
        value: number
        title: string
        expression: string
    }

    type DiceResultCallback = (e: string, callback: (sheet: Sheet<unknown>) => void) => void;

    type RepeaterState = 'EDIT' | 'VIEW'

} 

export {}
