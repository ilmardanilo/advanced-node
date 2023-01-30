import { InvalidMimeTypeError } from '../../../src/application/errors';

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

describe('AllowedMimeTypes', () => {
  it('should return InvalidMimeTypeError if value is invalid', () => {
    const sut = new AllowedMimeTypes(['png'], 'image/jpg');

    const error = sut.validate();

    expect(error).toEqual(new InvalidMimeTypeError(['png']));
  });

  it('should return undefined if value is valid', () => {
    const sut = new AllowedMimeTypes(['png'], 'image/png');

    const error = sut.validate();

    expect(error).toBeUndefined();
  });

  it('should return undefined if value is valid', () => {
    const sut = new AllowedMimeTypes(['jpg'], 'image/jpg');

    const error = sut.validate();

    expect(error).toBeUndefined();
  });

  it('should return undefined if value is valid', () => {
    const sut = new AllowedMimeTypes(['jpg'], 'image/jpeg');

    const error = sut.validate();

    expect(error).toBeUndefined();
  });
});
