import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
  const email = 'admin@delivery.com';
  const password = 'Admin123';
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const admin = await prisma.cliente.upsert({
      where: { email },
      update: {
        isAdmin: true,
      } as any,
      create: {
        email,
        nome: 'Administrador',
        senha: hashedPassword,
        isAdmin: true,
      } as any,
    });

    console.log('✅ Usuário admin criado/atualizado com sucesso!');
    console.log('📧 Email:', email);
    console.log('🔑 Senha:', password);
    console.log('👤 ID:', admin.id);
  } catch (error) {
    console.error('❌ Erro ao criar usuário admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
