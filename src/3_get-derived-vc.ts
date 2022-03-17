import { BbsBlsSignature2020, BbsBlsSignatureProof2020, deriveProof } from "@mattrglobal/jsonld-signatures-bbs";
import verifiableCredential from "./data/verifiableCredential.json"
import { documentVerificationLoader } from "./document-loader";
import revealDocument from "./data/deriveProofFrame.json";

export const johnGetDerivedVCToSendSomeone = async () => {
    const signedDocument = verifiableCredential;

    const derivedProof = await deriveProof(signedDocument, revealDocument, {
        suite: new BbsBlsSignatureProof2020(),
        documentLoader: documentVerificationLoader
    });

    console.log("derivedProof");
    console.log(JSON.stringify(derivedProof, null, 2));
};