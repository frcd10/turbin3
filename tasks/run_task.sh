#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <relative-path-to-task-ts-file>" >&2
  exit 1
fi

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TS_PROJECT="$ROOT_DIR/solana-starter/ts"
TASK_FILE="$ROOT_DIR/$1"

NODE_PATH="$TS_PROJECT/node_modules" \
TS_NODE_PROJECT="$TS_PROJECT/tsconfig.json" \
node -r "$TS_PROJECT/node_modules/ts-node/register/transpile-only" "$TASK_FILE"
