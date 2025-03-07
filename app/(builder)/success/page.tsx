'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowLeft, Copy, Check } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { formStore } from '@/lib/store';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const formId = searchParams.get('formId');

  const [formTitle, setFormTitle] = useState('your form');
  const [copied, setCopied] = useState(false);
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
