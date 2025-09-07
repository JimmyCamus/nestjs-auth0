import { Auth0Service } from "./auth0.service";
import { UnauthorizedException } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { of, throwError } from "rxjs";

const mockOptions = {
  clientId: "test-client-id",
  clientSecret: "test-client-secret",
  domain: "test-domain.auth0.com",
  redirectUri: "http://localhost/callback",
  scope: "openid profile email",
  audience: "https://api.test.com",
};

describe("Auth0Service", () => {
  let service: Auth0Service;
  let httpService: jest.Mocked<HttpService>;

  beforeEach(() => {
    httpService = {
      post: jest.fn(),
      get: jest.fn(),
    } as any;
    service = new Auth0Service(mockOptions, httpService);
  });

  describe("getAuthorizationUrl", () => {
    it("should return a valid authorization URL", async () => {
      const url = await service.getAuthorizationUrl();
      expect(url).toContain(`https://${mockOptions.domain}/authorize?`);
      expect(url).toContain(`client_id=${mockOptions.clientId}`);
      expect(url).toContain(
        `redirect_uri=${encodeURIComponent(mockOptions.redirectUri)}`
      );
      expect(url).toContain(`scope=${mockOptions.scope.replaceAll(" ", "+")}`);
      expect(url).toContain(
        `audience=${encodeURIComponent(mockOptions.audience)}`
      );
      expect(url).toContain(`response_type=code`);
    });
  });

  describe("getAccessToken", () => {
    it("should return access token on success", async () => {
      const mockResponse = { data: { access_token: "test-access-token" } };
      httpService.post.mockReturnValueOnce(of(mockResponse as any));
      const token = await service.getAccessToken("test-code");
      expect(token).toBe("test-access-token");
      expect(httpService.post).toHaveBeenCalledWith(
        expect.stringContaining("/oauth/token"),
        expect.objectContaining({
          client_id: mockOptions.clientId,
          code: "test-code",
        }),
        expect.any(Object)
      );
    });

    it("should throw UnauthorizedException on error", async () => {
      httpService.post.mockReturnValueOnce(throwError(() => new Error("fail")));
      await expect(service.getAccessToken("bad-code")).rejects.toThrow(
        UnauthorizedException
      );
    });
  });

  describe("getUserInfo", () => {
    it("should return user info on success", async () => {
      const mockUser = { sub: "auth0|123", name: "Test User" };
      httpService.get.mockReturnValueOnce(of({ data: mockUser } as any));
      const user = await service.getUserInfo("test-access-token");
      expect(user).toEqual(mockUser);
      expect(httpService.get).toHaveBeenCalledWith(
        expect.stringContaining("/userinfo"),
        expect.objectContaining({
          headers: { Authorization: "Bearer test-access-token" },
        })
      );
    });

    it("should throw UnauthorizedException on error", async () => {
      httpService.get.mockReturnValueOnce(throwError(() => new Error("fail")));
      await expect(service.getUserInfo("bad-token")).rejects.toThrow(
        UnauthorizedException
      );
    });
  });
});
