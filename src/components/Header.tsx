import logo from '@/assets/techhelp-logo.png';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <img 
            src={logo} 
            alt="TechHelp Solutions Logo" 
            className="h-12 w-auto object-contain"
          />
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Dashboard de Suporte Técnico
            </h1>
            <p className="text-xs text-muted-foreground sm:text-sm">TechHelp Solutions</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
