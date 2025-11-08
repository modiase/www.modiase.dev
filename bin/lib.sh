#!/usr/bin/env bash

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[0;37m'
NC='\033[0m' # No Color

# Center pad text to a fixed width using spaces
_pad_center() {
    local text="$1"
    local width="$2"
    local length=${#text}

    if ((length >= width)); then
        printf "%s" "$text"
        return
    fi

    local padding=$((width - length))
    local left=$((padding / 2))
    local right=$((padding - left))
    local left_pad=""
    local right_pad=""

    printf -v left_pad "%*s" "$left" ""
    printf -v right_pad "%*s" "$right" ""
    printf "%s%s%s" "$left_pad" "$text" "$right_pad"
}

log_info() {
    local msg="$1"
    local label="${2:-main}"
    local padded_label="$(_pad_center "$label" 20)"
    local padded_level="$(_pad_center "info" 7)"
    echo -e "$(date '+%H:%M:%S') | ${CYAN}${padded_label}${NC} | ${WHITE}${padded_level}${NC} | $msg"
}

log_success() {
    local msg="$1"
    local label="${2:-main}"
    local padded_label="$(_pad_center "$label" 20)"
    local padded_level="$(_pad_center "success" 7)"
    echo -e "$(date '+%H:%M:%S') | ${CYAN}${padded_label}${NC} | ${WHITE}${padded_level}${NC} | ${GREEN}$msg${NC}"
}

log_error() {
    local msg="$1"
    local label="${2:-main}"
    local padded_label="$(_pad_center "$label" 20)"
    local padded_level="$(_pad_center "error" 7)"
    echo -e "$(date '+%H:%M:%S') | ${CYAN}${padded_label}${NC} | ${WHITE}${padded_level}${NC} | ${RED}$msg${NC}"
}

log_warn() {
    local msg="$1"
    local label="${2:-main}"
    local padded_label="$(_pad_center "$label" 20)"
    local padded_level="$(_pad_center "warn" 7)"
    echo -e "$(date '+%H:%M:%S') | ${CYAN}${padded_label}${NC} | ${WHITE}${padded_level}${NC} | ${YELLOW}$msg${NC}"
}
