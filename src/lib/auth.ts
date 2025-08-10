import jwt from 'jsonwebtoken';
import { supabase } from '@/lib/supabaseClient';

const JWT_SECRET = process.env.JWT_SECRET || 'naturlife-secret-key-change-in-production';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

export function getTokenFromRequest(authHeader?: string): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

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

  // Insérer l'utilisateur
  const { data, error } = await supabase
    .from('users')
    .insert([{ email, password, name, phone, address, role: 'user' }]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // ...générer le token et retourner la réponse...
}
