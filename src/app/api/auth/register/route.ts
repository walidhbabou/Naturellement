import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'naturlife-secret-key-change-in-production';

export async function POST(request: NextRequest) {
  const { email, password, name, phone, address } = await request.json();

  // Vérifier si l'utilisateur existe déjà
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();

  if (existingUser) {
    return NextResponse.json({ error: 'Un compte avec cet email existe déjà' }, { status: 409 });
  }

  // Insérer l'utilisateur et retourner la ligne insérée
  const { data, error } = await supabase
    .from('users')
    .insert([{ email, password, name, phone, address, role: 'user' }])
    .select();

  if (error || !data || !data[0]) {
    return NextResponse.json({ error: error?.message || "Erreur d'insertion utilisateur" }, { status: 500 });
  }

  // Générer le token
  const token = jwt.sign(
    { userId: data[0].id, email, role: 'user' },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return NextResponse.json({
    token,
    user: {
      id: data[0].id,
      email,
      name,
      role: 'user',
      phone,
      address,
      createdAt: data[0].created_at
    }
  }, { status: 201 });
}
