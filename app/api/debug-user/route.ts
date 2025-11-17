import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    if (!email) {
      return NextResponse.json({ error: 'Email parameter required' }, { status: 400 });
    }
    
    const user = await prisma.user.findUnique({
      where: { email },
      include: { 
        accounts: true,
        sessions: true,
      }
    });
    
    if (!user) {
      return NextResponse.json({ found: false, email });
    }
    
    return NextResponse.json({
      found: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
      },
      accounts: user.accounts.map(acc => ({
        provider: acc.provider,
        providerAccountId: acc.providerAccountId,
      })),
      sessionCount: user.sessions.length,
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      code: error.code,
    }, { status: 500 });
  }
}
