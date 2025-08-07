import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';
import { verifyToken, getTokenFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = getTokenFromRequest(authHeader || '');

    if (!token) {
      return NextResponse.json(
        { error: 'Token manquant' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Token invalide' },
        { status: 401 }
      );
    }

    const db = await getDatabase();
    const user = await db.get(
      'SELECT id, email, name, role, phone, address, created_at FROM users WHERE id = ?',
      [payload.userId]
    );

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    const userResponse = {
      id: user.id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
      address: user.address,
      createdAt: user.created_at
    };

    return NextResponse.json(userResponse);

  } catch (error) {
    console.error('Erreur lors de la vérification:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
