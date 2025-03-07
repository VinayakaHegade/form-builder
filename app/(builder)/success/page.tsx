'use client';

import { useEffect, useState, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowLeft, Copy, Check } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { formStore } from '@/lib/store';

function SuccessContent() {
  const searchParams = useSearchParams();
  const formId = searchParams.get('formId');

  const [formTitle, setFormTitle] = useState('your form');
  const [formLink, setFormLink] = useState('');

  useEffect(() => {
    if (formId) {
      const form = formStore.getForm(formId);
      if (form) {
        setFormTitle(form.title || 'your form');
      }

      const baseUrl = window.location.origin;
      setFormLink(`${baseUrl}/submit/${formId}`);
    }
  }, [formId]);

  return (
    <div className='flex min-h-dvh flex-col items-center justify-center p-6'>
      <div className='mb-6 flex flex-col items-center justify-center text-center'>
        <div className='mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100'>
          <CheckCircle className='h-8 w-8 text-green-500' />
        </div>
        <h1 className='mb-2 text-2xl font-semibold'>Success!</h1>
        <p className='text-base text-gray-600'>
          You have successfully filled out {formTitle}.
        </p>
      </div>

      {formId && (
        <div className='mb-6 w-full max-w-md'>
          <p className='mb-2 text-sm text-gray-500'>Form link:</p>
          <div className='flex w-full items-center gap-2 rounded-md border border-gray-200 bg-gray-50 p-2'>
            <input
              type='text'
              value={formLink}
              readOnly
              className='flex-1 border-none bg-transparent text-sm focus:outline-none'
            />
          </div>
        </div>
      )}

      <div className='flex flex-wrap gap-4'>
        <Link href='/create/new'>
          <Button variant='outline' className='flex items-center gap-2'>
            <ArrowLeft className='h-4 w-4' />
            Create new form
          </Button>
        </Link>
        {formId && (
          <Link href={`/preview/${formId}`}>
            <Button className='bg-green-350 border-green-550 shadow-custom-sm border hover:bg-green-600'>
              View form
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}

// Main page component with Suspense
export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className='flex min-h-dvh items-center justify-center'>
          Loading...
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
