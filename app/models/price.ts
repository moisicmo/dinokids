/* Price OFFICE MODEL */
export interface PriceModel {
  id : number,
  createdAt : Date,
  updatedAt : Date,
  classesId : number,
  inscriptionPrice : number,
  monthPrice : number,
  state : boolean,
}

/* FORM Price OFFICE MODEL */
export interface FormPriceModel {
  inscriptionPrice : number,
  monthPrice : number,
}

/*FORM Price OFFICE VALIDATIONS */
export interface FormPriceValidations {
  inscriptionPrice: [(value: number) => boolean, string];
  monthPrice: [(value: number) => boolean, string];
}