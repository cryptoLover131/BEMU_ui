import { globalStyle } from "@vanilla-extract/css";
import { vars } from "theme/css/vars.css";

globalStyle("body", {
  backgroundColor: vars.colors.background,
});
