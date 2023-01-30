import { InvalidMimeTypeError } from '../errors';

type Extension = 'png' | 'jpg';

export class AllowedMimeTypes {
  constructor(
    private readonly allowed: Extension[],
    private readonly mimeType: string,
  ) {}
  validate(): Error | undefined {
    let isValid = false;

    if (this.isPng()) isValid = true;
    else if (this.isJpg()) isValid = true;

    if (!isValid) return new InvalidMimeTypeError(this.allowed);
  }

  private isPng(): boolean {
    return this.allowed.includes('png') && this.mimeType === 'image/png';
  }

  private isJpg(): boolean {
    return (
      this.allowed.includes('jpg') &&
      (this.mimeType === 'image/jpg' || this.mimeType === 'image/jpeg')
    );
  }
}
