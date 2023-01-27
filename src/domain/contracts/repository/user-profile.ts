export interface SaveUserPictureRepository {
  savePicture: (params: SaveUserPictureRepository.Params) => Promise<void>;
}

export namespace SaveUserPictureRepository {
  export type Params = { pictureUrl?: string };
}

export interface LoadUserProfileRepository {
  load: (params: LoadUserProfileRepository.Params) => Promise<void>;
}

export namespace LoadUserProfileRepository {
  export type Params = { id: string };
}
