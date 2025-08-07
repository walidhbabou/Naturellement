import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';

export async function GET(request: NextRequest) {
  // Cette route n'est disponible qu'en mode développement
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Route disponible uniquement en développement' },
      { status: 403 }
    );
  }

  try {
    const db = await getDatabase();
    
    // Récupérer toutes les tables et leurs contenus
    const tables = await db.all(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
    `);

    const result: Record<string, any[]> = {};

    for (const table of tables) {
      const tableName = table.name;
      let data;
      
      if (tableName === 'users') {
        // Pour les utilisateurs, on cache les mots de passe
        data = await db.all(`
          SELECT id, email, name, role, phone, address, created_at, updated_at 
          FROM ${tableName}
        `);
      } else {
        data = await db.all(`SELECT * FROM ${tableName}`);
      }
      
      result[tableName] = data;
    }

    return NextResponse.json({
      message: 'Contenu de la base de données',
      data: result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Erreur lors de la lecture de la base de données:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// Route pour initialiser des données de test
export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Route disponible uniquement en développement' },
      { status: 403 }
    );
  }

  try {
    const db = await getDatabase();
    const bcrypt = await import('bcryptjs');

    // Ajouter quelques utilisateurs de test
    const testUsers = [
      {
        email: 'user1@test.com',
        password: await bcrypt.hash('password123', 10),
        name: 'Utilisateur Test 1',
        role: 'user',
        phone: '+212 6XX XXX XX1',
        address: 'Casablanca, Maroc'
      },
      {
        email: 'user2@test.com',
        password: await bcrypt.hash('password123', 10),
        name: 'Utilisateur Test 2',
        role: 'user',
        phone: '+212 6XX XXX XX2',
        address: 'Rabat, Maroc'
      },
      {
        email: 'admin2@test.com',
        password: await bcrypt.hash('admin123', 10),
        name: 'Admin Test',
        role: 'admin',
        phone: '+212 6XX XXX XX3',
        address: 'Marrakech, Maroc'
      }
    ];

    for (const user of testUsers) {
      try {
        await db.run(`
          INSERT OR IGNORE INTO users (email, password, name, role, phone, address) 
          VALUES (?, ?, ?, ?, ?, ?)
        `, [user.email, user.password, user.name, user.role, user.phone, user.address]);
      } catch (error) {
        console.log(`Utilisateur ${user.email} existe déjà`);
      }
    }

    return NextResponse.json({
      message: 'Données de test ajoutées avec succès',
      users: testUsers.map(u => ({ email: u.email, name: u.name, role: u.role }))
    });

  } catch (error) {
    console.error('Erreur lors de l\'ajout des données de test:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
