import AdminTennant from '../models/admin_tennant_model';

interface User {
  id: number; // Assuming id is a number
  username: string; // Assuming username is a string
  // Include other fields if necessary, but they will be ignored
}

interface Tennant {
  id: string; // Assuming id is a number
  username: string; // Assuming username is a string
  // Include other fields if necessary, but they will be ignored
}

export function sanitizeResponseUser(
  user: User
): Pick<User, 'id' | 'username'> {
  return {
    id: user.id,
    username: user.username
  };
}
export function sanitizeResponseTennat(
  user: AdminTennant
): Pick<Tennant, 'id' | 'username'> {
  return {
    id: user.id, // No conversion needed, since id is a UUID (string)
    username: user.username
  };
}
