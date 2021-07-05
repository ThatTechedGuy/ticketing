import argon2 from "argon2";

export class Password {
  /**
   * Hashes a given password and returns the hashed password.
   *
   * @param password - password given by the user
   *
   * @returns {Promise<string>} hashed password if the algorithm is successful
   */
  static hash = async (password: string): Promise<string> => {
    const hash = await argon2.hash(password);
    return hash;
  };

  /**
   * Returns `true` if the password supplied is correct
   * @param hashedPassword stored password
   * @param password password supplied by the user
   *
   * @returns {Promise<boolean>} `true` if the password is valid
   */
  static compare = async (hashedPassword: string, password: string): Promise<boolean> => {
    const isPasswordValid = await argon2.verify(hashedPassword, password);
    return isPasswordValid;
  };
}
