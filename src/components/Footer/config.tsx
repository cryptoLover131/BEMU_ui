import { FooterLinkType } from "./types";
import {
  TwitterIcon,
  InstagramIcon,
  YoutubeIcon,
} from "../Svg";

export const footerLinks: FooterLinkType[] = [
  {
    label: "About",
    items: [
      {
        label: "Contact",
        href: "https://docs.cyberglow.finance",
      },
      {
        label: "Blog",
        href: "https://medium.com/pancakeswap",
      },
      {
        label: "Community",
        href: "https://docs.cyberglow.finance",
      },
      {
        label: "CAKE",
        href: "https://docs.cyberglow.finance/tokenomics/cgt-token",
      },
      {
        label: "—",
      },
      {
        label: "Online Store",
        href: "https://pancakeswap.creator-spring.com/",
        isHighlighted: true,
      },
    ],
  },
  {
    label: "Help",
    items: [
      {
        label: "Customer",
        href: "Support https://docs.pancakeswap.finance/contact-us/customer-support",
      },
      {
        label: "Troubleshooting",
        href: "https://docs.pancakeswap.finance/help/troubleshooting",
      },
      {
        label: "Guides",
        href: "https://docs.pancakeswap.finance/get-started",
      },
    ],
  },
  {
    label: "Developers",
    items: [
      {
        label: "Github",
        href: "https://github.com/pancakeswap",
      },
      {
        label: "Documentation",
        href: "https://docs.pancakeswap.finance",
      },
      {
        label: "Bug Bounty",
        href: "https://app.gitbook.com/@pancakeswap-1/s/pancakeswap/code/bug-bounty",
      },
      {
        label: "Audits",
        href: "https://docs.pancakeswap.finance/help/faq#is-pancakeswap-safe-has-pancakeswap-been-audited",
      },
      {
        label: "Careers",
        href: "https://docs.pancakeswap.finance/hiring/become-a-chef",
      },
    ],
  },
];

export const socials = [
  {
    label: "Twitter",
    icon: TwitterIcon,
    href: "https://twitter.com/MoonlightF92493",
  },
  // {
  //   label: "Facebook",
  //   icon: FacebookIcon,
  //   href: "https://www.facebook.com/moonlightfinance"
  // },
  {
    label: "Instagram",
    icon: InstagramIcon,
    href: "https://www.instagram.com/moonlightfinance/"
  },
  // {
  //   label: "LinkedIn",
  //   icon: LinkedInIcon,
  //   href: "https://www.linkedin.com/company/moonlightfinance/",
  // },
  // {
  //   label: "Pinterest",
  //   icon: PinterestIcon,
  //   href: "https://www.pinterest.com/moonlightfinance/",
  // },
  {
    label: "Youtube",
    icon: YoutubeIcon,
    href: "https://www.youtube.com/@themoonlightfinance",
  },
  // {
  //   label: "TikTok",
  //   icon: TiktokIcon,
  //   href: "https://www.tiktok.com/@moonlightfinance",
  // },
];
