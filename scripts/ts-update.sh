#!/bin/bash

# Runs the TypeScript update script to generate action/trigger declarations.

set -xeu -o pipefail

source "$(dirname "$0")/ensure-iesdp.sh"

iesdp_dir=$(ensure_iesdp)

pnpm exec tsx scripts/ts-update.ts \
    "$iesdp_dir/_data/actions" \
    ts/ielib/bg2/actions.d.ts \
    "$iesdp_dir/scripting/triggers/bg2triggers.htm" \
    ts/ielib/bg2/triggers.d.ts
