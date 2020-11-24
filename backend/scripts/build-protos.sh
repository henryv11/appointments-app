#!/bin/bash

PROTO_DIR="./src/grpc/proto"
OUT_DIR="./src/grpc/generated"
PROTOC_GEN_TS_PATH="./node_modules/.bin/protoc-gen-ts"
GRPC_TOOLS_NODE_PROTOC="./node_modules/.bin/grpc_tools_node_protoc"

$GRPC_TOOLS_NODE_PROTOC \
    --js_out=import_style=commonjs,binary:"$OUT_DIR" \
    --ts_out="$OUT_DIR" \
    --grpc_out="$OUT_DIR" \
    -I "$PROTO_DIR" \
    "$PROTO_DIR"/*.proto
