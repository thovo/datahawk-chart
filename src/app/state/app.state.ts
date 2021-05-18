import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { AppActions } from './app.actions';
import { DatasetId } from '../models/dataset-id.enum';
import { ProductRank } from '../models/product-rank.type';
import { BedroomFurnitureBSROverTime } from '../../assets/dataset/BSR/bedroom-furniture.dataset';
import { MattressesAndBoxSpringsBSROverTime } from '../../assets/dataset/BSR/mattresses-and-box-springs.dataset';
import { FurnitureBSROverTime } from '../../assets/dataset/BSR/furniture.dataset';
import * as moment from 'moment';

function getOneWeekOfData(dataset: ProductRank[]): ProductRank[] {
  const limitDate = moment('11/30/2019', 'MM/DD/YYYY').utc(true);

  return dataset.filter((p) => moment(p.date, 'MM/DD/YYYY').isAfter(limitDate));
}

export interface AppStateModel {
  dataset: { [key in DatasetId]: ProductRank[] };
  selectedDatasetId: DatasetId;
}

const defaults: AppStateModel = {
  dataset: {
    [DatasetId.BSR_FURNITURE]: getOneWeekOfData(FurnitureBSROverTime),
    [DatasetId.BSR_BEDROOM_FURNITURE]: getOneWeekOfData(BedroomFurnitureBSROverTime),
    [DatasetId.BSR_MATTRESSES_AND_BOX_SPRINGS]: getOneWeekOfData(MattressesAndBoxSpringsBSROverTime),
  },
  selectedDatasetId: DatasetId.BSR_FURNITURE
}

@State<AppStateModel>({
  name: 'app',
  defaults
})
@Injectable()
export class AppState {
  constructor() {
  }

  @Selector()
  public static selectedDataset(state: AppStateModel): ProductRank[] {
    return state.dataset[state.selectedDatasetId];
  }

  @Selector()
  public static selectedDatasetId(state: AppStateModel): DatasetId {
    return state.selectedDatasetId;
  }

  @Action(AppActions.SelectDataset)
  selectDataset({ patchState }: StateContext<AppStateModel>, { datasetId }: AppActions.SelectDataset) {
    patchState({ selectedDatasetId: datasetId });
  }
}
