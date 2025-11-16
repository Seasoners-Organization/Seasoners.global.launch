import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Update user's lastActivity timestamp
 * Call this on meaningful user actions (listings, messages, reviews)
 * @param {string} userId - User ID
 */
export async function trackActivity(userId) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { lastActivity: new Date() }
    });
  } catch (error) {
    console.error('Failed to track activity:', error);
  }
}

/**
 * Update multiple trust metric fields
 * @param {string} userId - User ID
 * @param {Object} updates - Fields to update (e.g., { completedStays: { increment: 1 } })
 */
export async function updateTrustMetrics(userId, updates) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        ...updates,
        lastActivity: new Date()
      }
    });
  } catch (error) {
    console.error('Failed to update trust metrics:', error);
  }
}

export default {
  trackActivity,
  updateTrustMetrics
};
