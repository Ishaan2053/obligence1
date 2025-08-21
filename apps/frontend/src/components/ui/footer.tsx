import React from "react";

type Props = {};

function Footer({}: Props) {
  return (
    <footer className="bg-background mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8 ">
      <div className="space-y-4 flex flex-col sm:items-center sm:justify-between">
        <div className="from-primary/10 via-foreground/65 to-foreground/10 bg-gradient-to-tl bg-clip-text text-center text-4xl tracking-[35px] text-balance text-transparent sm:text-5xl md:text-6xl lg:text-8xl uppercase">
          Obligence
        </div>
        <p className="mt-4 text-center text-sm text-gray-500 lg:mt-0 lg:text-right">
          Copyright &copy; {new Date().getFullYear()}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
