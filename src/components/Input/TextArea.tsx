import styled, { DefaultTheme } from "styled-components";
import { InputProps, scales } from "./types";

interface StyledInputProps extends InputProps {
  theme: DefaultTheme;
}

/**
 * Priority: Warning --> Success
 */
const getBoxShadow = ({ isSuccess = false, isWarning = false, theme }: StyledInputProps) => {
  if (isWarning) {
    return theme.shadows.warning;
  }

  if (isSuccess) {
    return theme.shadows.success;
  }

  return theme.shadows.inset;
};

const getHeight = ({ scale = scales.MD }: StyledInputProps) => {
  switch (scale) {
    case scales.SM:
      return "150px";
    case scales.LG:
      return "250px";
    case scales.MD:
    default:
      return "200px";
  }
};

const TextArea = styled.textarea<InputProps>`
  background-color: ${({ theme }) => theme.colors.input};
  border-radius: 8px;
  // box-shadow: ${getBoxShadow};
  color: ${({ theme }) => theme.colors.text};
  display: block;
  font-size: 14px;
  height: ${getHeight};
  outline: 0;
  padding: 10px 16px;
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.input};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSubtle};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.backgroundDisabled};
    box-shadow: none;
    color: ${({ theme }) => theme.colors.textDisabled};
    cursor: not-allowed;
  }

  &:focus:not(:disabled) {
    {/* box-shadow: ${({ theme, isWarning, isSuccess }) => {
      if (isWarning) {
        return theme.shadows.warning;
      }

      if (isSuccess) {
        return theme.shadows.success;
      }
      return theme.shadows.focus;
    }}; */}
    border: 1px solid ${({ theme }) => theme.colors.success};
  }
`;

TextArea.defaultProps = {
  scale: scales.MD,
  isSuccess: false,
  isWarning: false,
};

export default TextArea;
