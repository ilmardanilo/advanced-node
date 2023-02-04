export interface ChangeProfilePicture {
  perform: (
    params: ChangeProfilePicture.Params,
  ) => Promise<ChangeProfilePicture.Result>;
}

export namespace ChangeProfilePicture {
  export type Params = {
    id: string;
    file?: { buffer: Buffer; mimeType: string };
  };

  export type Result = { pictureUrl?: string; initials?: string };
}
