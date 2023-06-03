import { invitations, users } from '@clerk/clerk-sdk-node';
import { UserModel } from '@truesign/mongo';

interface CreateInviteLinkOptions {
  email: string;
  metadata: {
    isStudent: boolean;
    isStaff: boolean;
  };
}

/**
 * Creates an invite link for a user to sign up to the app
 */
export const CreateInviteLink = async ({
  email,
  metadata,
}: CreateInviteLinkOptions) => {
  try {
    const invitation = await invitations.createInvitation({
      emailAddress: email,
      publicMetadata: metadata,
    });

    if (!invitation.id) {
      throw new Error('Did not receive an invitation ID');
    }

    return invitation.id;
  } catch (error) {
    console.log('Error ocurred in Clerk InviteLink');
    console.log(error);

    if (error.clerkError && Array.isArray(error.errors)) {
      const errors = error.errors;
      const errorMessages = errors.map((error) => error.message);

      throw new Error(errorMessages.join(', '));
    }

    throw error;
  }
};

export const SyncClerkFromDB = async (clerk_id: string) => {
  const clerkUser = await users.getUser(clerk_id);
  const mongoUser = await UserModel.findOne({
    email: clerkUser.emailAddresses[0].emailAddress,
  });

  await users.updateUser(clerk_id, {
    externalId: mongoUser._id.toString(),
    firstName: mongoUser.firstName,
    lastName: mongoUser.lastName,
  });
};
