import {Owner} from '../owners/owner';
import {PetType} from '../pettypes/pettype';
import {Visit} from '../visits/visit';

export interface Pet {
  id: number;
  ownerId: number;
  name: string;
  birthDate: string;
  type: PetType;
  owner: Owner;
  visits: Visit[];
}
