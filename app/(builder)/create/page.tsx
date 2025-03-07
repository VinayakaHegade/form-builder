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
import { useRouter, useSearchParams } from 'next/navigation';

const generateUniqueId = () =>
  `form-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

const TEMP_DRAFT_ID = 'temp-draft-form';

export default function Create() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const formIdParam = searchParams.get('formId');

  const [isClient, setIsClient] = useState(false);
  const [form, setForm] = useState<Form>({
    id: TEMP_DRAFT_ID,
    title: '',
    questions: [],
  });

  const [hasPermanentId, setHasPermanentId] = useState(false);

  useEffect(() => {
    setIsClient(true);

    if (formIdParam) {
      const paramForm = formStore.getForm(formIdParam);
      if (paramForm) {
        setForm(paramForm);
        setHasPermanentId(paramForm.id !== TEMP_DRAFT_ID);
        return;
      }
    }

    const lastEditedForm = formStore.getLastEditedForm();
    if (lastEditedForm) {
      setForm(lastEditedForm);
      setHasPermanentId(lastEditedForm.id !== TEMP_DRAFT_ID);
      return;
    }

    const tempDraft = formStore.getOrCreateTempDraft();
    setForm(tempDraft);
    setHasPermanentId(false);
  }, [formIdParam]);

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
              { id: `option-${Date.now()}`, value: 'Option 1' },
              { id: `option-${Date.now() + 1}`, value: 'Option 2' },
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

  const ensurePermanentId = () => {
    if (form.id === TEMP_DRAFT_ID) {
      const permanentId = generateUniqueId();

      const updatedForm = { ...form, id: permanentId };

      formStore.saveForm(updatedForm);

      setForm(updatedForm);
      setHasPermanentId(true);

      return updatedForm;
    }

    return form;
  };

  const handleSaveDraft = () => {
    const savedForm = ensurePermanentId();
    formStore.saveForm(savedForm);
    alert('Form saved as draft');
  };

  const handlePublish = () => {
    const savedForm = ensurePermanentId();
    formStore.saveForm(savedForm);
    alert('Form published successfully');
  };

  const handlePreview = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const formWithId = ensurePermanentId();
    router.push(`/preview/${formWithId.id}?fromCreate=true`);
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
        <Input
          className='h-5.5 border-none p-0 !text-base/[1.375rem] font-semibold shadow-none focus-visible:ring-0'
          placeholder='Untitled form'
          value={form.title}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, title: e.target.value }))
          }
        />
        <Link
          href={hasPermanentId ? `/preview/${form.id}?fromCreate=true` : '#'}
          onClick={!hasPermanentId ? handlePreview : undefined}
        >
          <Button
            variant='outline'
            className='cursor-pointer items-center'
            size='sm'
          >
            Preview <ArrowUpRight />
          </Button>
        </Link>
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
        >
          <Icons.draft />
          Save as Draft
        </Button>
        <Button
          className='shadow-custom-sm bg-green-350 border-green-550 cursor-pointer items-center border hover:bg-green-600'
          size='sm'
          onClick={handlePublish}
        >
          <Check />
          Publish form
        </Button>
      </footer>
    </article>
  );
}
