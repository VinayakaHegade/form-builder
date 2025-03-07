'use client';

import { Icons } from '@/components/Icons';
import QuestionCard from '@/components/QuestionCard';
import QuestionTypeDropdown from '@/components/QuestionTypeDropdown';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, Question, QuestionType } from '@/lib/types';
import { formStore } from '@/lib/store';
import { ArrowUpRight, Check, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import { toast } from 'sonner';

const generateUniqueId = () =>
  `form-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

export default function CreateFormPage({ params }: { params: any }) {
  const unwrappedParams = use(params) as { formId: string };
  const formId = unwrappedParams.formId;

  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [form, setForm] = useState<Form>({
    id: formId,
    title: '',
    questions: [],
  });

  const isFormEmpty = form.questions.length === 0;

  useEffect(() => {
    setIsClient(true);

    if (formId === 'new') {
      const newFormId = generateUniqueId();
      const newForm = {
        id: newFormId,
        title: '',
        questions: [],
      };

      formStore.saveForm(newForm);
      router.replace(`/create/${newFormId}`);
      return;
    }

    const storedForm = formStore.getForm(formId);
    if (storedForm) {
      setForm(storedForm);
    } else {
      const newForm = {
        id: formId,
        title: '',
        questions: [],
      };
      formStore.saveForm(newForm);
      setForm(newForm);
    }
  }, [formId, router]);

  useEffect(() => {
    if (isClient && form.id) {
      formStore.saveForm(form);
    }
  }, [form, isClient]);

  const handleAddQuestion = (type: QuestionType) => {
    const newQuestion: Question = {
      id: `question-${Date.now()}`,
      type,
      title: '',
      required: false,
      options:
        type === QuestionType.SingleSelect
          ? [
              { id: `option-${Date.now()}`, value: '' },
              { id: `option-${Date.now() + 1}`, value: '' },
            ]
          : undefined,
    };

    setForm((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));
  };

  const handleUpdateQuestion = (id: string, data: Partial<Question>) => {
    setForm((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === id ? { ...q, ...data } : q,
      ),
    }));
  };

  const handleSaveDraft = () => {
    formStore.saveForm(form);
    toast.success('Form saved as draft');
  };

  const handlePublish = () => {
    const publishedForm = {
      ...form,
      published: true,
      publishedAt: new Date().toISOString(),
    };

    formStore.saveForm(publishedForm);
    toast.success('Form published');
    router.push(`/submit/${publishedForm.id}`);
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
      <header className='border-border-gray-200 xs:justify-between xs:flex-nowrap flex flex-wrap items-center justify-center gap-3 border-b px-6 py-3'>
        <div className='flex items-center gap-2'>
          <Input
            className='h-5.5 border-none p-0 !text-base/[1.375rem] font-semibold shadow-none focus-visible:ring-0'
            placeholder='Untitled form'
            value={form.title}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, title: e.target.value }))
            }
          />
        </div>
        <div className='flex gap-2'>
          {isFormEmpty ? (
            <Button
              variant='outline'
              className='cursor-not-allowed items-center'
              size='sm'
              disabled
            >
              Preview <ArrowUpRight />
            </Button>
          ) : (
            <Link href={`/preview/${form.id}?fromCreate=true`}>
              <Button
                variant='outline'
                className='cursor-pointer items-center'
                size='sm'
              >
                Preview <ArrowUpRight />
              </Button>
            </Link>
          )}
        </div>
      </header>

      <main className='flex flex-1 flex-col items-center p-6'>
        <div className='w-full max-w-3xl'>
          {form.questions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              onUpdate={handleUpdateQuestion}
            />
          ))}

          <div
            className={`flex items-center justify-center ${form.questions.length > 0 ? 'pt-4 pb-2' : ''}`}
          >
            <QuestionTypeDropdown
              onSelectType={handleAddQuestion}
              label='INPUT TYPES'
            />
          </div>
        </div>
      </main>

      <footer className='border-border-gray-200 bg-bg-gray-100/90 xs:justify-between flex flex-wrap items-center justify-center gap-2.5 border-t px-6 py-4 backdrop-blur-xs'>
        <Button
          variant='outline'
          className='cursor-pointer items-center'
          size='sm'
          onClick={handleSaveDraft}
          disabled={isFormEmpty}
        >
          <Icons.draft />
          Save as Draft
        </Button>
        <Button
          className='shadow-custom-sm bg-green-350 border-green-550 cursor-pointer items-center border hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50'
          size='sm'
          onClick={handlePublish}
          disabled={form.published || isFormEmpty}
        >
          <Check />
          {form.published ? 'Published' : 'Publish form'}
        </Button>
      </footer>
    </article>
  );
}
