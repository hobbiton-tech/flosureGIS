import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore'
import { AngularFireStorage } from '@angular/fire/storage'
import { InsuranceCompany } from '../models/insurance-company.model'
import { first } from 'rxjs/operators';
import { v4 } from 'uuid';
import 'firebase/storage';

@Injectable({
  providedIn: 'root'
})
export class InsuranceCompanyService {
  private insuranceCompaniesCollection: AngularFirestoreCollection<InsuranceCompany>;
  insuranceCompanies: Observable<InsuranceCompany[]>;

  constructor(private firebase: AngularFirestore, private storage: AngularFireStorage) {
    this.insuranceCompaniesCollection = firebase.collection<InsuranceCompany>('insurance_companies');

    this.insuranceCompanies = this.insuranceCompaniesCollection.valueChanges();
      
   }


   //add Insurance company to insurance company collections
   async addInsuranceCompany(insuranceCompany: InsuranceCompany): Promise<void> {
      this.insuranceCompanies
          .pipe(first())
          .subscribe(async insuranceCompanies => {
            insuranceCompany.id = v4();
            insuranceCompany.companyCode = this.generateCompanyCode(insuranceCompany.companyName, insuranceCompanies.length);
            await this.insuranceCompaniesCollection.add(insuranceCompany);
          })
   }

   getInsuranceCompanies(): Observable<InsuranceCompany[]> {
     return this.insuranceCompanies;
   }

   countGenerator(number) {
    if (number<=9999) { number = ("0000"+number).slice(-4); }
    return number;
  }

  generateCompanyCode(companyName: string, totalInsuranceCompanies: number) {
    const company_name = companyName.substring(0,3).toLocaleUpperCase();
    const count = this.countGenerator(totalInsuranceCompanies);
    const today = new Date();
    const year: string = today.getFullYear().toString().substr(-2);

    return (company_name + year + count);
  }
}
