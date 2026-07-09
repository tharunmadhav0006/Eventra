import React, { useState, useEffect } from "react";
import { 
  Settings as SettingsIcon, 
  Shield, 
  Sparkles, 
  Palette, 
  Link2, 
  Database, 
  Webhook, 
  CheckCircle, 
  Cpu, 
  AlertCircle,
  FileText,
  Activity,
  Trash2,
  RefreshCw
} from "lucide-react";
import { azureApi } from "../lib/azureApi";

export default function Settings() {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [keyVaultSecret, setKeyVaultSecret] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#2563eb");
  const [domainName, setDomainName] = useState("events.cloudtech.in");
  const [azureMonitorActive, setAzureMonitorActive] = useState(true);
  const [appInsightsActive, setAppInsightsActive] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await azureApi.getSettings();
        if (data) {
          setWebhookUrl(data.webhookUrl || "");
          setKeyVaultSecret(data.keyVaultSecretIdentifier || "");
        }
      } catch (err) {
        console.error("Failed to load Azure Settings:", err);
      }
    }
    loadSettings();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      await azureApi.saveSettings({
        webhookUrl,
        keyVaultSecretIdentifier: keyVaultSecret,
        isSaved: true
      });
      setIsSaved(true);
      setMessage({ text: "Configuration updated and synchronized with Azure Key Vault.", type: "success" });
      setTimeout(() => {
        setIsSaved(false);
        setIsLoading(false);
      }, 1500);
    } catch (err) {
      setIsLoading(false);
      setMessage({ text: "Failed to save settings to Azure backend.", type: "error" });
    }
  };

  const handleTruncateDB = async () => {
    if (!window.confirm("Are you sure you want to completely truncate the Azure SQL Database? This will wipe all events, transactions, and audit logs to display clean empty states.")) {
      return;
    }
    setIsLoading(true);
    try {
      const res = await azureApi.clearAzureDatabase();
      setMessage({ text: res.message, type: "success" });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      setIsLoading(false);
      setMessage({ text: "Failed to clear Azure database.", type: "error" });
    }
  };

  const handleSeedDB = async () => {
    setIsLoading(true);
    try {
      const res = await azureApi.seedAzureDatabase();
      setMessage({ text: res.message, type: "success" });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      setIsLoading(false);
      setMessage({ text: "Failed to seed Azure SQL Database.", type: "error" });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Upper Status Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-sans font-bold text-slate-900 dark:text-white tracking-tight">Azure Settings & Core Keys</h1>
        <p className="text-xs font-sans text-slate-500 dark:text-slate-400 mt-1">Configure secure REST API integrations, Azure Blob Containers, webhook payloads, and DNS paths.</p>
      </div>

      {message && (
        <div className={`p-3.5 border rounded-xl flex items-start space-x-2.5 animate-in fade-in duration-200 ${
          message.type === "success" 
            ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/40" 
            : "bg-red-50 text-red-600 border-red-100 dark:bg-red-950/20 dark:border-red-900/40"
        }`}>
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span className="text-xs font-sans font-semibold">{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-6">
        
        {/* Main Grid Layout split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left section: Branding & Design (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Design customization */}
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-6">
              <div className="flex items-center space-x-2.5 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Palette className="w-5 h-5 text-blue-500" />
                <h3 className="font-sans font-bold text-sm text-slate-900 dark:text-white">White-Label Branding</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-sans font-semibold text-slate-500 block mb-1">Company Custom Domain</label>
                  <div className="relative">
                    <Link2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text" 
                      value={domainName}
                      onChange={(e) => setDomainName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-slate-100 border border-slate-200 dark:border-slate-800 text-xs rounded-xl focus:outline-none"
                      placeholder="e.g. events.yourcompany.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-sans font-semibold text-slate-500 block mb-1">Brand Theme Accent Color</label>
                  <div className="flex items-center space-x-2.5">
                    <input 
                      type="color" 
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-10 h-8 border-0 rounded-lg cursor-pointer bg-transparent"
                    />
                    <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 uppercase">{primaryColor}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Azure Secrets & Webhooks */}
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-6">
              <div className="flex items-center space-x-2.5 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Webhook className="w-5 h-5 text-purple-500" />
                <h3 className="font-sans font-bold text-sm text-slate-900 dark:text-white">Azure Key Vault & Webhooks</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-sans font-semibold text-slate-500 block mb-1">Azure Key Vault Stripe Secret Identifier</label>
                  <input 
                    type="text" 
                    value={keyVaultSecret}
                    onChange={(e) => setKeyVaultSecret(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-slate-100 border border-slate-200 dark:border-slate-800 text-xs rounded-xl font-mono"
                    placeholder="https://evt-vault.vault.azure.net/secrets/stripe-secret"
                  />
                </div>
                <div>
                  <label className="text-xs font-sans font-semibold text-slate-500 block mb-1">Stripe Webhook Callback Endpoint</label>
                  <input 
                    type="text" 
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-slate-100 border border-slate-200 dark:border-slate-800 text-xs rounded-xl font-mono"
                    placeholder="https://events.cloudtech.in/api/webhooks/stripe"
                  />
                </div>
              </div>
            </div>

            {/* Azure Database Simulation controls */}
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-6">
              <div className="flex items-center space-x-2.5 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Database className="w-5 h-5 text-emerald-500" />
                <h3 className="font-sans font-bold text-sm text-slate-900 dark:text-white">Azure SQL Database Control Panel</h3>
              </div>
              <p className="text-xs font-sans text-slate-500 leading-relaxed">
                By default, this enterprise workspace loads from empty tables to honor raw production-level guidelines. You can trigger simulated schema truncations or seed standard records below.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={handleTruncateDB}
                  disabled={isLoading}
                  className="w-full sm:w-auto px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Truncate Azure SQL DB (Empty States)</span>
                </button>

                <button
                  type="button"
                  onClick={handleSeedDB}
                  disabled={isLoading}
                  className="w-full sm:w-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 transition-all shadow-md shadow-emerald-500/10"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Seed Azure SQL DB with Live Streams</span>
                </button>
              </div>
            </div>

          </div>

          {/* Right section: System status & saving (1 Col) */}
          <div className="space-y-6">
            
            {/* Save Card */}
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm text-center space-y-4">
              <h3 className="font-sans font-bold text-sm text-slate-900 dark:text-white">Publish Setup</h3>
              <p className="text-[11px] font-sans text-slate-400 dark:text-slate-500 leading-normal">Publishing config locks layouts, updates Azure App Service routing, and syncs vault parameters.</p>

              <button
                type="submit"
                disabled={isSaved || isLoading}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-emerald-600 text-white font-semibold font-sans text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center space-x-1.5"
              >
                {isSaved ? <CheckCircle className="w-4 h-4" /> : <SettingsIcon className="w-4 h-4" />}
                <span>{isSaved ? "Azure Synced!" : "Save Configuration Keys"}</span>
              </button>
            </div>

            {/* Azure Monitor Integration Card */}
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Activity className="w-4.5 h-4.5 text-blue-500" />
                <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">Azure Monitor Pipeline</h3>
              </div>

              <div className="space-y-3.5">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs font-sans text-slate-600 dark:text-slate-400 font-medium">Application Insights Telemetry</span>
                  <input 
                    type="checkbox" 
                    checked={appInsightsActive}
                    onChange={(e) => setAppInsightsActive(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 border-slate-300"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs font-sans text-slate-600 dark:text-slate-400 font-medium">Log Analytics Workspace Stream</span>
                  <input 
                    type="checkbox" 
                    checked={azureMonitorActive}
                    onChange={(e) => setAzureMonitorActive(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 border-slate-300"
                  />
                </label>
              </div>
            </div>

            {/* AI Core pipeline status */}
            <div className="p-6 bg-slate-900 text-white rounded-3xl border border-slate-850 shadow-xl space-y-4">
              <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-350 flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-purple-400" />
                <span>AI Pipeline Registry</span>
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between font-sans border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Azure OpenAI Agent</span>
                  <strong className="text-purple-400 font-mono">gemini-3.5-flash</strong>
                </div>
                <div className="flex justify-between font-sans border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Key Vault Secret Cache</span>
                  <strong className="text-emerald-400 font-mono">Hit (12ms)</strong>
                </div>
                <div className="flex justify-between font-sans pb-1">
                  <span className="text-slate-400">Blob Container Integrity</span>
                  <strong className="text-blue-400">Healthy</strong>
                </div>
              </div>
            </div>

          </div>

        </div>

      </form>

    </div>
  );
}
