import { adaptExpressRoute } from '../../../src/main/adapters';
import { Controller } from '../../../src/application/controllers';

import { NextFunction, Request, RequestHandler, Response } from 'express';
import { getMockReq, getMockRes } from '@jest-mock/express';
import { mock, MockProxy } from 'jest-mock-extended';

describe('ExpressRouter', () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;
  let controller: MockProxy<Controller>;
  let sut: RequestHandler;

  beforeAll(() => {
    req = getMockReq({
      body: { anyBody: 'any_body' },
      locals: { anyLocals: 'any_locals' },
    });
    res = getMockRes().res;
    next = getMockRes().next;
    controller = mock<Controller>();
    controller.handle.mockResolvedValue({
      statusCode: 200,
      data: { data: 'any_data' },
    });
  });

  beforeEach(() => {
    sut = adaptExpressRoute(controller);
  });

  it('should call handle with correct request', async () => {
    await sut(req, res, next);

    expect(controller.handle).toHaveBeenCalledWith({
      anyBody: 'any_body',
      anyLocals: 'any_locals',
    });
    expect(controller.handle).toHaveBeenCalledTimes(1);
  });

  it('should call handle with empty request', async () => {
    req = getMockReq();

    await sut(req, res, next);

    expect(controller.handle).toHaveBeenCalledWith({});
    expect(controller.handle).toHaveBeenCalledTimes(1);
  });

  it('should respond with 200 and correct data', async () => {
    await sut(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ data: 'any_data' });
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  it('should respond with 204 and empty', async () => {
    controller.handle.mockResolvedValueOnce({
      statusCode: 204,
      data: null,
    });
    await sut(req, res, next);

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith(null);
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  it('should respond with 400 and correct error', async () => {
    controller.handle.mockResolvedValueOnce({
      statusCode: 400,
      data: new Error('any_error'),
    });
    await sut(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ error: 'any_error' });
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  it('should respond with 500 and correct error', async () => {
    controller.handle.mockResolvedValueOnce({
      statusCode: 500,
      data: new Error('any_error'),
    });
    await sut(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ error: 'any_error' });
    expect(res.json).toHaveBeenCalledTimes(1);
  });
});
