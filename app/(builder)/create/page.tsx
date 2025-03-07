'use client';

import { Icons } from '@/components/Icons';
import QuestionCard from '@/components/QuestionCard';
import QuestionTypeDropdown from '@/components/QuestionTypeDropdown';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, Question, QuestionType } from '@/lib/types';
import { ArrowUpRight, Check, Plus } from 'lucide-react';
import { useState } from 'react';

export default function Create() {
  const [form, setForm] = useState<Form>({
    id: `form-${Date.now()}`,
    title: '',
    questions: [],
  });

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
        <Button
          variant='outline'
          className='cursor-pointer items-center'
          size='sm'
        >
          Preview <ArrowUpRight />
        </Button>
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
        >
          <Icons.draft />
          Save as Draft
        </Button>
        <Button
          className='shadow-custom-sm bg-green-350 border-green-550 cursor-pointer items-center border hover:bg-green-600'
          size='sm'
        >
          <Check />
          Publish form
        </Button>
      </footer>
    </article>
  );
}
