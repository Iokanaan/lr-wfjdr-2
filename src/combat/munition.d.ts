type Munition = {
    encombrement: number,
    qte_mun: number,
    type_mun: string,
    notes: string,
    qualite: Quality,
    left_behind?: boolean
}

interface MunitionEditView {
    find(s: "qte_mun"): Component<number>,
    find(s: "qualite"): Component<Quality>,
    find(s: "non_standard_quality"): Component<0 | 1>
}

interface MunitionDisplayView {
    find(s: "main_row"): Component<null>,
    find(s: "notes_row"): Component<null>,
    find(s: "left_behind"): Component<boolean>,
    find(s: "toggle_on"): Component<null>,
    find(s: "toggle_off"): Component<null>,
    find(s: "qte_mun"): Component<number>
}

interface MunitionEditEntry extends MunitionEditView, Component<MunitionData> {}
interface MunitionDisplayEntry extends MunitionDisplayView, Component<MunitionData> {}

