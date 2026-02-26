//import { z } from 'zod';
import { supabase } from '@/config/supabase';
import { Base64 as jsBase64 } from 'js-base64';
//import * as Crypto from 'expo-crypto';
import base64 from 'react-native-base64';
import { AES, CBC, Pkcs7, PBKDF2, WordArray, Utf8, Base64 as cryptoEsBase64 } from 'crypto-es';
import { parseSupabaseError, logError } from '@/utils/error-handler';
      
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
  try {
    const user = await supabase.auth.getUser();
    
    if (!user.data.user?.id) {
      throw new Error('User not authenticated');
    }

    const sig = formData.get('sigData') as string;
    if (!sig) {
      throw new Error('Signature data is required');
    }

    const uid = user.data.user.id;
    
    // Deactivate previous signatures
    const { error: deactivateError } = await supabase
      .from('signatures')
      .update({ active: false })
      .eq('user_id', uid);
    
    if (deactivateError) {
      throw deactivateError;
    }
    
    // Encrypt and store new signature
    const encryptedSig = AES.encrypt(
      sig, 
      key256, 
      { iv: iv_wa, 
        mode: CBC, 
        padding: Pkcs7 
      }
    ).toString();

    const { error: insertError } = await supabase
      .from('signatures')
      .insert({ data: encryptedSig, active: true, user_id: uid });
    
    if (insertError) {
      throw insertError;
    }

    return {
      success: true,
      message: 'Signature created successfully',
    };
  } catch (error) {
    logError(error, 'createSignature');
    const appError = parseSupabaseError(error);
    return {
      success: false,
      message: appError.message,
    };
  }
}

export async function getSignatures(): Promise<any[]> {
  try {
    const user = await supabase.auth.getUser();
    
    if (!user.data.user?.id) {
      logError('User not authenticated', 'getSignatures');
      return [];
    }

    const uid = user.data.user.id;
    
    const { data, error } = await supabase
      .from('signatures')
      .select()
      .eq('user_id', uid);
    
    if (error) {
      logError(error, 'getSignatures');
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    const decryptedSignatures: any[] = [];
    
    data.forEach((sig) => {
      try {
        const config = {
          iv: iv_wa, 
          mode: CBC,
          padding: Pkcs7
        };

        const dec = AES.decrypt(sig.data, key256, config);
        const decrypted = dec.toString(Utf8);
        
        let processed = '';
        
        if (decrypted.includes('data:image/svg')) {
          processed = decrypted.replace(/^data:image\/svg\+xml;base64,/, '');
          sig.data = atob(processed);
        } else if (decrypted.includes('data:image/png')) {
          processed = decrypted.replace(/^data:image\/png;base64,/, '');
          sig.data = processed;
        } else {
          sig.data = decrypted;
        }
        
        sig.key = sig.id;
        const date = new Date(sig.created);
        sig.created = date.toDateString();
        decryptedSignatures.push(sig);
      } catch (decryptError) {
        logError(decryptError, 'getSignatures - decryption');
      }
    });

    return decryptedSignatures;
  } catch (error) {
    logError(error, 'getSignatures');
    return [];
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