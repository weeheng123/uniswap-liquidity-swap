import SafeAppsSDK from "@gnosis.pm/safe-apps-sdk";

const opts = {
  allowedDomains: [/gnosis-safe.io/],
};

export const appsSdk = new SafeAppsSDK(opts);
