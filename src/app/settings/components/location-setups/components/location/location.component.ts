import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IProvince } from '../../models/province.model';
import { ICity } from '../../models/city.model';
import { LocationService } from '../../services/location.service';

@Component({
    selector: 'app-location',
    templateUrl: './location.component.html',
    styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {
    locationSetupsLoading = false;

    // is add province modal visible
    isAddProvinceModalVisible = false;

    // is add city modal visible
    isAddCityModalVisible = false;

    provincesTableUpdate = new BehaviorSubject<boolean>(false);
    citiesTableUpdate = new BehaviorSubject<boolean>(false);

    provincesList: IProvince[] = [];
    displayProvincesList: IProvince[] = [];

    citiesList: ICity[] = [];
    displayCitiesList: ICity[] = [];

    searchProvinceString: string;
    searchCityString: string;

    constructor(private locationService: LocationService) {}

    ngOnInit(): void {
        this.locationSetupsLoading = true;
        setTimeout(() => {
            this.locationSetupsLoading = false;
        }, 3000);

        this.locationService.getProvinces().subscribe(provinces => {
            this.provincesList = provinces;
            this.displayProvincesList = this.provincesList;
        });

        this.locationService.getCities().subscribe(cities => {
            this.citiesList = cities;
            this.displayCitiesList = this.citiesList;
        });

        this.provincesTableUpdate.subscribe(update => {
            update === true ? this.updateProvincesTable() : '';
        });

        this.citiesTableUpdate.subscribe(update => {
            update === true ? this.updateCitiesTable() : '';
        });
    }

    addProvince() {
        this.isAddProvinceModalVisible = true;
    }

    addCity() {
        this.isAddCityModalVisible = true;
    }

    searchProvinces(value: string) {
        if (value === '' || !value) {
            this.displayProvincesList = this.provincesList;
        }

        this.displayProvincesList = this.provincesList.filter(province => {
            return (
                province.name.toLowerCase().includes(value.toLowerCase()) ||
                province.code.toLowerCase().includes(value.toLowerCase())
            );
        });
    }

    searchCities(value: string) {
        if (value === '' || !value) {
            this.displayCitiesList = this.citiesList;
        }

        this.displayCitiesList = this.citiesList.filter(city => {
            return (
                city.name.toLowerCase().includes(value.toLowerCase()) ||
                city.code.toLowerCase().includes(value.toLowerCase()) ||
                city.province.name.includes(value.toLowerCase())
            );
        });
    }

    updateProvincesTable() {
        this.locationService.getProvinces().subscribe(provinces => {
            this.provincesList = provinces;
            this.displayProvincesList = this.provincesList;
        });
    }

    updateCitiesTable() {
        this.locationService.getCities().subscribe(cities => {
            this.citiesList = cities;
            this.displayCitiesList = this.citiesList;
        });
    }
}
