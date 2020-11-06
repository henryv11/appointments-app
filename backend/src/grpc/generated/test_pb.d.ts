// package: test
// file: test.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class TestMessage extends jspb.Message { 
    getMessage(): string;
    setMessage(value: string): TestMessage;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): TestMessage.AsObject;
    static toObject(includeInstance: boolean, msg: TestMessage): TestMessage.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: TestMessage, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): TestMessage;
    static deserializeBinaryFromReader(message: TestMessage, reader: jspb.BinaryReader): TestMessage;
}

export namespace TestMessage {
    export type AsObject = {
        message: string,
    }
}
