import * as faker from 'faker';
import { ISector } from '../models/organizational/sector.model';

const createSector = () => {
    const sector: ISector = {
        sectorId: faker.random.number(4000),
        sectorName: faker.random.words(1)
    };
    return sector;

}

export const generateSectors = () => {
    let sectors: ISector[] = [];
    for(let i = 0; i <= 10; i++) {
        sectors.push(createSector());
    }
    return sectors;
}
