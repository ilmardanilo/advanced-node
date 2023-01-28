import { UserProfile } from '../../../src/domain/entities';

describe('UserProfile', () => {
  let sut: UserProfile;

  beforeEach(() => {
    sut = new UserProfile('any_id');
  });

  it('Should create with empty initials when pictureUrl is provided', () => {
    sut.setPicture({ pictureUrl: 'any_url', name: 'any_name' });

    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: 'any_url',
      initials: undefined,
    });
  });

  it('Should create with empty initials when pictureUrl is provided', () => {
    sut.setPicture({ pictureUrl: 'any_url' });

    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: 'any_url',
      initials: undefined,
    });
  });

  it('Should create initials with first letter of first and last names', () => {
    sut.setPicture({ name: 'alícia barbosa lima' });

    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: undefined,
      initials: 'AL',
    });
  });

  it('Should create initials with first two letters of first name', () => {
    sut.setPicture({ name: 'ilmar' });

    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: undefined,
      initials: 'IL',
    });
  });

  it('Should create initials with first letter', () => {
    sut.setPicture({ name: 'm' });

    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: undefined,
      initials: 'M',
    });
  });

  it('Should create with empty initials when name and pictureUrl are not provided', () => {
    sut.setPicture({});

    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: undefined,
      initials: undefined,
    });
  });

  it('Should create with empty initials when name and pictureUrl are not provided', () => {
    sut.setPicture({ name: '' });

    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: undefined,
      initials: undefined,
    });
  });
});
