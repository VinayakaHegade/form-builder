'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { formStore } from '@/lib/store';

type Submission = {
  formId: string;
  formTitle: string;
  submittedAt: string;
  values: Record<string, any>;
};

export default function SubmissionsPage() {
  const [isClient, setIsClient] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [forms, setForms] = useState<Record<string, { title: string }>>({});

  useEffect(() => {
    setIsClient(true);

    try {
      const storedSubmissions = localStorage.getItem('form-submissions');
      if (storedSubmissions) {
        setSubmissions(JSON.parse(storedSubmissions));
      }

      const formList = formStore.listForms();
      const formMap: Record<string, { title: string }> = {};
      formList.forEach((form) => {
        formMap[form.id] = { title: form.title || 'Untitled Form' };
      });
      setForms(formMap);
    } catch (error) {
      console.error('Error loading submissions:', error);
    }
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (!isClient) {
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
          <Link href='/create/new'>
            <Button variant='ghost' size='icon' className='h-9 w-9'>
              <ChevronLeft className='h-5 w-5' />
            </Button>
          </Link>
          <h1 className='text-base font-semibold'>Form Submissions</h1>
        </div>
      </header>

      <main className='flex flex-1 flex-col items-center p-6'>
        <div className='w-full max-w-4xl'>
          {submissions.length === 0 ? (
            <div className='mb-4 rounded-lg border border-gray-200 bg-white p-4 text-center'>
              <p className='text-gray-500'>No form submissions yet.</p>
            </div>
          ) : (
            <>
              <h2 className='mb-4 text-xl font-semibold'>Recent Submissions</h2>
              <div className='overflow-hidden rounded-lg border border-gray-200'>
                <table className='w-full border-collapse'>
                  <thead>
                    <tr className='bg-gray-50'>
                      <th className='border-b border-gray-200 px-4 py-2 text-left font-medium'>
                        Form
                      </th>
                      <th className='border-b border-gray-200 px-4 py-2 text-left font-medium'>
                        Submitted
                      </th>
                      <th className='border-b border-gray-200 px-4 py-2 text-left font-medium'>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((submission, index) => (
                      <tr
                        key={index}
                        className='border-b border-gray-200 last:border-0'
                      >
                        <td className='px-4 py-3'>
                          {submission.formTitle ||
                            forms[submission.formId]?.title ||
                            'Unknown Form'}
                        </td>
                        <td className='px-4 py-3'>
                          {formatDate(submission.submittedAt)}
                        </td>
                        <td className='px-4 py-3'>
                          <Link href={`/preview/${submission.formId}`}>
                            <Button variant='outline' size='sm'>
                              View Form
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          <div className='mt-6 flex justify-center'>
            <Link href='/create/new'>
              <Button className='bg-green-350 border-green-550 shadow-custom-sm border hover:bg-green-600'>
                Create New Form
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </article>
  );
}
