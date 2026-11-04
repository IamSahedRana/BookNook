import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";
import { Icon } from "@/components/shared/icon";
import { CONTACT, NAV_LINKS, SITE_NAME } from "@/lib/constants";
import { Logo } from "./logo";

const SOCIALS = [
  { label: "Facebook", href: "https://facebook.com", Icon: FaFacebookF },
  { label: "Instagram", href: "https://instagram.com", Icon: FaInstagram },
  { label: "LinkedIn", href: "https://linkedin.com", Icon: FaLinkedinIn },
  { label: "X", href: "https://x.com", Icon: FaXTwitter },
];

export function Footer() {
  return (
    <footer className="mt-auto w-full border-t border-white/10 bg-[#111111] px-4 py-12 text-white sm:px-8">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-8 border-b border-white/10 pb-10 md:grid-cols-4">
          <div className="max-w-sm md:col-span-2">
            <div className="mb-3">
              <Logo size="sm" textClassName="text-white" />
            </div>
            
            <div className="flex items-center gap-2.5">
              {SOCIALS.map(({ label, href, Icon: SocialIcon }) => (
                <a  
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex size-9 items-center justify-center rounded-full bg-white/10 text-neutral-300 transition-colors hover:bg-brand hover:text-white"
                >
                  <SocialIcon size={16} />
                </a>
              ))} 
            </div>
          </div>

                <Icon name="mail" size={16} className="text-neutral-500" />
                <a
                  className="transition-colors hover:text-white"
                  href={`mailto:${CONTACT.email}`}
                >
                  {CONTACT.email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Icon name="call" size={16} className="text-neutral-500" />
                <a
                  className="transition-colors hover:text-white"
                  href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
                >
                  {CONTACT.phone}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Icon
                  name="location_on"
                  size={16}
                  className="mt-0.5 text-neutral-500"
                />
                <span>
                  {CONTACT.addressLines[0]}
                  <br />
                  {CONTACT.addressLines[1]}
                </span>
              </li>
            </ul>
          </div>

              <div>
                <h4 className="mb-3 text-sm font-bold text-white">Quick Links</h4>
                <ul className="space-y-2.5 text-sm text-neutral-400">
                  {NAV_LINKS.map((link) => (
                    <li key={link.href}>
                      <Link
                        className="transition-colors hover:text-white"
                        href={link.href}
                      >
                        {link.label}
                      </Link>
                    </li>
    

        <div className="pt-6 text-center text-xs text-neutral-500 sm:text-left">
          <p>
            © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
