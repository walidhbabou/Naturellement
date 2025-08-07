import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getDatabase } from '@/lib/database';
import { generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, phone, address } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, mot de passe et nom requis' },
        { status: 400 }
      );
    }

    // Validation basique de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Format d\'email invalide' },
        { status: 400 }
      );
    }

    // Validation du mot de passe
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 6 caractères' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await db.get(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUser) {
      return NextResponse.json(
        { error: 'Un compte avec cet email existe déjà' },
        { status: 409 }
      );
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const result = await db.run(
      'INSERT INTO users (email, password, name, phone, address, role) VALUES (?, ?, ?, ?, ?, ?)',
      [email, hashedPassword, name, phone || null, address || null, 'user']
    );

    const userId = result.lastID;

    // Générer le token
    const token = generateToken({
      userId: userId!.toString(),
      email,
      role: 'user'
    });

    const userResponse = {
      id: userId!.toString(),
      email,
      name,
      role: 'user',
      phone: phone || undefined,
      address: address || undefined,
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({
      token,
      user: userResponse
    }, { status: 201 });

  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
