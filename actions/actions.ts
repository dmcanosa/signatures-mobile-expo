//import { z } from 'zod';
import { supabase } from '@/config/supabase';
import { Base64 } from 'js-base64';
import * as Crypto from 'expo-crypto';
import { AES, CBC, Pkcs7, PBKDF2, WordArray, Utf8 } from 'crypto-es';
      
/*import { Buffer } from 'buffer';

if (typeof window !== 'undefined' && !window.Buffer) {
  window.Buffer = Buffer;
}*/

const secretSigKey = process.env.EXPO_PUBLIC_SECRET_SIGNATURE_KEY as string;

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
      //const secretSigKey = process.env.SECRET_SIGNATURE_KEY as string;
      
      //const signature = await crypto.encrypt(sig);
      //console.log('sig to encrypt: ', sig);
      console.log('key to encrypt: ', secretSigKey);
      
      const salt = WordArray.random(128/8);
      const key256 = PBKDF2(secretSigKey, salt, { keySize: 256/32 });
      const iv = WordArray.random(128/8);
      
      //console.log('SALT: ', salt.toString());
      const encryptedSig = AES.encrypt(
        sig, 
        key256, 
        { iv: iv, 
          mode: CBC, 
          padding: Pkcs7 
        }
      ).toString();
      
      //const encryptedSig = AES.encrypt(sig, secretSigKey).toString();
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
    return [];
  }else{
    const decryptedSignatures:any[] = [];
    await Promise.all(data.map( async (sig) => {
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
    }));

    return decryptedSignatures;
  }    
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