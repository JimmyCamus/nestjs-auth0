import {
  Auth0LoginInterceptor,
  Auth0CallbackInterceptor,
} from "./auth0.interceptor";
import { Auth0Service } from "../services/auth0.service";
import { UnauthorizedException } from "@nestjs/common";
import { EMPTY, of } from "rxjs";

describe("Auth0LoginInterceptor", () => {
  let interceptor: Auth0LoginInterceptor;
  let auth0Service: Auth0Service;
  let context: any;

  beforeEach(() => {
    auth0Service = { getAuthorizationUrl: jest.fn() } as any;
    interceptor = new Auth0LoginInterceptor(auth0Service);

    context = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: jest.fn(),
      }),
    };
  });

  it("should redirect to login url and return EMPTY", async () => {
    const mockRes = { redirect: jest.fn() };
    context.switchToHttp().getResponse.mockReturnValue(mockRes);
    (auth0Service.getAuthorizationUrl as jest.Mock).mockResolvedValue(
      "http://login.url"
    );

    const result = await interceptor.intercept(context, {} as any);

    expect(auth0Service.getAuthorizationUrl).toHaveBeenCalled();
    expect(mockRes.redirect).toHaveBeenCalledWith("http://login.url");
    expect(result).toBe(EMPTY);
  });
});

describe("Auth0CallbackInterceptor", () => {
  let interceptor: Auth0CallbackInterceptor;
  let auth0Service: Auth0Service;
  let context: any;
  let next: any;

  beforeEach(() => {
    auth0Service = {
      getAccessToken: jest.fn(),
      getUserInfo: jest.fn(),
    } as any;
    interceptor = new Auth0CallbackInterceptor(auth0Service);

    next = { handle: jest.fn().mockReturnValue(of("handled")) };
    context = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn(),
      }),
    };
  });

  it("should throw UnauthorizedException if code is missing", async () => {
    const req = { query: {} };
    context.switchToHttp().getRequest.mockReturnValue(req);

    await expect(interceptor.intercept(context, next)).rejects.toThrow(
      UnauthorizedException
    );
  });

  it("should set user on request and call next.handle()", async () => {
    const req = { query: { code: "abc123" } };
    context.switchToHttp().getRequest.mockReturnValue(req);

    (auth0Service.getAccessToken as jest.Mock).mockResolvedValue("token");
    (auth0Service.getUserInfo as jest.Mock).mockResolvedValue({ sub: "user1" });

    const result = await interceptor.intercept(context, next);

    expect(auth0Service.getAccessToken).toHaveBeenCalledWith("abc123");
    expect(auth0Service.getUserInfo).toHaveBeenCalledWith("token");
    expect((req as any).user).toEqual({ sub: "user1", access_token: "token" });
    expect(next.handle).toHaveBeenCalled();
    expect(result).toEqual(expect.any(Object));
  });
});
