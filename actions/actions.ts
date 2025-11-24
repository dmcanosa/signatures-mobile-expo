import { z } from 'zod';
import NextCrypto from 'next-crypto';
import { supabase } from '@/config/supabase';

const FormSchema = z.object({
  id: z.string(),
  data: z.string(),
});

const CreateSignature = FormSchema.omit({ id: true });
//const CreateDocument = docFormSchema.omit({ id: true });
const crypto = new NextCrypto(process.env.SECRET_SIGNATURE_KEY as string);
    
export type State = {
  errors?: {
    data?: string[];
  };
  message?: string | null;
};

export async function createSignature(formData: FormData) {
  /*const validatedFields = CreateSignature.safeParse({
    data: formData.get('svgString'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Signature.',
    };
  }*/
  
  //const sb = await supabase();
  try {
    const user = await supabase.auth.getUser();
    console.log('user on create sig: ', user);
    console.log('formdata: ',formData);
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Signature.'+error,
    };
  }  

  /*const decrypted = user.data.user.id as string;
  const signature = await crypto.encrypt(validatedFields.data.data);
  if(userId == '')
    userId = decrypted;  
  try {
      
      const { error } = await supabase
        .from('signatures')
        .update({ active: false })
        .eq('user_id', userId)
      
      console.log(error);
      
      (async function () {
        const { error } = await supabase
          .from('signatures')
          .insert({ data: signature, active: true, user_id: userId })
        
        console.log(error);  
      })();
    
      
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Signature.'+error,
    };
  }*/

  //if(needsRedirect){
    //revalidatePath('/dashboard/signatures');
    //redirect('/dashboard/signatures');
  //}
}