// It was
//*******************************************************************          
          if (this.domType === 'refuse') {
            dataforDomain = {
              domType: this.domType,
              tarifId: tarif.id,
              term: tarif.term
            };
          } else {
            dataforDomain = {
              domain: this.domain, domType: this.domType,
              tarifId: tarif.id, domainTarifId: this.selectedDomType.id,
              term: tarif.term
            };
          }
//*******************************************************************          
// has become
dataforDomain = 
    this.domType === 'refuse' ? 
    // added methods to retrun object
       this.retDomTypeRefuse(this.domType, tarif) : 
       this.retDomTypeRefuseOther(this.domain, this.domType, tarif, this.selectedDomType);
