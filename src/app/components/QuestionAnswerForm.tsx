"use client";
import React, { useState } from "react";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { FormInputAnswer, FormInputPost } from "../types";

interface QuestionAnswerFormProps {
  submit: (data: { question: FormInputPost; answers: FormInputAnswer[] }) => Promise<void>;
  isEditing?: boolean;
  initialQuestion?: FormInputPost;
  initialAnswers?: FormInputAnswer[];
}

interface FormData {
  question: Omit<FormInputPost, 'id'> & { id?: string; rewardPoints?: number };
  answers: (Omit<FormInputAnswer, 'questionId' | 'userId'> & { id?: string })[];
}

const QuestionAnswerForm: React.FC<QuestionAnswerFormProps> = ({
  submit,
  isEditing = false,
  initialQuestion = { content: '', status: 'draft', userId: '', rewardPoints: 0 },
  initialAnswers = []
}) => {
  const router = useRouter();
  const auth = useAuth();
  const userId = auth?.userId || '';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    setValue
  } = useForm<FormData>({
    defaultValues: {
      question: { ...initialQuestion, userId, rewardPoints: initialQuestion.rewardPoints || 0 },
      answers: initialAnswers.length > 0 
        ? initialAnswers 
        : [{ content: '', isCorrect: false }, { content: '', isCorrect: false }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "answers",
  });

  const onSubmit: SubmitHandler<FormData> = async (data): Promise<void> => {
    // Validate at least one correct answer
    const hasCorrectAnswer = data.answers.some(answer => answer.isCorrect);
    if (!hasCorrectAnswer) {
      alert('Please mark at least one answer as correct');
      return;
    }

    // Validate all answers have content
    if (data.answers.some(answer => !answer.content.trim())) {
      alert('All answers must have content');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Add userId to each answer and remove the temporary id
      const answers = data.answers.map(({ id, ...rest }) => ({
        ...rest,
        userId: userId || '',
        questionId: (initialQuestion as any)?.id || ''
      })) as FormInputAnswer[];

      await submit({
        question: { ...data.question, userId: userId || '', rewardPoints: data.question.rewardPoints || 0 },
        answers
      });

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        if (!isEditing) {
          reset();
        }
      }, 2000);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addAnswer = () => {
    append({ content: '', isCorrect: false });
  };

  const removeAnswer = (index: number) => {
    if (fields.length > 2) {
      remove(index);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {isEditing ? 'Edit Question' : 'Create New Question'}
      </h2>

      {showSuccess && (
        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-md">
          {isEditing ? 'Question updated successfully!' : 'Question created successfully!'}
        </div>
      )}

      {/* Question Section */}
      <div className="mb-8 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Question</h3>
        
        <div className="w-full mb-6">
          <label htmlFor="question-content" className="block text-sm font-medium text-gray-700 mb-2">
            Question Content *
          </label>
          <textarea
            id="question-content"
            {...register("question.content", { 
              required: 'Question content is required',
              minLength: { value: 10, message: 'Question must be at least 10 characters long' }
            })}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.question?.content ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isSubmitting}
            rows={4}
          />
          {errors.question?.content && (
            <p className="mt-1 text-sm text-red-600">
              {errors.question.content.message}
            </p>
          )}
        </div>

        {/* Reward Points Section */}
        <div className="w-full mb-6">
          <label htmlFor="question-reward-points" className="block text-sm font-medium text-gray-700 mb-2">
            Reward Points (Optional)
          </label>
          <input
            id="question-reward-points"
            type="number"
            {...register("question.rewardPoints", {
              valueAsNumber: true,
              min: { value: 0, message: 'Reward points cannot be negative' }
            })}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.question?.rewardPoints ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isSubmitting}
            placeholder="e.g., 10"
          />
          {errors.question?.rewardPoints && (
            <p className="mt-1 text-sm text-red-600">
              {errors.question.rewardPoints.message}
            </p>
          )}
        </div>

        <div className="w-full mb-4">
          <label htmlFor="question-status" className="block text-sm font-medium text-gray-700 mb-2">
            Status *
          </label>
          <select
            id="question-status"
            {...register("question.status", { 
              required: 'Please select a status',
            })}
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.question?.status ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isSubmitting}
          >
            <option value="draft">Draft</option>
            <option value="production">Production</option>
          </select>
          {errors.question?.status && (
            <p className="mt-1 text-sm text-red-600">{errors.question.status.message}</p>
          )}
        </div>
      </div>

      {/* Answers Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-700">Answers</h3>
          <button
            type="button"
            onClick={addAnswer}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            disabled={isSubmitting || fields.length >= 5}
          >
            + Add Answer
          </button>
        </div>

        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <div className="mt-2">
                <input
                  type="radio"
                  checked={field.isCorrect}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    // When a radio is selected, update all answers' isCorrect state
                    const currentFields = getValues('answers');
                    const updatedFields = currentFields.map((f, i) => ({
                      ...f,
                      isCorrect: i === index
                    }));
                    setValue('answers', updatedFields, { shouldValidate: true });
                  }}
                  className={`radio ${isSubmitting ? 'opacity-60' : 'radio-success'}`}
                  disabled={isSubmitting}
                  name="correct-answer" // Same name for radio group
                />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  {...register(`answers.${index}.content` as const, {
                    required: 'Answer content is required'
                  })}
                  placeholder={`Answer ${index + 1}`}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.answers?.[index]?.content ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={isSubmitting}
                />
                {errors.answers?.[index]?.content && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.answers[index]?.content?.message}
                  </p>
                )}
              </div>
              {fields.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeAnswer(index)}
                  className="mt-2 text-red-500 hover:text-red-700"
                  disabled={isSubmitting}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className={`px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {isEditing ? 'Updating...' : 'Creating...'}
            </span>
          ) : isEditing ? 'Update Question' : 'Create Question'}
        </button>
      </div>
    </form>
  );
};

export default QuestionAnswerForm;
