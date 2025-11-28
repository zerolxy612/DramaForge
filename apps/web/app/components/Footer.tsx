export function Footer() {
  const socialLinks = [
    { name: "Twitter", url: "#" },
    { name: "Discord", url: "#" },
    { name: "GitHub", url: "#" },
  ];

  const links = [
    {
      title: "Product",
      items: ["Features", "Roadmap", "Pricing", "FAQ"]
    },
    {
      title: "Developers",
      items: ["Documentation", "API", "SDK", "GitHub"]
    },
    {
      title: "Company",
      items: ["About", "Blog", "Careers", "Contact"]
    }
  ];

  return (
    <footer className="relative border-t border-white/10 bg-gradient-to-b from-[#0a0b10] to-black">
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_0%,rgba(229,9,20,0.15),transparent_50%)]" />
      
      <div className="relative max-w-6xl mx-auto px-5 sm:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-accent to-red-500 shadow-[0_10px_40px_rgba(229,9,20,0.35)] grid place-items-center text-black font-bold tracking-widest">
                DF
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-white font-semibold">
                  DramaForge
                </p>
                <p className="text-xs text-white/70">
                  Web3 AIGC Drama Platform
                </p>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              链上动态短剧平台，AIGC生成、Agent协作、观众共创。
              每一集都是NFT，每个结局都可铸造。
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  className="h-9 w-9 rounded-full border border-white/20 hover:border-accent hover:bg-accent/10 transition-all duration-300 grid place-items-center text-white/70 hover:text-white text-sm"
                >
                  {social.name[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {links.map((section) => (
            <div key={section.title}>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-[0.2em]">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-white/60 hover:text-white text-sm transition-colors duration-300"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/50 text-sm">
            © 2024 DramaForge. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-white/50 hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-white/50 hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

