import { extendContextLoader } from "jsonld-signatures";
import { documentLoaders } from "jsonld";

import keyPairOptions from "./data/keyPair.json";
import exampleControllerDoc from "./data/controllerDocument.json";
import bbsContext from "./data/bbs.json";
import citizenVocab from "./data/citizenVocab.json";

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const documents: any = {
    "did:example:489398593#test": keyPairOptions,
    "did:example:489398593": exampleControllerDoc,
    "https://w3id.org/security/bbs/v1": bbsContext,
    "https://w3id.org/citizenship/v1": citizenVocab
};

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const customDocLoader = (url: string): any => {
    const context = documents[url];

    if (context) {
        return {
            contextUrl: null, // this is for a context via a link header
            document: context, // this is the actual document that was loaded
            documentUrl: url // this is the actual context URL after redirects
        };
    }

    return documentLoaders.node()(url);
};

const customDocLoaderVerification = (url: string): any => {
    if (url.indexOf('did:peer') > -1 && url.indexOf("#") > -1) {
        //Traer did document del storage local.
    }
    if (url.indexOf('did:') > -1 && url.indexOf("#") > -1) {
        let verificationMethod = exampleControllerDoc.verificationMethod.find(x => x.id == url) || null;
        if (!verificationMethod) {
            verificationMethod = <any>exampleControllerDoc.authentication?.find(x => (<any>x).id == url) || null;
            if (!verificationMethod) {
                verificationMethod = (<any>(exampleControllerDoc.assertionMethod?.find(x => (<any>x).id == url)) || null);

                if (!verificationMethod) throw new Error("Verification method not found in did document");
            }
        }

        return {
            contextUrl: null, // this is for a context via a link header
            document: verificationMethod, // this is the actual document that was loaded
            documentUrl: url // this is the actual context URL after redirects
        };
    }

    const context = documents[url];

    if (context) {
        return {
            contextUrl: null, // this is for a context via a link header
            document: context, // this is the actual document that was loaded
            documentUrl: url // this is the actual context URL after redirects
        };
    }

    return documentLoaders.node()(url);
};

//Extended document load that uses local contexts
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export const documentLoader: any = extendContextLoader(customDocLoader);
export const documentVerificationLoader: any = extendContextLoader(customDocLoaderVerification);