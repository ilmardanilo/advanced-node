export interface SaveUserPictureRepository {
  savePicture: (params: SaveUserPictureRepository.Params) => Promise<void>;
}

export namespace SaveUserPictureRepository {
  export type Params = { pictureUrl: string };
}
