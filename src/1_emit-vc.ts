import { BbsBlsSignature2020, Bls12381G2KeyPair } from "@mattrglobal/jsonld-signatures-bbs";
import { sign, purposes } from "jsonld-signatures";
import inputDocument from "./data/inputDocument.json";
import keyPairOptions from "./data/keyPair.json";
import { documentLoader } from "./document-loader";

export const emitVC = async (): Promise<void> => {
    //Import the example key pair
    const keyPair = await new Bls12381G2KeyPair(keyPairOptions);

    //Sign the input document
    const signedDocument = await sign(inputDocument, {
        suite: new BbsBlsSignature2020({ key: keyPair }),
        purpose: new purposes.AssertionProofPurpose(),
        documentLoader,
    });

    console.log("Input document with proof");
    console.log(JSON.stringify(signedDocument, null, 2));
};