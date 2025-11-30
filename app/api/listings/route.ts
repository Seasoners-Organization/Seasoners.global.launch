import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { REGION_DISPLAY_TO_ENUM } from '../../../utils/regions';
import { trackActivity } from '../../../utils/activity-tracker';
import { sendListingPublishedEmail } from '@/utils/onboarding-emails';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { 
      title, 
      description, 
      listingType, 
      region, 
      city, 
      price,
      photos, // Add photos array
      // Flatshare-specific fields
      totalRoommates,
      currentRoommates,
      lookingForGender,
      spotsAvailable,
      // Optional enhanced location context
      location: locationName
    } = body;

    // Validate required fields (region no longer required for non-AT locations)
    if (!title || !description || !listingType) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, listingType' },
        { status: 400 }
      );
    }

    // Map display region name to enum value if provided
    let regionEnum = undefined as undefined | string;
    if (region) {
      regionEnum = REGION_DISPLAY_TO_ENUM[region];
      if (!regionEnum) {
        return NextResponse.json(
          { error: 'Invalid region provided' },
          { status: 400 }
        );
      }
    }

    // Map listing type to standardized values
    const typeMap: Record<string, string> = {
      'Apartment / Room': 'STAY',
      'Staff Housing': 'STAY',
      'Seasonal Job': 'JOB',
      'Flatshare': 'FLATSHARE',
    };
    const type = typeMap[listingType] || 'STAY';

    // Parse price if provided
    const parsedPrice = price ? parseFloat(price) : 0;
    if (isNaN(parsedPrice)) {
      return NextResponse.json(
        { error: 'Invalid price format' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Create listing
    const listingData: any = {
      title,
      description,
      type,
      price: parsedPrice,
      location: (locationName?.toString()?.trim() || [city, region].filter(Boolean).join(', ')).trim(),
      region: regionEnum ? (regionEnum as any) : null,
      city: city || null,
      photos: photos || [], // Store photos array
      userId: user.id,
      verified: false,
    };

    // Add flatshare-specific fields if applicable
    if (type === 'FLATSHARE') {
      listingData.totalRoommates = totalRoommates ? parseInt(totalRoommates) : null;
      listingData.currentRoommates = currentRoommates || [];
      listingData.lookingForGender = lookingForGender || 'ANY';
      listingData.spotsAvailable = spotsAvailable ? parseInt(spotsAvailable) : 1;
    }

    const listing = await prisma.listing.create({
      data: listingData,
    });

    // Update user's total listings count
    await prisma.user.update({
      where: { id: user.id },
      data: { totalListings: { increment: 1 } },
    });

    // Track activity
    trackActivity(user.id);

    // Send listing published email (non-blocking)
    sendListingPublishedEmail(listing, user).catch(err => {
      console.error('❌ Failed to send listing published email:', err);
    });

    return NextResponse.json({
      message: 'Listing created successfully',
      listing: {
        id: listing.id,
        title: listing.title,
        type: listing.type,
      },
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating listing:', error);
    return NextResponse.json(
      { error: 'Failed to create listing' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // If no database configured, return empty array to allow builds to succeed
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ listings: [] }, { status: 200 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const region = searchParams.get('region');

    const where: any = {};
    
    if (type) {
      where.type = type.toUpperCase();
    }
    
    if (region && region !== 'all') {
      const regionEnum = REGION_DISPLAY_TO_ENUM[region];
      if (regionEnum) {
        where.region = regionEnum;
      }
    }

    const listings = await prisma.listing.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            trustScore: true,
            profilePicture: true,
                      emailVerified: true,
                      phoneVerified: true,
                      identityVerified: true,
          } as any,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ listings }, { status: 200 });

  } catch (error) {
    console.error('Error fetching listings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch listings' },
      { status: 500 }
    );
  }
}
