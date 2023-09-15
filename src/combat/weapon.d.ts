interface WeaponEditView {
    find(s: "type_arme"): Component<"1" | "2">,
    find(s: "type_arme_as_int"): Component<1 | 2>,
    find(s: "nom_arme"): Component<string>,
    find(s: "group_arme"): Component<string | null>,
    find(s: "group_arme_exists"): Component<0 |1>,
    find(s: "degats"): Component<number>,
    find(s: "qualite"): ChoiceComponent<Quality>,
    find(s: "non_standard_quality"): ChoiceComponent<0 | 1>,
    find(s: "disponibilite"): ChoiceComponent<string>,
    find(s: "cout"): Component<number>,
    find(s: "encombrement"): Component<number>,
    find(s: "portee_courte"): Component<number>,
    find(s: "portee_longue"): Component<number>,
    find(s: "rechargement"): Component<string>,
    find(s: "type_munition"): ChoiceComponent<string>,
    find(s: "use_powder"): Component<boolean>,
    find(s: "attributs"): ChoiceComponent<string[]>,
    find(s: "has_attributes"): Component<0 | 1>,
    find(s: "attributes_input"): Component<string>,
    find(s: "notes"): Component<string>,
    find(s: "bonus_bf"): Component<boolean>,
    find(s: "bonus_bf_as_int"): Component<0 | 1>,
    find(s: "demi"): Component<null>,
}

interface WeaponDisplayView {
    find(s: "left_behind"): Component<boolean>,
    find(s: "toggle_on"): Component<null>,
    find(s: "toggle_off"): Component<null>,
    find(s: "main_row"): Component<null>,
    find(s: "degats_row"): Component<null>,
    find(s: "notes_row"): Component<null>,
    find(s: "weapon_name"): Component<null>,        
    find(s: "bind_weapon"): Component<null>
}

type WeaponData = {
    type_arme: "1" | "2",
    type_arme_as_int: 1 | 2,
    nom_arme: string,
    groupe_arme?: string,
    groupe_arme_exists: 0 | 1,
    degats: number,
    qualite: Quality,
    non_standard_quality: 0 | 1,
    disponibilite: string,
    cout: number,
    encombrement: number,
    portee_courte: number,
    portee_longue: number,
    rechargement: string
    type_munition: string,
    use_powder: boolean,
    attributs: string[],
    has_attributes: 0 | 1,
    attributes_input: string,
    notes: string,
    bonus_bf: boolean,
    bonus_bf_as_int: 0 | 1,
    left_behind?: boolean
}

interface WeaponCraftSheet extends WeaponEditView, ExtendedSheet<WeaponData> {}
interface WeaponEditEntry extends WeaponEditView, Component<WeaponData> {}
interface WeaponDisplayEntry extends WeaponDisplayView, Component<WeaponData> {}

