export const setCarrierInfoListener = function(wSheet: WarhammerSheet) {

    let displayedCarrier = Tables.get("carriere").get(wSheet.find("display_carriere").value() as string)

    // Set des affichage de la carrière
    if(displayedCarrier !== null) {
        displayCarrier(wSheet, displayedCarrier)
    }
    
    // Déclencher le changement de carrière a afficher à l'update
    (wSheet.find("display_carriere") as Component<string>).on("update", function(cmp) {
        displayCarrier(wSheet, Tables.get("carriere").get(cmp.value()))
    })
}

export const switchCarrier = function(wSheet: WarhammerSheet, newCarrier: Carriere) {
    // Set de la valeur du choice component, déclenchera la fonction d'update
    wSheet.find("display_carriere").value(newCarrier.id)
}

const displayCarrier = function(wSheet: WarhammerSheet, carrier: Carriere) {
    wSheet.find("CC_carr").text(carrier.CC !== '' ? carrier.CC : '-')
    wSheet.find("CT_carr").text(carrier.CT !== '' ? carrier.CT : '-')
    wSheet.find("F_carr").text(carrier.F !== '' ? carrier.F : '-')
    wSheet.find("E_carr").text(carrier.E !== '' ? carrier.E : '-')
    wSheet.find("Ag_carr").text(carrier.Ag !== '' ? carrier.Ag : '-')
    wSheet.find("Int_carr").text(carrier.Int !== '' ? carrier.Int : '-')
    wSheet.find("FM_carr").text(carrier.FM !== '' ? carrier.FM : '-')
    wSheet.find("Soc_carr").text(carrier.Soc !== '' ? carrier.Soc : '-')
    wSheet.find("A_carr").text(carrier.A !== '' ? carrier.A : '-')
    wSheet.find("B_carr").text(carrier.B !== '' ? carrier.B : '-')
    wSheet.find("Mag_carr").text(carrier.Mag !== '' ? carrier.Mag : '-')
    wSheet.find("M_carr").text(carrier.M !== '' ? carrier.M : '-')
    wSheet.find("acces_carr").text(carrier.acces !== '' ? carrier.acces : 'Aucun')
    wSheet.find("debouches_carr").text(carrier.debouche !== '' ? carrier.debouche : 'Aucun')
    wSheet.find("comp_carr").text(carrier.competences !== '' ? carrier.competences : 'Aucunes')
    wSheet.find("talents_carr").text(carrier.talents !== '' ? carrier.talents : 'Aucunes')
}