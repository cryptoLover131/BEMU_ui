import {
	TwitterIcon,
	TelegramIcon,
	// RedditIcon,
	// InstagramIcon,
	// GithubIcon,
	ResourcesIcon,
	DiscordIcon,
	// MediumIcon,
	// YoutubeIcon,
} from "components/Svg";

export const MENU_HEIGHT = 56;
export const MOBILE_MENU_HEIGHT = 44;
export const TOP_BANNER_HEIGHT = 70;
export const TOP_BANNER_HEIGHT_MOBILE = 84;
export const SIDEBAR_WIDTH_FULL = 260;
export const SIDEBAR_WIDTH_REDUCED = 54;

export const socials = [
	{
		label: "Twitter",
		icon: TwitterIcon,
		href: "https://twitter.com",
	},
	{
		label: "Telegram",
		icon: TelegramIcon,
		href: "https://t.me"
	},
	// {
	//   label: "Github",
	//   icon: GithubIcon,
	//   href: "/",
	// },
	{
		label: "Discord",
		icon: DiscordIcon,
		href: "https://discord.com/invite/",
	},
	// {
	//   label: "Medium",
	//   icon: MediumIcon,
	//   href: "https://medium.com",
	// },
	{
		label: "Docs",
		icon: ResourcesIcon,
		href: "https://docs.noiexchange.net",
	},
];