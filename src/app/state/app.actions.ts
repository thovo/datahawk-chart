import { DatasetId } from '../models/dataset-id.enum';

export namespace AppActions {
  export class SelectDataset {
    static readonly type = '[App] select dataset';
    constructor(public datasetId: DatasetId) { }
  }
}
