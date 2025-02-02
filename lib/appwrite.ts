import { Account, Avatars, Client, OAuthProvider } from "react-native-appwrite";
import * as Linking from "expo-linking";
import { openAuthSessionAsync } from "expo-web-browser";

export const config = {
  platform: "com.estate.truehome",
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
};

export const client = new Client();

client
  .setEndpoint(config.endpoint!)
  .setProject(config.projectId!)
  .setPlatform(config.platform!);

export const avatar = new Avatars(client); // set the user avatar using the first and last letter of the user's name
export const account = new Account(client); // create a new user account

// LOGIN FUNCTION STARTS
export async function login() {
  try {
    const redirectUri = Linking.createURL("/"); // generate a redirect uri to the home page once the google login is successful

    // create an OAuth token from appwrite using the google provider
    const response = await account.createOAuth2Token(
      OAuthProvider.Google,
      redirectUri
    );

    if (!response) throw new Error("Failed to login");

    // if the create OAuth token is successful, we will open a web browser session for OAuth process to continue
    const browserResult = await openAuthSessionAsync(
      response.toString(),
      redirectUri
    );

    if (browserResult.type !== "success") throw new Error("Failed to login");

    // if success, parse the newly returned URL to extract the query parameters
    const url = new URL(browserResult.url);
    const secret = url.searchParams.get("secret")?.toString();
    const userId = url.searchParams.get("userId")?.toString();

    if (!secret || !userId) throw new Error("Failed to login");

    // create a session cookie using the secret and user id
    const session = await account.createSession(userId, secret);

    if (!session) throw new Error("Failed to create a session");

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

// LOGIN FUNCTION ENDS

// LOGOUT FUNCTION STARTS
export async function logout() {
  try {
    await account.deleteSession("current");

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
// LOGOUT FUNCTION ENDS

// GET USER FUNCTION STARTS
export async function getUser() {
  try {
    const response = await account.get();

    if (response.$id) {
      const userAvatar = avatar.getInitials(response.name);

      return {
        ...response,
        avatar: userAvatar.toString(),
      };
    }
  } catch (error) {
    console.log(error);
    return null;
  }
}
// GET USER FUNCTION ENDS
