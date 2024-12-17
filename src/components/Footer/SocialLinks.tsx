import React from "react";
import { FlexProps } from "components/Box";
import Flex from "components/Box/Flex";
import Link from "components/Link/Link";
import { socials } from "./config";

const SocialLinks: React.FC<React.PropsWithChildren<FlexProps>> = ({ ...props }) => (
  <Flex {...props} mt="16px" data-theme="dark">
    {socials.map((social, index) => {
      const iconProps = {
        width: `${social.label === "Twitter" ? "17px" : "20px"}`,
        height: `${social.label === "Twitter" ? "17px" : "20px"}`,
        color: "textSubtle",
        style: { cursor: "pointer" },
      };
      const Icon = social.icon;
      const mr = index < socials.length - 1 ? "14px" : 0;
      return (
        <Link external key={social.label} href={social.href} aria-label={social.label} mr={mr}>
          <Icon {...iconProps} />
        </Link>
      );
    })}
  </Flex>
);

export default React.memo(SocialLinks, () => true);
