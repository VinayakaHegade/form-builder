'use client';

import { useState, useEffect } from 'react';
import { Form } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import FormField from '@/components/FormField';
import { formStore } from '@/lib/store';
import { use } from 'react';

export default function PreviewPage({ params }: { params: any }) {
  const unwrappedParams = use(params) as { formId: string };
  const formId = unwrappedParams.formId;

  const [isClient, setIsClient] = useState(false);
  const [form, setForm] = useState<Form | null>(null);
  const [formNotFound, setFormNotFound] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const fetchedForm = formStore.getForm(formId);

    if (fetchedForm) {
      setForm(fetchedForm);
      formStore.setLastEditedForm(formId);
    } else {
      setFormNotFound(true);
    }
  }, [formId]);

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
        <Link href='/create'>
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
      <header className='border-border-gray-200 xs:justify-between xs:flex-nowrap flex flex-wrap items-center justify-between gap-2 border-b px-6 py-3'>
        <h1 className='text-base font-semibold'>
          {form.title || 'Untitled Form'}
        </h1>
        <Link href={`/create/${formId}`}>
          <Button
            variant='outline'
            className='flex h-8 cursor-pointer items-center gap-1 px-4 py-0'
          >
            <ChevronLeft className='h-4 w-4' />
            Back to Editor
          </Button>
        </Link>
      </header>

      <main className='flex flex-1 flex-col items-center p-6'>
        <div className='w-full max-w-3xl'>
          <div className='mb-6 rounded-lg border border-gray-200 bg-white p-4'>
            <h1 className='text-base font-semibold'>
              {form.title || 'Untitled Form'}
            </h1>
            <p className='text-sm text-gray-500'>Preview Mode</p>
          </div>

          {form.questions.length === 0 ? (
            <div className='mb-4 rounded-lg border border-gray-200 bg-white p-4 text-center'>
              <p className='text-gray-500'>
                This form has no questions yet. Go back to add some questions.
              </p>
            </div>
          ) : (
            form.questions.map((question) => (
              <div
                key={question.id}
                className='mb-4 rounded-lg border border-gray-200 bg-white p-4'
              >
                <div className='mb-2'>
                  <h2 className='text-sm font-semibold'>
                    {question.title || 'Untitled Question'}
                    {question.required && (
                      <span className='ml-1 text-red-500'>*</span>
                    )}
                  </h2>
                  {question.helpText && (
                    <p className='text-xs text-gray-500'>{question.helpText}</p>
                  )}
                </div>

                <FormField question={question} readOnly={true} />
              </div>
            ))
          )}
        </div>
      </main>
    </article>
  );
}
