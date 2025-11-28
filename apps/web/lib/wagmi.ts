import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import { sepolia, polygonAmoy, optimismSepolia } from "wagmi/chains";

const projectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "demo-walletconnect-id";

export const config = getDefaultConfig({
  appName: "DramaForge",
  projectId,
  chains: [sepolia, polygonAmoy, optimismSepolia],
  ssr: true,
  transports: {
    [sepolia.id]: http(),
    [polygonAmoy.id]: http(),
    [optimismSepolia.id]: http()
  }
});
