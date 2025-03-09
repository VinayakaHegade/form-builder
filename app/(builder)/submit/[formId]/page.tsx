'use client';

import { useState, useEffect } from 'react';
import { Form } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import FormField from '@/components/FormField';
import { formStore } from '@/lib/store';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import { Progress } from '@/components/ui/progress';

type FormValues = Record<string, any>;

export default function SubmitPage({ params }: { params: any }) {
  const unwrappedParams = use(params) as { formId: string };
  const formId = unwrappedParams.formId;

  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [form, setForm] = useState<Form | null>(null);
  const [formNotFound, setFormNotFound] = useState(false);
  const [formValues, setFormValues] = useState<FormValues>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [completeness, setCompleteness] = useState(0);

  useEffect(() => {
    setIsClient(true);

    const fetchedForm = formStore.getForm(formId);

    if (fetchedForm) {
      setForm(fetchedForm);
    } else {
      setFormNotFound(true);
    }
  }, [formId]);

  useEffect(() => {
    if (form && form.questions.length > 0) {
      const requiredQuestions = form.questions.filter((q) => q.required);

      if (requiredQuestions.length === 0) {
        const filledQuestions = Object.keys(formValues).length;
        const completenessPercentage = Math.round(
          (filledQuestions / form.questions.length) * 100,
        );
        setCompleteness(completenessPercentage);
      } else {
        const filledRequiredQuestions = requiredQuestions.filter(
          (q) => formValues[q.id] !== undefined && formValues[q.id] !== '',
        ).length;
        const completenessPercentage = Math.round(
          (filledRequiredQuestions / requiredQuestions.length) * 100,
        );
        setCompleteness(completenessPercentage);
      }
    }
  }, [form, formValues]);

  const handleFieldChange = (questionId: string, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      [questionId]: value,
    }));

    if (formErrors[questionId]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (form) {
      form.questions.forEach((question) => {
        if (question.required) {
          const value = formValues[question.id];

          if (value === undefined || value === '') {
            newErrors[question.id] = 'This field is required';
            isValid = false;
          }
        }
      });
    }

    setFormErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      const submission = {
        formId,
        formTitle: form?.title || 'Untitled Form',
        submittedAt: new Date().toISOString(),
        values: formValues,
      };

      const storedSubmissions =
        localStorage.getItem('form-submissions') || '[]';
      const submissions = JSON.parse(storedSubmissions);
      submissions.push(submission);
      localStorage.setItem('form-submissions', JSON.stringify(submissions));

      router.push(`/success?formId=${formId}`);
    } else {
      const firstErrorId = Object.keys(formErrors)[0];
      const errorElement = document.getElementById(firstErrorId);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  if (!isClient) {
    return (
      <div className='flex min-h-dvh items-center justify-center'>
        Loading...
      </div>
    );
  }

  if (formNotFound) {
    return (
      <div className='flex min-h-dvh flex-col items-center justify-center p-6'>
        <div className='mb-4 text-center'>
          <h1 className='mb-2 text-xl font-semibold'>Form Not Found</h1>
          <p className='text-gray-500'>
            The form you're looking for doesn't exist or hasn't been created
            yet.
          </p>
        </div>
        <Link href='/create/new'>
          <Button variant='outline'>Create a Form</Button>
        </Link>
      </div>
    );
  }

  if (!form) {
    return (
      <div className='flex min-h-dvh items-center justify-center'>
        Loading...
      </div>
    );
  }

  return (
    <article className='flex min-h-dvh flex-col'>
      <header className='border-border-gray-200 xs:flex-nowrap xs:justify-between flex flex-wrap items-center justify-between gap-3 border-b px-6 py-3'>
        <div className='flex items-center gap-2'>
          <Link href={`/preview/${formId}`}>
            <Button variant='ghost' size='icon' className='h-9 w-9'>
              <ChevronLeft className='h-5 w-5' />
            </Button>
          </Link>
          <h1 className='text-base font-semibold'>Submit form</h1>
        </div>
        <div className='flex w-full max-w-[300px] flex-col items-end gap-2'>
          <span className='text-sm text-gray-500'>
            Form completeness — {completeness}%
          </span>
          <div className='h-1 w-full max-w-[300px] bg-gray-200'>
            <Progress value={completeness} className='h-1.5 rounded-sm' />
          </div>
        </div>
      </header>

      <main className='flex flex-1 flex-col items-center p-6'>
        <form onSubmit={handleSubmit} className='w-full max-w-3xl'>
          {form.questions.map((question) => (
            <div
              id={question.id}
              key={question.id}
              className='mb-4 rounded-lg border border-gray-200 bg-white p-4'
            >
              <div className='mb-2'>
                <h2 className='text-base font-medium'>
                  {question.title || 'Untitled Question'}
                  {question.required && (
                    <span className='ml-1 text-red-500'>*</span>
                  )}
                </h2>
                {question.helpText && (
                  <p className='text-xs text-gray-500'>{question.helpText}</p>
                )}
              </div>

              <FormField
                question={question}
                readOnly={false}
                value={formValues[question.id]}
                onChange={handleFieldChange}
              />

              {formErrors[question.id] && (
                <p className='mt-1 text-sm text-red-500'>
                  {formErrors[question.id]}
                </p>
              )}
            </div>
          ))}

          <div className='mt-6 flex justify-end'>
            <Button
              type='submit'
              className='bg-green-350 border-green-550 shadow-custom-sm cursor-pointer border hover:bg-green-600'
            >
              Submit
            </Button>
          </div>
        </form>
      </main>
    </article>
  );
}
