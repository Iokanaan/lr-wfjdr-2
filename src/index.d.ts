//@ts-check

import { AttributeInputName, SkillConcInputName, SkillData, SkillExpInputName } from "./skill/types/skillTypes";
import { WeaponSizeId, WeaponWieldingId, WeaponData } from "./weapon/types/weaponData";

declare global { 

    type RollTags = {
        target?: number,
        sheetSource: Sheet<unknown>,
        isAttack: boolean,
        isDamage: boolean,
        isCrit: boolean,
        isPercutante: boolean,
        isEpuisante: boolean,
        referenceRoll: number,
        damageBonus: number,
        isMagic: boolean,
        isVulgaire: boolean,
        isRune: boolean,
        isNoire: boolean
    }
    

    interface Signal<T> {
        (): T;
        set(t:T)
        subscribe(t:Handler<T>): () => void;
    }
    
    interface Computed<T> {
        (): T;
        subscribe(t:Handler<T>): () => void;
    }

    type Handler<T> = (t: T) => void

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
    declare var wait: (ms: number, callback: () => void) => void
    declare var getCriticalHits: (result: DiceResult) => void
    
    declare const log: (s: any) => void;

    declare const each: <T>(c: Record<string, T>, f: (i: T, eid: string) => void) => void;

    declare const Tables: Table;
    interface Table {
        get(elem: 'skills_basic'): LrObject<SkillBasic>
        get(elem: 'races'): LrObject<Race>
        get(elem: 'competences_av'): LrObject<SkillAv>
        get(elem: 'carriere'): LrObject<Carriere>
        get(elem: 'talents'): LrObject<Talent>
        get(elem: 'groupe_armes'): LrObject<GroupeArme>
        get(elem: 'magies_communes' | 'domaines_occultes' | 'sombres_savoirs' | 'domaines_divins'): LrObject<DomaineMagie>
        get(elem: 'magie_mineure'): LrObject<Spell>
        get(id: string): LrObject
    }

    declare const Bindings: Bindings
    interface Bindings {
        add(name: string, cmpId: string, viewId: string, data: () => Object)
        send(sheet: Sheet<CharData>, name: string)
    }


    type DomaineMagie = {
        id: string,
        name: string,
        long_name: string
    }

    declare type Talent = {
        id: string,
        name: string,
        description: string
    }

    declare type Carriere = {
        id: string,
        name: string,
        type: "base" | "avance",
        CC: string,
        CT: string,
        F: string,
        E: string,
        Ag: string,
        Int: string,
        F: string,
        Soc: string,
        FM: string
        A: string,
        B: string,
        M: string,
        Mag: string,
        competences: string,
        talents: string,
        dotations: string,
        acces: string,
        debouche: string
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

    declare type SkillAv = {
        id: string,
        name: string,
        stat: Stat | "variable",
        variable: string
    }

    declare type SkillData = {
        nom: string,
        comp_stat: Stat,
        specialite: string
    }

    interface LrObject<T> {
        each(f:(a: T) => void);
        get(s: string): T;
        random(callback: (val: T) => void)
    }

    interface LrEvent<T> {
        value(): T
    }

    type Quality = "Moyenne" | "Bonne" | "Médiocre" | "Exceptionnelle"

    type WeaponGroup = {
        id: string,
        name: string
    }

    type WeaponData = {
        nom_arme: string,
        groupe_arme: string,
        degats: number,
        disponibilite: string,
        cout: number,
        portee_courte: number,
        portee_longue: number,
        encombrement: number,
        type_munition: string,
        use_powder: booelean
        bonus_bf_as_int: number,
        type_arme: "1" | "2",
        type_arme_as_int: 1 | 2,
        bonus_bf: boolean,
        bonus_bf_as_int: 0 | 1
        qualite: Quality,
        notes: string
        attributs: string[],
        rechargement: string
    }
    
    type ArmorData = {
        pts_armure?: number,
        couverture?: ("Tête" | "Bras" | "Corps" | "Jambes")[],
        enc_armure: number,
        qualite_armure: Quality
    }

    type DomaineObject = {
        id: string,
        name: string,
        long_name: string
    }

    type Item = {
        enc_item: number,
        qte_item: number,
        nom_item: string,
        qualite_item: Quality,
        notes: string
    }

    type Munition = {
        encombrement: number,
        qte_mun: number,
        type_mun: string,
        notes: string,
        qualite: Quality
    }

    type Spell =  {
        id: string,
        name: string,
        difficulte: number
        incantation: string,
        ingredient: string,
        bonus_ingredient: number,
        description: string
    }

    type SpellKnown = Spell & {
        spell_name: string,
        use_ingredient: boolean,
        main_category: string,
        sub_category: string
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
        addClass(cl: string)
        removeClass(cl: string)
        text(): string
        text(txt: string)
        sheet(): Sheet<unknown>
        visible(): boolean
    }

    interface ChoiceComponent<T = unknown> extends Component<T> {
        setChoices(data: Record<string, string>)
    }

    interface Sheet<T = CharData> {
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
        expression: string,
        total: number,
        discarded: boolean
    }

    type DiceResultCallback = (e: string, callback: (sheet: Sheet<unknown>) => void) => void;

    type RepeaterState = 'EDIT' | 'VIEW'

} 

export {}
