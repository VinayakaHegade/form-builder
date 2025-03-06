import { Icons } from '@/components/Icons';
import QuestionTypeDropdown from '@/components/QuestionTypeDropdown';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowUpRight, Check, Plus } from 'lucide-react';

export default function Create() {
  return (
    <article className='flex min-h-dvh flex-col'>
      <header className='border-border-gray-200 flex items-center justify-between gap-4 border-b px-6 py-3'>
        <Input
          className='h-5.5 border-none p-0 !text-base/[1.375rem] font-semibold shadow-none focus-visible:ring-0'
          placeholder='Untitled form'
        />
        <Button
          variant='outline'
          className='cursor-pointer items-center'
          size='sm'
        >
          Preview <ArrowUpRight />
        </Button>
      </header>
      <main className='flex flex-1 justify-center p-6'>
        <QuestionTypeDropdown />
      </main>
      <footer className='border-border-gray-200 bg-bg-gray-100/90 flex flex-wrap items-center justify-between gap-4 border-t px-6 py-4 backdrop-blur-xs'>
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
