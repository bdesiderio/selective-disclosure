import { BbsBlsSignature2020 } from "@mattrglobal/jsonld-signatures-bbs";
import verifiableCredential from "./data/verifiableCredential.json"
import { documentVerificationLoader } from "./document-loader";
import { verify, purposes } from "jsonld-signatures";

export const someoneVerifyVC = async () => {
    const signedDocument = verifiableCredential;

    //Verify the proof
    let verified = await verify(signedDocument, {
        suite: new BbsBlsSignature2020(),
        purpose: new purposes.AssertionProofPurpose(),
        documentLoader: documentVerificationLoader
    });

    console.log("Verification result");
    console.log(JSON.stringify(verified, null, 2));
};