import * as faker from 'faker';
import { IRelationshipType } from '../models/organizational/relationship-type.model';

const createRelationshipType = () => {
    const relationshipType: IRelationshipType = {
        type: faker.random.words(1),
        description: faker.random.words(3)
    };
    return relationshipType;

}

export const generateRelationshipTypes = () => {
    let relationshipTypes: IRelationshipType[] = [];
    for(let i = 0; i <= 10; i++) {
        relationshipTypes.push(createRelationshipType());
    }
    return relationshipTypes;
}