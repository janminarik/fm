import { INestApplication } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AuthCookieService } from "@repo/fm-auth";
import { AppConfig } from "./config/app.config";

export function configureSwagger(app: INestApplication) {
  const configService = app.get(ConfigService<AppConfig>);
  const appName = configService.get("app.name", { infer: true }) || "API";

  const docName = `${appName} documentation`;

  const jwtCookieService = app.get(AuthCookieService);
  const authCookieName = jwtCookieService.getAccessTokenCookieName();

  const documentBuild = new DocumentBuilder()
    .setTitle(appName)
    .setDescription("Flowmate API")
    .setContact("Jan Minarik", "http://janminarik.sk", "support@janminarik.sk")
    .setVersion("1.0")
    .addServer("/api")
    .addCookieAuth("Authentication", {
      type: "apiKey",
      in: "cookie",
      name: authCookieName,
    })
    .addBearerAuth(
      {
        type: "http",
        scheme: "Bearer",
        bearerFormat: "JWT",
      },
      "Authorization",
    )
    .build();

  const document = SwaggerModule.createDocument(app, documentBuild, {
    deepScanRoutes: true,
    // extraModels: [UpdateAdSpaceReqDto],
  });

  SwaggerModule.setup("docs", app, document, {
    explorer: true,
    customSiteTitle: docName,
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
}
