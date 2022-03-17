/*
 * Copyright 2020 - MATTR Limited
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  Bls12381G2KeyPair,
  BbsBlsSignature2020,
  BbsBlsSignatureProof2020,
  deriveProof
} from "@mattrglobal/jsonld-signatures-bbs";
import { extendContextLoader, sign, verify, purposes } from "jsonld-signatures";
import { documentLoaders } from "jsonld";

import inputDocument from "./data/inputDocument.json";
import keyPairOptions from "./data/keyPair.json";
import exampleControllerDoc from "./data/controllerDocument.json";
import bbsContext from "./data/bbs.json";
import revealDocument from "./data/deriveProofFrame.json";
import citizenVocab from "./data/citizenVocab.json";
import verifiableCredential from "./data/verifiableCredential.json"
import vcDeridavada from "./data/vc-derivada.json"

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
const documentLoader: any = extendContextLoader(customDocLoader);
const documentVerificationLoader: any = extendContextLoader(customDocLoaderVerification);


const exec = () => {
  //Una entidad externa emite una credencial verificable para John
  emitVCToJohn();

  //Un tercero verifica la VC emitida por la entidad externa.
  // someoneVerifyVC();

  //John utiliza Selective Disclosure para obtener la credencial derivada que desea enviar.
  // johnGetDerivedVCToSendSomeone();

  //Un tercero recibe la credencial derivada de Jhon y la verifica.
  // someoneVerifyDerivedVC();
}


//Una entidad externa emite una credencial verificable para John
const emitVCToJohn = async (): Promise<void> => {
  //Import the example key pair
  const keyPair = await new Bls12381G2KeyPair(keyPairOptions);

  //Sign the input document
  const signedDocument = await sign(inputDocument, {
    suite: new BbsBlsSignature2020({ key: keyPair }),
    purpose: new purposes.AssertionProofPurpose(),
    documentLoader
  });

  console.log("Input document with proof");
  console.log(JSON.stringify(signedDocument, null, 2));
};



//Un tercero verifica la VC emitida por la entidad externa.
const someoneVerifyVC = async () => {
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



//John utiliza Selective Disclosure para obtener la credencial derivada que desea enviar.
const johnGetDerivedVCToSendSomeone = async () => {
  const signedDocument = verifiableCredential;

  const derivedProof = await deriveProof(signedDocument, revealDocument, {
    suite: new BbsBlsSignatureProof2020(),
    documentLoader: documentVerificationLoader
  });

  console.log("derivedProof");
  console.log(JSON.stringify(derivedProof, null, 2));
};



//Un tercero recibe la credencial derivada de Jhon y la verifica.
const someoneVerifyDerivedVC = async () => {
  const derivedProof = vcDeridavada;

  //Verify the derived proof
  const verified = await verify(derivedProof, {
    suite: new BbsBlsSignatureProof2020(),
    purpose: new purposes.AssertionProofPurpose(),
    documentLoader: documentVerificationLoader
  });

  console.log("verified", JSON.stringify(verified, null, 2));
};

exec();