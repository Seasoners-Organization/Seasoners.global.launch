import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { prisma } from '../../../../lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      dateOfBirth,
      nationality,
      spokenLanguages,
      occupation,
      workExperience,
      skills,
      aboutMe,
      interests,
      availability,
      willingToRelocate,
      hasWorkPermit,
      workPermitCountries,
      profileVisibility,
      openToOpportunities,
      preferredRegions,
    } = body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Build update data object
    const updateData: any = {};

    if (dateOfBirth) updateData.dateOfBirth = new Date(dateOfBirth);
    if (nationality !== undefined) updateData.nationality = nationality;
    if (spokenLanguages !== undefined) updateData.spokenLanguages = spokenLanguages;
    if (occupation !== undefined) updateData.occupation = occupation;
    if (workExperience !== undefined) updateData.workExperience = workExperience;
    if (skills !== undefined) updateData.skills = skills;
    if (aboutMe !== undefined) updateData.aboutMe = aboutMe;
    if (interests !== undefined) updateData.interests = interests;
    if (availability !== undefined) updateData.availability = availability;
    if (willingToRelocate !== undefined) updateData.willingToRelocate = willingToRelocate;
    if (hasWorkPermit !== undefined) updateData.hasWorkPermit = hasWorkPermit;
    if (workPermitCountries !== undefined) updateData.workPermitCountries = workPermitCountries;
    if (profileVisibility !== undefined) updateData.profileVisibility = profileVisibility;
    if (openToOpportunities !== undefined) updateData.openToOpportunities = openToOpportunities;
    if (preferredRegions !== undefined) updateData.preferredRegions = preferredRegions;

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        ...(updatedUser as any),
      },
    });

  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
