//import { z } from 'zod';
//import NextCrypto from 'next-crypto';
import { supabase } from '@/config/supabase';
import { AES, Utf8 } from 'crypto-es';
//import Config from 'react-native-config';
import { SECRET_SIGNATURE_KEY } from '@env';
//import { Buffer } from 'buffer';

/*if (typeof window !== 'undefined' && !window.Buffer) {
  window.Buffer = Buffer;
}*/

//const crypto = new NextCrypto(process.env.SECRET_SIGNATURE_KEY as string);
const secretSigKey = SECRET_SIGNATURE_KEY as string;

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
      console.log('sig to encrypt: ', sig);
      console.log('key to encrypt: ', secretSigKey);
      
      const encryptedSig = AES.encrypt(sig, secretSigKey).toString();
      console.log('sig to encrypt: ', encryptedSig);

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
    return [];
  }else{
    const decryptedSignatures:any[] = [];
    await Promise.all(data.map( async (sig) => {
      try{
        //const decrypted = await crypto.decrypt(sig.data);
        const decrypted = AES.decrypt(sig.data, secretSigKey).toString(Utf8);
        console.log('decrypted sig: ', decrypted);
        
        const trimmed = decrypted?.replace(/^data:image\/svg\+xml;base64,/, '');
        sig.data = trimmed;
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