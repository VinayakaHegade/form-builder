'use client';

import { Form } from './types';

class FormStore {
  private readonly STORAGE_KEY = 'form-builder-forms';
  private readonly LAST_EDITED_KEY = 'form-builder-last-edited';
  private readonly TEMP_DRAFT_ID = 'temp-draft-form';

  private get isClient() {
    return typeof window !== 'undefined';
  }

  private getAllForms(): Record<string, Form> {
    if (!this.isClient) return {};

    try {
      const storedForms = localStorage.getItem(this.STORAGE_KEY);
      return storedForms ? JSON.parse(storedForms) : {};
    } catch (error) {
      console.error('Error retrieving forms from localStorage:', error);
      return {};
    }
  }

  private saveAllForms(forms: Record<string, Form>): void {
    if (!this.isClient) return;

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(forms));
    } catch (error) {
      console.error('Error saving forms to localStorage:', error);
    }
  }

  setLastEditedForm(id: string): void {
    if (!this.isClient) return;

    try {
      localStorage.setItem(this.LAST_EDITED_KEY, id);
    } catch (error) {
      console.error('Error saving last edited form ID:', error);
    }
  }

  getLastEditedFormId(): string | null {
    if (!this.isClient) return null;

    try {
      return localStorage.getItem(this.LAST_EDITED_KEY);
    } catch (error) {
      console.error('Error retrieving last edited form ID:', error);
      return null;
    }
  }

  getForm(id: string): Form | undefined {
    const forms = this.getAllForms();
    return forms[id];
  }

  getLastEditedForm(): Form | undefined {
    const lastEditedId = this.getLastEditedFormId();
    if (lastEditedId) {
      return this.getForm(lastEditedId);
    }
    return undefined;
  }

  saveForm(form: Form): void {
    const forms = this.getAllForms();
    forms[form.id] = { ...form };
    this.saveAllForms(forms);
    this.setLastEditedForm(form.id);
  }

  listForms(): Form[] {
    const forms = this.getAllForms();
    return Object.values(forms);
  }

  deleteForm(id: string): void {
    const forms = this.getAllForms();
    if (forms[id]) {
      delete forms[id];
      this.saveAllForms(forms);

      if (this.getLastEditedFormId() === id) {
        this.setLastEditedForm('');
      }
    }
  }

  getOrCreateTempDraft(): Form {
    const existingDraft = this.getForm(this.TEMP_DRAFT_ID);

    if (existingDraft) {
      return existingDraft;
    }

    const newDraft: Form = {
      id: this.TEMP_DRAFT_ID,
      title: '',
      questions: [],
    };

    this.saveForm(newDraft);
    return newDraft;
  }
}

export const formStore = new FormStore();
