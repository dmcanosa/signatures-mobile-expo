//import { z } from 'zod';
import { supabase } from '@/config/supabase';
//import { Base64 as jsBase64 } from 'js-base64';
//import * as Crypto from 'expo-crypto';
import { AES, CBC, Pkcs7, PBKDF2, WordArray, Utf8, Base64 as cryptoEsBase64 } from 'crypto-es';
      
const secretSigKey = process.env.EXPO_PUBLIC_SECRET_SIGNATURE_KEY as string;
const saltKey = process.env.EXPO_PUBLIC_SECRET_SIGNATURE_KEY_SALT as string;
const iv = process.env.EXPO_PUBLIC_SECRET_SIGNATURE_KEY_IV as string;

const salt = Utf8.parse(saltKey);
const key256 = PBKDF2(secretSigKey, salt, { keySize: 256/32 });
const iv_wa = Utf8.parse(iv);
        

/*const FormSchema = z.object({
  id: z.string(),
  data: z.string(),
});*/

//const CreateSignature = FormSchema.omit({ id: true });
//const CreateDocument = docFormSchema.omit({ id: true });
//const crypto = new NextCrypto(process.env.SECRET_SIGNATURE_KEY as string);
    
/*export type State = {
  errors?: {
    data?: string[];
  };
  message?: string | null;
};*/

export async function createSignature(formData: FormData) {
  //const secretSigKey = process.env.SECRET_SIGNATURE_KEY as string;
  
  /*const validatedFields = CreateSignature.safeParse({
    data: formData.get('svgString'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Signature.',
    };
  }*/
  
  try {
    const user = await supabase.auth.getUser();
    console.log('user on create sig: ', user);
    const sig = formData.get('sigData') as string;
    const uid = user.data.user?.id;
    console.log('user id: ',uid);
    
    const { error } = await supabase
      .from('signatures')
      .update({ active: false })
      .eq('user_id', uid)
    
    console.log(error);
      
    (async function () {
      const encryptedSig = AES.encrypt(
        sig, 
        key256, 
        { iv: iv_wa, 
          mode: CBC, 
          padding: Pkcs7 
        }
      ).toString();
      //console.log('sig to encrypt: ', encryptedSig);

      const { error } = await supabase
        .from('signatures')
        .insert({ data: encryptedSig, active: true, user_id: uid })
      
      console.log(error);  
    })();
  } catch (error) {
    return {
      success: false,
      message: 'Database Error: Failed to Create Signature.'+error,
    };
  }  
  return {
    success: true,
    message: '',
  };
}

export async function getSignatures(): Promise<any[]>{
  //const secretSigKey = process.env.SECRET_SIGNATURE_KEY as string;

  
  const user = await supabase.auth.getUser();
  console.log('user on get sig: ', user);
  const uid = user.data.user?.id;
  console.log('user id: ',uid);
  
  const { data, error } = await supabase
      .from('signatures')
      .select()
      .eq('user_id', uid)
  
  if(error){
    console.log('error fetching sigs: ', error);
    return [];
  }else{
    const decryptedSignatures:any[] = [];
    try{  
      data.map( (sig) => {
        //console.log('UNdecoded sig: ', sig.data);

        const config = {
          iv: iv_wa, 
          mode: CBC,
          padding: Pkcs7
        };

        const dec = AES.decrypt(sig.data, key256, config);//.toString(); //Utf8);
        //console.log('decrypted sig: ', dec);
        const decrypted = dec.toString(Utf8);//Utf8);
        //console.log('decrypted sig str: ', decrypted);

        const trimmed = decrypted.indexOf('data:image') >= 0 ? decrypted?.replace(/^data:image\/svg\+xml;base64,/, '') : decrypted;
        console.log('trimmed sig: ', trimmed);
        
        const decoded = atob(trimmed as string);
        //console.log('decoded sig: ', decoded);
        sig.data = decoded;
        sig.key = sig.id;
        const date = new Date(sig.created);
        sig.created = date.toDateString();
        //console.log('sig before push: ', sig);
        //if(decryptedSignatures)
         decryptedSignatures?.push(sig);  
        });
    }catch(error){
      console.log('error: ',error);  
    }
    return decryptedSignatures;
  }
}
        
    /*
    await Promise.all(data.map( async (sig) => {
      try{
        //const decrypted = await crypto.decrypt(sig.data);
        /*const decrypted = AES.decrypt(sig.data, secretSigKey).toString(Utf8);
        console.log('decrypted sig: ', decrypted);
        */
        
        //console.log('sig: ', sig.data);
        
        //const decrypted = sig.data;
        //const decrypted = AES.decrypt(sig.data, secretSigKey).toString();//.toString(Utf8);
        //console.log('decrypted sig2: ', decrypted);
        
        //const trimmed = decrypted.indexOf('data:image') >= 0 ? decrypted?.replace(/^data:image\/svg\+xml;base64,/, '') : decrypted;
        //console.log('trimmed sig: ', trimmed);
        
        //const decoded = jsBase64.decode(trimmed as string);
        //const b64parsed = cryptoEsBase64.parse(trimmed as string);
        //console.log('b64parsed sig: ', b64parsed);
        
        //const decoded = Utf8.stringify(b64parsed);
        //console.log('decoded sig: ', decoded);
        //const decoded = Base64.decode(trimmed as string);
        //console.log('decoded sig: ', decoded);
        //sig.data = trimmed;
        
        //sig.data = decoded;
        /*sig.key = sig.id;
        const date = new Date(sig.created);
        sig.created = date.toDateString();
        console.log('sig before push: ', sig);
        //if(decryptedSignatures)
          decryptedSignatures?.push(sig);
      }catch(error){
        console.log('error: ',error);  
      }
    }));

    return decryptedSignatures;
  }    
}*/

export async function createDocument(formData: FormData) {
  try {
    const user = await supabase.auth.getUser();
    console.log('user on create doc: ', user);
    const uid = user.data.user?.id;
    console.log('user id: ',uid);
      
    (async function () {
      const { error } = await supabase
        .from('documents')
        .insert({ user_id: uid })
      
      console.log(error);  
    })();
  } catch (error) {
    return {
      success: false,
      message: 'Database Error: Failed to Create Document.'+error,
    };
  }  
  return {
    success: true,
    message: '',
  };
}

export async function getDocuments(): Promise<any[]>{
  //const secretSigKey = process.env.SECRET_SIGNATURE_KEY as string;

  
  const user = await supabase.auth.getUser();
  console.log('user on get sig: ', user);
  const uid = user.data.user?.id;
  console.log('user id: ',uid);
  
  const { data, error } = await supabase
      .from('documents')
      .select()
      .eq('user_id', uid)
  
  if(error){
    return [];
  }else{
    //const decryptedSignatures:any[] = [];
    
    /*await Promise.all(data.map( async (sig) => {
      try{
        //const decrypted = await crypto.decrypt(sig.data);
        const decrypted = AES.decrypt(sig.data, secretSigKey).toString(Utf8);
        //console.log('decrypted sig: ', decrypted);

        const trimmed = decrypted?.replace(/^data:image\/svg\+xml;base64,/, '');
        const decoded = Base64.decode(trimmed as string);
        //console.log('decoded sig: ', decoded);
        sig.data = decoded;
        sig.key = sig.id;
        const date = new Date(sig.created);
        sig.created = date.toDateString();
        decryptedSignatures?.push(sig);
      }catch(error){
        console.log('error: ',error);  
      }
    }));*/

    return data;
  }    
}