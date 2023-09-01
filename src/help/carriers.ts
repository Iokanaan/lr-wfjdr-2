export const setCarrierInfoListener = function(sheet: Sheet) {

    let displayedCarrier = Tables.get("carriere").get(sheet.get("display_carriere").value() as string)

    // Set des affichage de la carrière
    if(displayedCarrier !== null) {
        displayCarrier(sheet, displayedCarrier)
    }
    
    // Déclencher le changement de carrière a afficher à l'update
    sheet.get("display_carriere").on("update", function(cmp: Component<string>) {
        displayCarrier(sheet, Tables.get("carriere").get(cmp.value()))
    })
}

export const switchCarrier = function(sheet: Sheet<CharData>, newCarrier: Carriere) {
    // Set de la valeur du choice component, déclenchera la fonction d'update
    sheet.get("display_carriere").value(newCarrier.id)
}

const displayCarrier = function(sheet: Sheet, carrier: Carriere) {
    sheet.get("CC_carr").text(carrier.CC !== '' ? carrier.CC : '-')
    sheet.get("CT_carr").text(carrier.CT !== '' ? carrier.CT : '-')
    sheet.get("F_carr").text(carrier.F !== '' ? carrier.F : '-')
    sheet.get("E_carr").text(carrier.E !== '' ? carrier.E : '-')
    sheet.get("Ag_carr").text(carrier.Ag !== '' ? carrier.Ag : '-')
    sheet.get("Int_carr").text(carrier.Int !== '' ? carrier.Int : '-')
    sheet.get("FM_carr").text(carrier.FM !== '' ? carrier.FM : '-')
    sheet.get("Soc_carr").text(carrier.Soc !== '' ? carrier.Soc : '-')
    sheet.get("A_carr").text(carrier.A !== '' ? carrier.A : '-')
    sheet.get("B_carr").text(carrier.B !== '' ? carrier.B : '-')
    sheet.get("Mag_carr").text(carrier.Mag !== '' ? carrier.Mag : '-')
    sheet.get("M_carr").text(carrier.M !== '' ? carrier.M : '-')
    sheet.get("acces_carr").text(carrier.acces !== '' ? carrier.acces : 'Aucun')
    sheet.get("debouches_carr").text(carrier.debouche !== '' ? carrier.debouche : 'Aucun')
    sheet.get("comp_carr").text(carrier.competences !== '' ? carrier.competences : 'Aucunes')
    sheet.get("talents_carr").text(carrier.talents !== '' ? carrier.talents : 'Aucunes')
}