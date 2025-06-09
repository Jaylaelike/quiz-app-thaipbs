// Game Logic and Algorithm for Quiz System

export interface QuestionData {
  id: string;
  content: string;
  status: string;
  rewardPoints?: number;
  createdAt: string;
  user: {
    id: string;
    username: string;
    role: string;
  };
  answers?: AnswerData[];
}

export interface AnswerData {
  id: string;
  content: string;
  isCorrect: boolean;
  userId: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
    role: string;
  };
}

export interface UserProgressData {
  userId: string;
  totalAnswered: number;
  correctAnswers: number;
  totalPoints: number;
  accuracy: number;
  questionsAnswered: string[];
}

// Question Management Algorithm
export class QuestionManager {
  /**
   * Get available questions for a user (not answered yet)
   */
  static getAvailableQuestions(allQuestions: QuestionData[], userId: string): QuestionData[] {
    return allQuestions.filter(question => {
      // Only production status questions
      if (question.status !== 'production') return false;
      
      // Check if user has already answered this question
      const hasAnswered = question.answers?.some(
        answer => answer.user.role !== 'admin' && answer.userId === userId
      ) || false;
      
      return !hasAnswered;
    });
  }

  /**
   * Get questions user has already answered
   */
  static getAnsweredQuestions(allQuestions: QuestionData[], userId: string): QuestionData[] {
    return allQuestions.filter(question => {
      return question.answers?.some(
        answer => answer.user.role !== 'admin' && answer.userId === userId
      ) || false;
    });
  }

  /**
   * Check if question has proper admin answers (multiple choice options)
   */
  static hasMultipleChoiceOptions(question: QuestionData): boolean {
    const adminAnswers = question.answers?.filter(answer => answer.user.role === 'admin') || [];
    return adminAnswers.length >= 2; // At least 2 options for multiple choice
  }

  /**
   * Get admin answers (correct answer options)
   */
  static getAdminAnswers(question: QuestionData): AnswerData[] {
    return question.answers?.filter(answer => answer.user.role === 'admin') || [];
  }

  /**
   * Calculate question difficulty based on user responses
   */
  static calculateDifficulty(question: QuestionData): 'easy' | 'medium' | 'hard' {
    const userAnswers = question.answers?.filter(answer => answer.user.role !== 'admin') || [];
    
    if (userAnswers.length === 0) return 'medium'; // Default for new questions
    
    const correctAnswers = userAnswers.filter(answer => answer.isCorrect).length;
    const accuracy = (correctAnswers / userAnswers.length) * 100;
    
    if (accuracy >= 80) return 'easy';
    if (accuracy >= 50) return 'medium';
    return 'hard';
  }
}

// User Progress Algorithm
export class UserProgressManager {
  /**
   * Calculate user progress and statistics
   */
  static calculateUserProgress(allQuestions: QuestionData[], userId: string): UserProgressData {
    const answeredQuestions = QuestionManager.getAnsweredQuestions(allQuestions, userId);
    
    let correctAnswers = 0;
    let totalPoints = 0;
    const questionsAnswered: string[] = [];
    
    answeredQuestions.forEach(question => {
      const userAnswer = question.answers?.find(
        answer => answer.user.role !== 'admin' && answer.userId === userId
      );
      
      if (userAnswer) {
        questionsAnswered.push(question.id);
        if (userAnswer.isCorrect) {
          correctAnswers++;
          totalPoints += question.rewardPoints || 5;
        }
      }
    });
    
    const accuracy = answeredQuestions.length > 0 
      ? (correctAnswers / answeredQuestions.length) * 100 
      : 0;
    
    return {
      userId,
      totalAnswered: answeredQuestions.length,
      correctAnswers,
      totalPoints,
      accuracy,
      questionsAnswered
    };
  }

  /**
   * Get user ranking compared to others
   */
  static getUserRanking(userProgress: UserProgressData, allUsersProgress: UserProgressData[]): {
    rank: number;
    totalUsers: number;
    percentile: number;
  } {
    // Sort users by total points (descending)
    const sortedUsers = allUsersProgress.sort((a, b) => b.totalPoints - a.totalPoints);
    
    const userRank = sortedUsers.findIndex(user => user.userId === userProgress.userId) + 1;
    const totalUsers = sortedUsers.length;
    const percentile = totalUsers > 1 ? ((totalUsers - userRank) / (totalUsers - 1)) * 100 : 100;
    
    return {
      rank: userRank,
      totalUsers,
      percentile: Math.round(percentile)
    };
  }
}

// Answer Validation Algorithm
export class AnswerValidator {
  /**
   * Validate user answer against correct answer
   */
  static validateAnswer(userAnswerId: string, question: QuestionData): {
    isCorrect: boolean;
    correctAnswer: AnswerData | null;
    points: number;
  } {
    const adminAnswers = QuestionManager.getAdminAnswers(question);
    const selectedAnswer = adminAnswers.find(answer => answer.id === userAnswerId);
    const correctAnswer = adminAnswers.find(answer => answer.isCorrect);
    
    if (!selectedAnswer) {
      return {
        isCorrect: false,
        correctAnswer,
        points: 0
      };
    }
    
    const isCorrect = selectedAnswer.isCorrect;
    const points = isCorrect ? (question.rewardPoints || 5) : 0;
    
    return {
      isCorrect,
      correctAnswer,
      points
    };
  }

  /**
   * Calculate time bonus (if answered quickly)
   */
  static calculateTimeBonus(timeRemaining: number, maxTime: number): number {
    if (timeRemaining <= 0) return 0;
    
    const timeRatio = timeRemaining / maxTime;
    
    // Bonus points for quick answers
    if (timeRatio > 0.8) return 2; // 80%+ time left: +2 points
    if (timeRatio > 0.6) return 1; // 60%+ time left: +1 point
    return 0;
  }
}

// Game Flow Algorithm
export class GameFlowManager {
  /**
   * Determine next question for user based on difficulty and progress
   */
  static getNextRecommendedQuestion(
    availableQuestions: QuestionData[], 
    userProgress: UserProgressData
  ): QuestionData | null {
    if (availableQuestions.length === 0) return null;
    
    // For beginners, start with easier questions
    if (userProgress.totalAnswered < 3) {
      const easyQuestions = availableQuestions.filter(q => 
        QuestionManager.calculateDifficulty(q) === 'easy'
      );
      
      if (easyQuestions.length > 0) {
        return easyQuestions[0];
      }
    }
    
    // For experienced users, mix difficulty based on accuracy
    if (userProgress.accuracy >= 80) {
      // High accuracy users get harder questions
      const hardQuestions = availableQuestions.filter(q => 
        QuestionManager.calculateDifficulty(q) === 'hard'
      );
      
      if (hardQuestions.length > 0) {
        return hardQuestions[0];
      }
    } else if (userProgress.accuracy < 50) {
      // Low accuracy users get easier questions
      const easyQuestions = availableQuestions.filter(q => 
        QuestionManager.calculateDifficulty(q) === 'easy'
      );
      
      if (easyQuestions.length > 0) {
        return easyQuestions[0];
      }
    }
    
    // Default: return first available question
    return availableQuestions[0];
  }

  /**
   * Generate game session data
   */
  static createGameSession(
    questions: QuestionData[], 
    userId: string
  ): {
    availableQuestions: QuestionData[];
    userProgress: UserProgressData;
    recommendedQuestion: QuestionData | null;
    gameStats: {
      totalQuestions: number;
      completionRate: number;
      averageDifficulty: string;
    };
  } {
    const availableQuestions = QuestionManager.getAvailableQuestions(questions, userId);
    const userProgress = UserProgressManager.calculateUserProgress(questions, userId);
    const recommendedQuestion = GameFlowManager.getNextRecommendedQuestion(availableQuestions, userProgress);
    
    const totalQuestions = questions.filter(q => q.status === 'production').length;
    const completionRate = totalQuestions > 0 ? (userProgress.totalAnswered / totalQuestions) * 100 : 0;
    
    // Calculate average difficulty of available questions
    const difficulties = availableQuestions.map(q => QuestionManager.calculateDifficulty(q));
    const difficultyScore = difficulties.reduce((sum, diff) => {
      if (diff === 'easy') return sum + 1;
      if (diff === 'medium') return sum + 2;
      return sum + 3; // hard
    }, 0);
    
    const avgDifficultyScore = difficulties.length > 0 ? difficultyScore / difficulties.length : 2;
    let averageDifficulty = 'medium';
    if (avgDifficultyScore < 1.5) averageDifficulty = 'easy';
    else if (avgDifficultyScore > 2.5) averageDifficulty = 'hard';
    
    return {
      availableQuestions,
      userProgress,
      recommendedQuestion,
      gameStats: {
        totalQuestions,
        completionRate: Math.round(completionRate),
        averageDifficulty
      }
    };
  }
}