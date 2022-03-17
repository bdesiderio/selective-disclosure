import { BbsBlsSignature2020, BbsBlsSignatureProof2020 } from "@mattrglobal/jsonld-signatures-bbs";
import { documentVerificationLoader } from "./document-loader";
import { verify, purposes } from "jsonld-signatures";
import vcDeridavada from "./data/vc-derivada.json"

export const someoneVerifyDerivedVC = async () => {
    const derivedProof = vcDeridavada;

    //Verify the derived proof
    const verified = await verify(derivedProof, {
        suite: new BbsBlsSignatureProof2020(),
        purpose: new purposes.AssertionProofPurpose(),
        documentLoader: documentVerificationLoader
    });

    console.log("verified", JSON.stringify(verified, null, 2));
};