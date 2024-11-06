export function generateRef(): string {
  const timestamp = Date.now().toString(36); // Convert current timestamp to base36 string
  const randomString = Math.random().toString(36).substring(2, 8); // Generate a random string
  return `${timestamp}${randomString}`.toLowerCase(); // Combine timestamp and random string
}