
export const switchCarrier = function(sheet: Sheet<CharData>, newValue: string) {
    const carr = Tables.get("carriere").get(newValue)
    sheet.get("display_carriere").value(carr.id)
    displayCarrier(sheet, carr)
    sheet.get("display_carriere").on("update", function(cmp: Component<string>) {
        const carriere = Tables.get("carriere").get(cmp.value())
        displayCarrier(sheet, carriere)
    })
}


const displayCarrier = function(sheet: Sheet<CharData>, carriere: Carriere) {
    sheet.get("CC_carr").text(carriere.CC !== '' ? carriere.CC : '-')
    sheet.get("CT_carr").text(carriere.CT !== '' ? carriere.CT : '-')
    sheet.get("F_carr").text(carriere.F !== '' ? carriere.F : '-')
    sheet.get("E_carr").text(carriere.E !== '' ? carriere.E : '-')
    sheet.get("Ag_carr").text(carriere.Ag !== '' ? carriere.Ag : '-')
    sheet.get("Int_carr").text(carriere.Int !== '' ? carriere.Int : '-')
    sheet.get("FM_carr").text(carriere.FM !== '' ? carriere.FM : '-')
    sheet.get("Soc_carr").text(carriere.Soc !== '' ? carriere.Soc : '-')
    sheet.get("A_carr").text(carriere.A !== '' ? carriere.A : '-')
    sheet.get("B_carr").text(carriere.B !== '' ? carriere.B : '-')
    sheet.get("Mag_carr").text(carriere.Mag !== '' ? carriere.Mag : '-')
    sheet.get("M_carr").text(carriere.M !== '' ? carriere.M : '-')
    sheet.get("acces_carr").text(carriere.acces !== '' ? carriere.acces : 'Aucun')
    sheet.get("debouches_carr").text(carriere.debouche !== '' ? carriere.debouche : 'Aucun')
    sheet.get("comp_carr").text(carriere.competences !== '' ? carriere.competences : 'Aucunes')
    sheet.get("talents_carr").text(carriere.talents !== '' ? carriere.talents : 'Aucunes')
}