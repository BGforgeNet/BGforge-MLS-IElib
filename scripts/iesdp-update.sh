#!/bin/bash

# Runs the IESDP update script to generate opcode and structure definitions.

set -xeu -o pipefail

source "$(dirname "$0")/ensure-iesdp.sh"

iesdp_dir=$(ensure_iesdp)
opcode_file="opcode.tpp"

pnpm exec tsx scripts/iesdp-update.ts -s "$iesdp_dir" --opcode_file "$opcode_file"
