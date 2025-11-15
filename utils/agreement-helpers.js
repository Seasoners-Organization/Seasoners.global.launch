/**
 * Agreement Helper Utilities
 * Functions to generate agreements from listings and create default clause templates
 */

/**
 * Generate default agreement preamble based on listing type
 */
export function generatePreamble(listing, host, guest) {
  const location = listing.city 
    ? `${listing.city}, ${listing.region}` 
    : listing.location || listing.region;

  if (listing.type === 'STAY') {
    return `Welcome to ${listing.title} in ${location}.

This Smart Stay Agreement is designed to help both of us build trust from day one. It's written in plain language so we both know what's expected — and what's fair.

As your host, I'm committed to providing a safe, clean, and welcoming space. As my guest, you're agreeing to treat the space with respect and communicate openly if any issues arise.

This is more than a rental — it's a human connection across borders. Let's make this season memorable for the right reasons.

– ${host.name}`;
  } else {
    // JOB type
    return `Welcome to ${listing.title} in ${location}.

This agreement outlines the terms of your seasonal employment with us. We believe in clear expectations, fair treatment, and open communication.

As your employer, we commit to providing a safe work environment, clear responsibilities, and timely payment. As our team member, you're agreeing to show up with professionalism, respect, and a willingness to learn.

Seasonal work is challenging but rewarding. Let's make this season successful together.

– ${host.name}`;
  }
}

/**
 * Generate default clauses based on listing type
 */
export function generateClauses(listing) {
  if (listing.type === 'STAY') {
    return [
      {
        title: 'Duration & Location',
        content: `Property: ${listing.title}
Location: ${listing.city ? `${listing.city}, ${listing.region}` : listing.location || listing.region}
Monthly Rate: €${listing.price}

The stay dates will be agreed upon between both parties before signing. Either party may end the stay early with 14 days' notice (or as required by local law).`,
        order: 1,
      },
      {
        title: 'Payment Terms',
        content: `Rent: €${listing.price} per month
Due: First day of each month
Payment Method: Bank transfer or as agreed

A refundable security deposit may be required. Any deposits will be returned within 14 days of checkout, minus deductions for damages beyond normal wear and tear. Receipts will be provided for any deductions.`,
        order: 2,
      },
      {
        title: 'House Rules & Responsibilities',
        content: `• Quiet hours: 22:00 - 07:00
• Common areas: Keep shared spaces clean and tidy
• Guests: Notify host in advance
• Smoking: [Specify policy]
• Pets: [Specify policy]
• Registration: Complete local registration requirements within 3 days of arrival

The guest agrees to maintain the property in good condition and report any maintenance issues promptly.`,
        order: 3,
      },
      {
        title: 'Utilities & Services',
        content: `Included in rent:
• Basic utilities (electricity, water, heating)
• Internet/WiFi
• [Add other included services]

Not included:
• [Specify any exclusions]

If utility usage is excessive, the host may request reasonable additional compensation.`,
        order: 4,
      },
      {
        title: 'Cultural Consideration',
        content: `Both parties acknowledge that cultural differences may exist in communication styles, expectations, and daily habits.

We agree to:
• Approach differences with curiosity and respect
• Communicate openly when something feels unclear
• Resolve misunderstandings through conversation first
• Seek to understand before being understood

If language barriers exist, we'll use translation tools and patience to ensure clear communication.`,
        order: 5,
      },
      {
        title: 'Termination & Exit',
        content: `Either party may terminate this agreement with 14 days written notice (or as required by local law).

Early termination reasons may include:
• Change in personal circumstances
• Breach of agreement terms
• Mutual agreement

Upon termination:
• Guest returns keys and removes all belongings
• Host inspects property and returns deposit (minus any valid deductions)
• Both parties confirm no outstanding obligations

Rent is not prorated for partial months unless otherwise agreed.`,
        order: 6,
      },
      {
        title: 'Dispute Resolution',
        content: `If a dispute arises, both parties agree to:

1. First, have a direct conversation to understand each other's perspective
2. If unresolved, exchange written summaries of the issue
3. If still unresolved, seek local mediation services
4. Only pursue legal action as a final resort

We commit to acting in good faith and giving each other the benefit of the doubt.`,
        order: 7,
      },
      {
        title: 'Legal Jurisdiction',
        content: `This agreement is governed by the laws of Austria (or the country where the property is located).

Both parties acknowledge that:
• This is a template and should be reviewed by local authorities if needed
• Local tenant protection laws may override certain clauses
• Registration with local authorities may be legally required
• Tax obligations may apply and are the responsibility of each party

Neither party provides legal advice. Consult local legal resources for specific questions.`,
        order: 8,
      },
    ];
  } else {
    // JOB type clauses
    return [
      {
        title: 'Position & Duration',
        content: `Position: ${listing.title}
Location: ${listing.city ? `${listing.city}, ${listing.region}` : listing.location || listing.region}
Compensation: €${listing.price} per month

Employment period will be agreed upon between both parties. This is seasonal employment with a defined end date.`,
        order: 1,
      },
      {
        title: 'Responsibilities & Expectations',
        content: `Primary duties:
${listing.description.substring(0, 200)}...

Expected work schedule:
• [Specify hours/days]
• [Specify break periods]
• [Specify overtime policy]

The employee agrees to perform duties professionally and follow all workplace safety protocols.`,
        order: 2,
      },
      {
        title: 'Compensation & Payment',
        content: `Salary: €${listing.price} per month
Payment Schedule: [Specify - weekly/monthly]
Payment Method: Bank transfer

Additional benefits:
• [Staff accommodation - specify if included]
• [Meals - specify if included]
• [Transportation - specify if included]
• [Equipment provided]

Overtime will be compensated according to local labor law.`,
        order: 3,
      },
      {
        title: 'Work Environment & Safety',
        content: `The employer commits to:
• Providing a safe work environment
• Supplying necessary equipment and training
• Following all local health and safety regulations
• Addressing any workplace hazards promptly

The employee commits to:
• Following all safety protocols
• Using protective equipment when required
• Reporting any safety concerns immediately
• Participating in required safety training`,
        order: 4,
      },
      {
        title: 'Cultural Consideration',
        content: `Both parties acknowledge that cultural differences may exist in communication styles, work expectations, and team dynamics.

We agree to:
• Approach differences with respect and openness
• Communicate clearly about expectations
• Seek clarification when instructions are unclear
• Build trust through consistent actions

If language barriers exist, we'll use clear communication methods and patience.`,
        order: 5,
      },
      {
        title: 'Termination',
        content: `Either party may terminate employment with [14] days written notice.

Grounds for immediate termination:
• Serious misconduct or safety violations
• Breach of contract terms
• Mutual agreement

Upon termination:
• Final payment due within [7] days
• Return all company property
• Complete exit interview if requested

The employer will provide a work reference upon request if employment ended in good standing.`,
        order: 6,
      },
      {
        title: 'Legal Compliance',
        content: `This agreement is governed by Austrian labor law (or the labor law where work is performed).

Both parties acknowledge:
• Work permits/visas are the employee's responsibility
• Tax registration and contributions must be handled correctly
• Social insurance requirements must be met
• Local employment regulations apply

Neither party provides legal or tax advice. Consult local authorities for specific requirements.`,
        order: 7,
      },
    ];
  }
}

/**
 * Create an agreement from a listing
 * Returns the data needed to POST to /api/agreements
 */
export function createAgreementFromListing(listing, currentUser, otherUserId, startDate, endDate) {
  const isHost = listing.userId === currentUser.id;
  const hostId = isHost ? currentUser.id : otherUserId;
  const guestId = isHost ? otherUserId : currentUser.id;

  // For now, treat both parties the same in preamble generation
  // In a real implementation, you'd fetch both user objects
  const host = isHost ? currentUser : { name: 'Host' };
  const guest = !isHost ? currentUser : { name: 'Guest' };

  return {
    listingId: listing.id,
    guestId,
    preamble: generatePreamble(listing, host, guest),
    clauses: generateClauses(listing),
    countryCode: 'AT', // Default to Austria, could be derived from listing.region
    startDate: startDate || null,
    endDate: endDate || null,
  };
}

/**
 * Get agreement status display text
 */
export function getStatusLabel(status) {
  const labels = {
    DRAFT: 'Draft',
    PENDING_HOST: 'Awaiting Host Signature',
    PENDING_GUEST: 'Awaiting Guest Signature',
    FULLY_SIGNED: 'Signed',
    ACTIVE: 'Active',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
    DISPUTED: 'Disputed',
  };
  return labels[status] || status;
}

/**
 * Check if user needs to sign agreement
 */
export function needsUserSignature(agreement, userId) {
  const signatures = Array.isArray(agreement.signatures) ? agreement.signatures : [];
  const userSigned = signatures.some((sig) => sig.userId === userId);
  
  if (userSigned) return false;
  
  return (
    agreement.status === 'DRAFT' ||
    agreement.status === 'PENDING_HOST' ||
    agreement.status === 'PENDING_GUEST'
  );
}
