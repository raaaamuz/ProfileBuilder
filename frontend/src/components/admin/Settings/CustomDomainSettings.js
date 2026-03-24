import React, { useState, useEffect } from "react";
import {
  Globe,
  CheckCircle,
  XCircle,
  RefreshCw,
  Copy,
  ExternalLink,
  AlertCircle,
  Trash2,
  Info,
} from "lucide-react";
import api from "../../../services/api";

const CustomDomainSettings = () => {
  const [domainData, setDomainData] = useState(null);
  const [newDomain, setNewDomain] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    fetchDomainConfig();
  }, []);

  const fetchDomainConfig = async () => {
    try {
      setLoading(true);
      const response = await api.get("/profile/custom-domain/");
      setDomainData(response.data);
      if (response.data.domain) {
        setNewDomain(response.data.domain);
      }
    } catch (err) {
      console.error("Error fetching domain config:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDomain = async () => {
    if (!newDomain.trim()) {
      setError("Please enter a domain");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");
      const response = await api.post("/profile/custom-domain/", {
        domain: newDomain.trim().toLowerCase(),
      });
      setDomainData(response.data);
      setSuccess("Domain configured! Please add the DNS records below.");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save domain");
    } finally {
      setSaving(false);
    }
  };

  const handleVerifyDomain = async () => {
    try {
      setVerifying(true);
      setError("");
      setSuccess("");
      const response = await api.post("/profile/custom-domain/verify/");
      if (response.data.success) {
        setSuccess("DNS verification successful! Your domain is now verified.");
        fetchDomainConfig();
      } else {
        setError(response.data.errors?.join(". ") || "Verification failed");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Verification failed");
    } finally {
      setVerifying(false);
    }
  };

  const handleDeleteDomain = async () => {
    if (!window.confirm("Are you sure you want to remove your custom domain?")) {
      return;
    }

    try {
      setSaving(true);
      await api.delete("/profile/custom-domain/");
      setDomainData(null);
      setNewDomain("");
      setSuccess("Custom domain removed");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to remove domain");
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: "bg-yellow-500/20", text: "text-yellow-400", label: "Pending Verification" },
      verified: { bg: "bg-blue-500/20", text: "text-blue-400", label: "DNS Verified" },
      ssl_pending: { bg: "bg-purple-500/20", text: "text-purple-400", label: "SSL Pending" },
      active: { bg: "bg-green-500/20", text: "text-green-400", label: "Active" },
      failed: { bg: "bg-red-500/20", text: "text-red-400", label: "Failed" },
    };
    const badge = badges[status] || badges.pending;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="text-indigo-400" size={24} />
          <h3 className="text-lg font-semibold text-white">Custom Domain</h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="animate-spin text-indigo-400" size={24} />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Globe className="text-indigo-400" size={24} />
          <h3 className="text-lg font-semibold text-white">Custom Domain</h3>
        </div>
        {domainData?.domain && getStatusBadge(domainData.status)}
      </div>

      <p className="text-slate-400 text-sm mb-6">
        Connect your own domain to your portfolio. Your profile will be accessible at your custom domain.
      </p>

      {/* Error/Success Messages */}
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30 flex items-start gap-2">
          <XCircle className="text-red-400 flex-shrink-0 mt-0.5" size={16} />
          <span className="text-red-300 text-sm">{error}</span>
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 rounded-lg bg-green-500/20 border border-green-500/30 flex items-start gap-2">
          <CheckCircle className="text-green-400 flex-shrink-0 mt-0.5" size={16} />
          <span className="text-green-300 text-sm">{success}</span>
        </div>
      )}

      {/* Domain Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Your Domain
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={newDomain}
            onChange={(e) => setNewDomain(e.target.value)}
            placeholder="portfolio.yourdomain.com"
            className="flex-1 px-4 py-2.5 rounded-lg bg-slate-900/50 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            disabled={saving}
          />
          <button
            onClick={handleSaveDomain}
            disabled={saving || !newDomain.trim()}
            className="px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? <RefreshCw className="animate-spin" size={16} /> : null}
            {domainData?.domain ? "Update" : "Save"}
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Enter your domain or subdomain (e.g., portfolio.yourdomain.com or yourdomain.com)
        </p>
      </div>

      {/* DNS Instructions */}
      {domainData?.domain && domainData?.instructions && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-slate-300">
            <Info size={16} />
            <span className="text-sm font-medium">Add these DNS records at your domain registrar (e.g., GoDaddy, Namecheap):</span>
          </div>

          {/* Check if root domain (no subdomain like www or portfolio) */}
          {(() => {
            const domain = domainData.domain;
            const parts = domain.split('.');
            // Root domain has 2 parts (example.com) or is a country TLD with 3 parts (example.co.in)
            const isRootDomain = parts.length === 2 || (parts.length === 3 && parts[1].length <= 3);
            const serverIP = "51.21.169.213";

            return (
              <>
                {/* A Record (for root domains) or CNAME Record (for subdomains) */}
                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-indigo-400 uppercase tracking-wide">
                      {isRootDomain ? "A Record" : "CNAME Record"}
                    </span>
                    <span className="text-xs text-slate-500">
                      {isRootDomain ? "Point your domain to our server" : "Point your domain to our servers"}
                    </span>
                  </div>

                  {isRootDomain && (
                    <div className="mb-3 p-2 rounded bg-yellow-500/10 border border-yellow-500/20">
                      <p className="text-xs text-yellow-300">
                        <strong>Note:</strong> Root domains (like {domain}) require an A record. CNAME is only for subdomains (like www.{domain}).
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-slate-500 block mb-1">Host / Name</label>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 px-3 py-2 rounded bg-slate-800 text-green-400 text-sm font-mono">
                          @
                        </code>
                        <button
                          onClick={() => copyToClipboard("@", "record-host")}
                          className="p-2 rounded hover:bg-slate-700 text-slate-400 hover:text-white"
                        >
                          {copied === "record-host" ? <CheckCircle size={16} className="text-green-400" /> : <Copy size={16} />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 block mb-1">Value / {isRootDomain ? "IP Address" : "Target"}</label>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 px-3 py-2 rounded bg-slate-800 text-green-400 text-sm font-mono">
                          {isRootDomain ? serverIP : "profile2connect.com"}
                        </code>
                        <button
                          onClick={() => copyToClipboard(isRootDomain ? serverIP : "profile2connect.com", "record-value")}
                          className="p-2 rounded hover:bg-slate-700 text-slate-400 hover:text-white"
                        >
                          {copied === "record-value" ? <CheckCircle size={16} className="text-green-400" /> : <Copy size={16} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            );
          })()}

          {/* TXT Record */}
          <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-purple-400 uppercase tracking-wide">
                {domainData.instructions.txt.type} Record
              </span>
              <span className="text-xs text-slate-500">{domainData.instructions.txt.description}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-500 block mb-1">Host / Name</label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-3 py-2 rounded bg-slate-800 text-purple-400 text-sm font-mono truncate">
                    {domainData.instructions.txt.host}
                  </code>
                  <button
                    onClick={() => copyToClipboard(domainData.instructions.txt.host, "txt-host")}
                    className="p-2 rounded hover:bg-slate-700 text-slate-400 hover:text-white"
                  >
                    {copied === "txt-host" ? <CheckCircle size={16} className="text-green-400" /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-500 block mb-1">Value</label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-3 py-2 rounded bg-slate-800 text-purple-400 text-sm font-mono truncate">
                    {domainData.instructions.txt.value}
                  </code>
                  <button
                    onClick={() => copyToClipboard(domainData.instructions.txt.value, "txt-value")}
                    className="p-2 rounded hover:bg-slate-700 text-slate-400 hover:text-white"
                  >
                    {copied === "txt-value" ? <CheckCircle size={16} className="text-green-400" /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Verification Status */}
          <div className="bg-slate-900/30 rounded-lg p-4 border border-slate-700/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {domainData.dns_verified ? (
                  <CheckCircle className="text-green-400" size={20} />
                ) : (
                  <AlertCircle className="text-yellow-400" size={20} />
                )}
                <div>
                  <p className="text-sm font-medium text-white">
                    {domainData.dns_verified ? "DNS Verified" : "Awaiting Verification"}
                  </p>
                  <p className="text-xs text-slate-500">
                    {domainData.dns_verified
                      ? "Your domain is verified and ready"
                      : "Add the DNS records above, then click Verify"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!domainData.dns_verified && (
                  <button
                    onClick={handleVerifyDomain}
                    disabled={verifying}
                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium disabled:opacity-50 flex items-center gap-2"
                  >
                    {verifying ? (
                      <RefreshCw className="animate-spin" size={14} />
                    ) : (
                      <RefreshCw size={14} />
                    )}
                    Verify DNS
                  </button>
                )}
                <button
                  onClick={handleDeleteDomain}
                  disabled={saving}
                  className="p-2 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400"
                  title="Remove custom domain"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            {domainData.verification_error && (
              <div className="mt-3 p-2 rounded bg-red-500/10 border border-red-500/20">
                <p className="text-xs text-red-300">{domainData.verification_error}</p>
              </div>
            )}
          </div>

          {/* Active Domain Link */}
          {domainData.status === "active" && (
            <div className="flex items-center justify-between p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-400" size={20} />
                <div>
                  <p className="text-sm font-medium text-green-400">Your domain is live!</p>
                  <a
                    href={`https://${domainData.domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-green-300 hover:underline flex items-center gap-1"
                  >
                    https://{domainData.domain}
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Help Text */}
          <div className="text-xs text-slate-500 space-y-1">
            <p>• DNS changes can take 5-30 minutes (up to 48 hours in some cases)</p>
            <p>• For root domains (example.com): Use <strong className="text-slate-400">A Record</strong> with IP address</p>
            <p>• For subdomains (www.example.com): Use <strong className="text-slate-400">CNAME Record</strong></p>
            <p>• Don't forget to add the <strong className="text-slate-400">TXT Record</strong> for verification</p>
            <p>• Set TTL to "1/2 Hour" or "600 seconds" for faster propagation</p>
            <p>• SSL certificate will be automatically provisioned after verification</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDomainSettings;
