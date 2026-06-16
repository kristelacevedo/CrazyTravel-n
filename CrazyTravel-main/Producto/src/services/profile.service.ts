import { supabase } from '../lib/supabase';

export interface FullProfileData {
  first_name: string;
  last_name: string;
  phone: string;
  middle_name?: string;
  second_last_name?: string;
  rut: string;
  passport?: string;
  birth_date: string;
  food_preference?: string;
  allergies?: string;
  emergency_name: string;
  emergency_phone: string;
}

export const profileService = {
  // Obtiene los datos cruzando las tablas
  async getFullProfile(userId: string) {
    // 🔴 CAMBIADO: 'profiles' por 'perfiles'
    const { data: profile, error: pError } = await supabase
      .from('perfiles')
      .select('first_name, last_name, phone')
      .eq('id', userId)
      .single();

    if (pError) throw pError;

    const { data: passenger, error: passError } = await supabase
      .from('passenger_profiles')
      .select('id, middle_name, second_last_name, rut, passport, birth_date')
      .eq('user_id', userId)
      .maybeSingle();

    if (passError) throw passError;

    let medical = null;
    if (passenger) {
      const { data: medData, error: medError } = await supabase
        .from('passenger_medical_info')
        .select('food_preference, allergies, emergency_name, emergency_phone')
        .eq('passenger_profile_id', passenger.id)
        .maybeSingle();

      if (medError) throw medError;
      medical = medData;
    }

    return {
      first_name: profile?.first_name || '',
      last_name: profile?.last_name || '',
      phone: profile?.phone || '',
      middle_name: passenger?.middle_name || '',
      second_last_name: passenger?.second_last_name || '',
      rut: passenger?.rut || '',
      passport: passenger?.passport || '',
      birth_date: passenger?.birth_date || '',
      food_preference: medical?.food_preference || 'Ninguna',
      allergies: medical?.allergies || '',
      emergency_name: medical?.emergency_name || '',
      emergency_phone: medical?.emergency_phone || '',
    };
  },

  // Guarda garantizando que no existan duplicados
  async saveFullProfile(userId: string, data: FullProfileData) {
    // 🔴 CAMBIADO: 'profiles' por 'perfiles'
    const { error: pError } = await supabase
      .from('perfiles')
      .update({
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone
      })
      .eq('id', userId);

    if (pError) throw pError;

    // 2. Upsert directo en 'passenger_profiles' usando la llave única 'user_id'
    const { data: savedPassenger, error: passError } = await supabase
      .from('passenger_profiles')
      .upsert({
        user_id: userId,
        middle_name: data.middle_name,
        second_last_name: data.second_last_name,
        rut: data.rut,
        passport: data.passport,
        birth_date: data.birth_date
      }, { onConflict: 'user_id' })
      .select('id')
      .single();

    if (passError) throw passError;

    // 3. Upsert directo en 'passenger_medical_info' usando la llave única
    const { error: medError } = await supabase
      .from('passenger_medical_info')
      .upsert({
        passenger_profile_id: savedPassenger.id,
        food_preference: data.food_preference,
        allergies: data.allergies,
        emergency_name: data.emergency_name,
        emergency_phone: data.emergency_phone
      }, { onConflict: 'passenger_profile_id' }); 

    if (medError) throw medError;

    return true;
  }
};