import { revalidatePath, revalidateTag } from "next/cache";

export async function revalidateData(path?: string, tags?: string[]) {
  try {
    // Revalidate specific path if provided
    if (path) {
      revalidatePath(path);
    }
    
    // Revalidate common paths
    revalidatePath('/');
    revalidatePath('/admin');
    revalidatePath('/questions');
    
    // Revalidate specific tags if provided
    if (tags && tags.length > 0) {
      tags.forEach(tag => revalidateTag(tag));
    }
    
    // Revalidate common tags
    revalidateTag('questions');
    revalidateTag('users');
    revalidateTag('rewards');
    revalidateTag('answers');
    
    console.log('Revalidation completed successfully');
  } catch (error) {
    console.error('Revalidation error:', error);
  }
}

export const CACHE_TAGS = {
  QUESTIONS: 'questions',
  USERS: 'users',
  REWARDS: 'rewards',
  ANSWERS: 'answers',
} as const;
