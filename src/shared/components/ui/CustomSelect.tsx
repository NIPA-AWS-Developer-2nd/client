import React, { useState, useRef, useEffect } from "react";
import styled, { css } from "styled-components";

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  options: Option[];
  placeholder?: string;
  onChange: (value: string) => void;
  $isMobile?: boolean;
  disabled?: boolean;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  options,
  placeholder = "선택해주세요",
  onChange,
  $isMobile = false,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const selectRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = options.find((option) => option.value === value);

  const handleToggle = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchTerm("");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      selectRef.current &&
      !selectRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
      setSearchTerm("");
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <SelectContainer ref={selectRef} $isMobile={$isMobile}>
      <SelectButton
        onClick={handleToggle}
        $isOpen={isOpen}
        $hasValue={!!value}
        $isMobile={$isMobile}
        $disabled={disabled}
      >
        <ButtonContent>
          {selectedOption ? selectedOption.label : placeholder}
        </ButtonContent>
        <ArrowIcon $isOpen={isOpen}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M4 6L8 10L12 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </ArrowIcon>
      </SelectButton>

      {isOpen && (
        <DropdownContainer $isMobile={$isMobile}>
          {options.length > 10 && (
            <SearchInput
              ref={inputRef}
              type="text"
              placeholder="검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              $isMobile={$isMobile}
            />
          )}
          <OptionsList $isMobile={$isMobile}>
            {filteredOptions.map((option) => (
              <OptionItem
                key={option.value}
                onClick={() => handleOptionClick(option.value)}
                $isSelected={option.value === value}
                $isMobile={$isMobile}
              >
                {option.label}
              </OptionItem>
            ))}
            {filteredOptions.length === 0 && (
              <NoResults $isMobile={$isMobile}>검색 결과가 없습니다</NoResults>
            )}
          </OptionsList>
        </DropdownContainer>
      )}
    </SelectContainer>
  );
};

const SelectContainer = styled.div<{ $isMobile: boolean }>`
  position: relative;
  width: 100%;
`;

const SelectButton = styled.button<{
  $isOpen: boolean;
  $hasValue: boolean;
  $isMobile: boolean;
  $disabled: boolean;
}>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ $isMobile }) => ($isMobile ? "12px 14px" : "14px 16px")};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.input};
  color: ${({ $hasValue, theme }) =>
    $hasValue ? theme.colors.text.primary : theme.colors.text.placeholder};
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "15px")};
  transition: ${({ theme }) => theme.transitions.fast};
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};

  &:hover {
    ${({ $disabled, theme }) =>
      !$disabled &&
      css`
        border-color: ${theme.colors.primary};
      `}
  }

  &:focus {
    outline: none;
    ${({ $disabled, theme }) =>
      !$disabled &&
      css`
        border-color: ${theme.colors.primary};
        box-shadow: 0 0 0 3px ${theme.colors.primary}20;
      `}
  }

  ${({ $isOpen, theme }) =>
    $isOpen &&
    css`
      border-color: ${theme.colors.primary};
      box-shadow: 0 0 0 3px ${theme.colors.primary}20;
    `}
`;

const ButtonContent = styled.span`
  flex: 1;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ArrowIcon = styled.div<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
  color: ${({ theme }) => theme.colors.text.secondary};
  transition: ${({ theme }) => theme.transitions.fast};
  transform: ${({ $isOpen }) => ($isOpen ? "rotate(180deg)" : "rotate(0deg)")};
`;

const DropdownContainer = styled.div<{ $isMobile: boolean }>`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  z-index: 10000;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  overflow: hidden;
  max-height: ${({ $isMobile }) => ($isMobile ? "240px" : "280px")};
`;

const SearchInput = styled.input<{ $isMobile: boolean }>`
  width: 100%;
  padding: ${({ $isMobile }) => ($isMobile ? "8px 12px" : "10px 14px")};
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.input};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ $isMobile }) => ($isMobile ? "13px" : "14px")};
  outline: none;

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.placeholder};
  }

  &:focus {
    background: ${({ theme }) => theme.colors.surface};
  }
`;

const OptionsList = styled.div<{ $isMobile: boolean }>`
  max-height: ${({ $isMobile }) => ($isMobile ? "200px" : "240px")};
  overflow-y: auto;

  /* 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.gray100};
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.gray300};
    border-radius: 3px;

    &:hover {
      background: ${({ theme }) => theme.colors.gray400};
    }
  }
`;

const OptionItem = styled.div<{ $isSelected: boolean; $isMobile: boolean }>`
  padding: ${({ $isMobile }) => ($isMobile ? "10px 14px" : "12px 16px")};
  font-size: ${({ $isMobile }) => ($isMobile ? "14px" : "15px")};
  color: ${({ $isSelected, theme }) =>
    $isSelected ? theme.colors.primary : theme.colors.text.primary};
  background: ${({ $isSelected, theme }) =>
    $isSelected ? theme.colors.gray200 : "transparent"};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.gray200};
    color: ${({ theme }) => theme.colors.primary};
  }

  &:active {
    background: ${({ theme }) => theme.colors.gray300};
  }
`;

const NoResults = styled.div<{ $isMobile: boolean }>`
  padding: ${({ $isMobile }) => ($isMobile ? "16px 14px" : "20px 16px")};
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ $isMobile }) => ($isMobile ? "13px" : "14px")};
`;
