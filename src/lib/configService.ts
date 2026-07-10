import dotenv from "dotenv";

// Attempt to load .env file safely. Ignore any failure as Azure App Service has environment variables injected natively.
try {
  dotenv.config();
} catch (e) {
  console.warn("[CONFIG] Unable to load .env file. Relying on container environment variables.");
}

export interface AppConfig {
  port: number;
  nodeEnv: string;
  azureSql: {
    connectionString: string | undefined;
    server: string | undefined;
    database: string | undefined;
    user: string | undefined;
    pass: string | undefined;
  };
  gemini: {
    apiKey: string | undefined;
  };
  isAzureConfigured: boolean;
}

function loadConfig(): AppConfig {
  const port = Number(process.env.PORT) || 8080;
  const nodeEnv = process.env.NODE_ENV || "development";
  const connectionString = process.env.AZURE_SQL_CONNECTION_STRING;
  const server = process.env.AZURE_SQL_SERVER;
  const database = process.env.AZURE_SQL_DATABASE;
  const user = process.env.AZURE_SQL_USER;
  const pass = process.env.AZURE_SQL_PASSWORD;
  const geminiApiKey = process.env.GEMINI_API_KEY;

  const hasSqlCreds = !!(connectionString || (server && database && user && pass));

  console.log("[CONFIG] Loading production configuration...");
  console.log(`[CONFIG] Port: ${port}`);
  console.log(`[CONFIG] Environment: ${nodeEnv}`);
  console.log(`[CONFIG] Azure SQL State: ${hasSqlCreds ? "Credentials Configured" : "NOT Configured (Fallback Active)"}`);
  console.log(`[CONFIG] Gemini State: ${geminiApiKey ? "API Key Configured" : "NOT Configured (Graceful Fallback Active)"}`);

  if (!hasSqlCreds) {
    console.warn("[CONFIG] WARNING: Azure SQL Database credentials are not configured. Falling back to the in-memory enterprise sandbox DB.");
  }
  if (!geminiApiKey) {
    console.warn("[CONFIG] WARNING: GEMINI_API_KEY is not defined. Conversational assistant features will show a fallback placeholder.");
  }

  return {
    port,
    nodeEnv,
    azureSql: {
      connectionString,
      server,
      database,
      user,
      pass,
    },
    gemini: {
      apiKey: geminiApiKey,
    },
    isAzureConfigured: hasSqlCreds,
  };
}

export const configService = {
  get: loadConfig(),
};
